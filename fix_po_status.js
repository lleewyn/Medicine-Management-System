/**
 * PHARMA WMS - DATABASE CLEANUP SCRIPT (PO STATUS SYNC)
 * Công cụ tự động chuẩn hóa Trạng thái (Status) của Đơn mua hàng (PO) dựa trên thực tế nhập kho.
 * Logic: Duyệt từng dòng hàng (PO Details) và đối soát với số lượng thực nhập (Receipt Details).
 */

const https = require('https');

// 1. CẤU HÌNH KẾT NỐI NOCODB
const NOCO_CONFIG = {
    BASE_URL: 'https://nocodb.data4life.top',
    API_TOKEN: 'CbFCU2G7OdsOVCHr4k315N0J7dQ5MzjJSOVSSU7x'
};

const TABLE_IDS = {
    Purchase_Orders: 'm5u0dkeh3cx11zh',
    Purchase_Order_Details: 'miyern110bb8w23',
    Goods_Receipts: 'm738u03fvi1ywi1',
    Receipt_Details: 'mpayfc3xf9bypov',
    Batches: 'm8r83f9zdxzz56y'
};

// --- HÀM HỖ TRỢ API ---
async function nocoRequest(tableId, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const url = new URL(`${NOCO_CONFIG.BASE_URL}/api/v2/tables/${tableId}/records`);
        if (method === 'GET') {
            url.searchParams.append('limit', '1000');
        }

        const options = {
            hostname: url.hostname,
            path: url.pathname + url.search,
            method: method,
            headers: {
                'xc-token': NOCO_CONFIG.API_TOKEN,
                'Content-Type': 'application/json'
            }
        };

        const req = https.request(options, r => {
            let body = '';
            r.on('data', chunk => body += chunk);
            r.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    resolve(parsed.list || parsed);
                } catch (e) {
                    resolve(body);
                }
            });
        });

        req.on('error', reject);
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

function flatten(val) {
    if (!val) return '';
    if (typeof val === 'object') return val.PO_ID || val.BatchID || val.ProductID || val.ReceiptID || val.Id || '';
    return String(val);
}

// --- CHƯƠNG TRÌNH CHÍNH ---
async function syncPOStatusOnDatabase() {
    console.log('🚀 Đang bắt đầu dọn dẹp và chuẩn hóa trạng thái PO trên Database...');

    try {
        // 1. Tải toàn bộ dữ liệu cần thiết
        console.log('--- 📥 Đang tải dữ liệu từ NocoDB...');
        const [pos, poDetails, receipts, rDetails, batches] = await Promise.all([
            nocoRequest(TABLE_IDS.Purchase_Orders),
            nocoRequest(TABLE_IDS.Purchase_Order_Details),
            nocoRequest(TABLE_IDS.Goods_Receipts),
            nocoRequest(TABLE_IDS.Receipt_Details),
            nocoRequest(TABLE_IDS.Batches)
        ]);

        console.log(`--- ✅ Đã tải: ${pos.length} PO, ${poDetails.length} Chi tiết PO, ${rDetails.length} Chi tiết nhập.`);

        let updateCount = 0;

        // 2. Duyệt từng PO để tính toán lại status
        for (const po of pos) {
            const poId = po.PO_ID;
            
            // Tìm các dòng hàng của PO này
            const items = poDetails.filter(d => flatten(d.PO_ID) === poId);
            if (items.length === 0) continue;

            // Tìm các phiếu nhập của PO này
            const poReceipts = receipts.filter(r => flatten(r.PO_ID) === poId);
            const poReceiptIds = poReceipts.map(r => r.ReceiptID || r.Id);

            let fullyReceivedCount = 0;
            let poTotalReceived = 0;
            let poTotalOrdered = items.reduce((acc, it) => acc + (it.OrderedQty || 0), 0);

            // Kiểm tra từng dòng hàng
            items.forEach(item => {
                const pid = flatten(item.ProductID);
                
                // Tính tổng thực nhập cho sản phẩm này của riêng PO này
                const itemReceived = rDetails.filter(rd => {
                    const rid = flatten(rd.ReceiptID);
                    const b = batches.find(b => b.BatchID === flatten(rd.BatchID));
                    const rdPid = b ? b.ProductID : flatten(rd.ProductID);
                    return poReceiptIds.includes(rid) && rdPid === pid;
                }).reduce((acc, rd) => acc + (rd.ActualQty || 0), 0);

                poTotalReceived += itemReceived;
                if (itemReceived >= (item.OrderedQty || 0)) {
                    fullyReceivedCount++;
                }
            });

            // QUYẾT ĐỊNH TRẠNG THÁI MỚI
            let newStatus = '';
            if (poTotalReceived <= 0) {
                // Nếu chưa nhập gì, giữ nguyên trạng thái cũ (thường là Đã duyệt hoặc Chờ xử lý)
                continue; 
            } else if (fullyReceivedCount === items.length) {
                newStatus = 'Hoàn thành';
            } else {
                newStatus = 'Nhập một phần';
            }

            // 3. Nếu trạng thái khác với Database hiện tại -> Cập nhật
            if (po.Status !== newStatus) {
                console.log(`--- 🔄 Cập nhật ${poId}: "${po.Status}" -> "${newStatus}" (Nhập: ${poTotalReceived}/${poTotalOrdered})`);
                await nocoRequest(TABLE_IDS.Purchase_Orders, 'PATCH', { Id: po.Id, Status: newStatus });
                updateCount++;
            }
        }

        console.log(`\n✨ HOÀN TẤT! Đã cập nhật ${updateCount} đơn hàng về trạng thái chuẩn thực tế.`);
    } catch (error) {
        console.error('❌ Lỗi khi dọn dẹp Database:', error);
    }
}

syncPOStatusOnDatabase();
