/**
 * PHARMA WMS - RECALLS & RECALL DETAILS HARMONIZER
 * 1. Lấp đầy BatchID cho bảng Recalls & Việt hóa Status
 * 2. Chuẩn hóa DetailID cho Recall_Details (RCD-24-XXX)
 * 3. Lấp đầy liên kết Recalls_id và Customers_id cho Recall_Details
 * 4. Điền ActualReturnedQty cho Recall_Details
 */

const https = require('https');

const NOCO_CONFIG = {
    BASE_URL: 'https://nocodb.data4life.top',
    API_TOKEN: 'CbFCU2G7OdsOVCHr4k315N0J7dQ5MzjJSOVSSU7x'
};

const TABLES = {
    Recalls: 'm5o3p7ydo7wwivl',
    Recall_Details: 'mqfqfchxm9hiq0d',
    Batches: 'm8r83f9zdxzz56y',
    Customers: 'm34ugizvp0l1ple'
};

async function nocoRequest(path, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'nocodb.data4life.top',
            path: path,
            method: method,
            headers: {
                'xc-token': NOCO_CONFIG.API_TOKEN,
                'Content-Type': 'application/json'
            }
        };
        const req = https.request(options, (res) => {
            let d = '';
            res.on('data', c => d += c);
            res.on('end', () => {
                try {
                    const parsed = d ? JSON.parse(d) : null;
                    resolve(parsed);
                } catch (e) { resolve(d); }
            });
        });
        req.on('error', reject);
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

const fetchAll = (tid) => nocoRequest(`/api/v2/tables/${tid}/records?limit=1000`).then(r => r.list || r || []);

async function harmonizeRecalls() {
    console.log('=== ĐANG CHUẨN HÓA DỮ LIỆU THU HỒI (RECALLS) ===');

    try {
        const recalls = await fetchAll(TABLES.Recalls);
        const rDetails = await fetchAll(TABLES.Recall_Details);
        const batches = await fetchAll(TABLES.Batches);
        const customers = await fetchAll(TABLES.Customers);

        console.log(`Tìm thấy ${recalls.length} lệnh thu hồi và ${rDetails.length} chi tiết thu hồi.`);

        // 1. Recalls: Link to Batches & Localize Status
        const statusMap = {
            'Đang hoạt động': 'Đang thực hiện',
            'Đã khóa': 'Đã hoàn thành'
        };

        for (let i = 0; i < recalls.length; i++) {
            const recall = recalls[i];
            const recordId = recall.Id || recall.id;
            const targetBatch = batches[i % batches.length];
            const newStatus = statusMap[recall.Status] || 'Đang thực hiện';

            await nocoRequest(`/api/v2/tables/${TABLES.Recalls}/records`, 'PATCH', {
                Id: recordId,
                Batches_id: targetBatch.Id || targetBatch.id,
                Status: newStatus
            });
            console.log(`   [Recall] ${recall.RecallID}: Link tới Lô ${targetBatch.BatchID}, Status: ${newStatus}`);
        }

        // 2. Recall_Details: Fill ID, Links, and Returned Qty
        for (let i = 0; i < rDetails.length; i++) {
            const detail = rDetails[i];
            const recordId = detail.Id || detail.id;
            const expectedId = `RCD-24-${String(i + 1).padStart(3, '0')}`;
            const targetRecall = recalls[i % recalls.length];
            const targetCustomer = customers[i % customers.length];

            const expQty = parseInt(detail.ExpectedQty || 0);
            let retQty = expQty;
            if (expQty > 0) {
                // Giả lập thu hồi đủ hoặc thiếu một ít
                retQty = Math.floor(expQty * (0.8 + Math.random() * 0.2));
            }

            await nocoRequest(`/api/v2/tables/${TABLES.Recall_Details}/records`, 'PATCH', {
                Id: recordId,
                DetailID: expectedId,
                Recalls_id: targetRecall.Id || targetRecall.id,
                Customers_id: targetCustomer.Id || targetCustomer.id,
                ActualReturnedQty: retQty
            });
            console.log(`   [Recall Detail] ${expectedId}: Link tới ${targetRecall.RecallID} và Khách hàng ${targetCustomer.id}`);
        }

        console.log('\n=== HOÀN TẤT! DỮ LIỆU THU HỒI ĐÃ ĐẦY ĐỦ VÀ CHUẨN ===');
        console.log('Vui lòng nhấn F5 trên NocoDB để kiểm tra.');

    } catch (e) {
        console.error('LỖI:', e.message);
    }
}

harmonizeRecalls();
