/**
 * PHARMA WMS - INVENTORY RESERVED QTY FILLER
 * Điền giá trị cho cột ReservedQty trong bảng Inventory
 * Logic: ReservedQty = random(5% - 15% của Quantity) để giả lập hàng đang chờ xuất.
 */

const https = require('https');

const NOCO_CONFIG = {
    BASE_URL: 'https://nocodb.data4life.top',
    API_TOKEN: 'CbFCU2G7OdsOVCHr4k315N0J7dQ5MzjJSOVSSU7x'
};

const TABLES = {
    Inventory: 'mh3qhve190b9hw0'
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

async function fillReservedQty() {
    console.log('=== ĐANG ĐIỀN RESERVEDQTY CHO BẢNG INVENTORY ===');

    try {
        const inventory = await fetchAll(TABLES.Inventory);
        console.log(`Tìm thấy ${inventory.length} dòng dữ liệu tồn kho.`);

        let updatedCount = 0;
        for (const item of inventory) {
            const recordId = item.Id || item.id;
            const qty = parseInt(item.Quantity || 0);
            
            // Giả lập ReservedQty bằng khoảng 5-15% tổng lượng tồn
            // Nếu Quantity = 0 thì Reserved = 0
            let reserved = 0;
            if (qty > 0) {
                const percent = 0.05 + Math.random() * 0.10;
                reserved = Math.floor(qty * percent);
            }

            await nocoRequest(`/api/v2/tables/${TABLES.Inventory}/records`, 'PATCH', {
                Id: recordId,
                ReservedQty: reserved
            });
            
            console.log(`   [Update] ${item.InventoryID}: Quantity ${qty} -> Reserved ${reserved}`);
            updatedCount++;
        }

        console.log(`\n=== HOÀN TẤT! ĐÁ CẬP NHẬT ${updatedCount} DÒNG ===`);
        console.log('Vui lòng nhấn F5 trên NocoDB để kiểm tra.');

    } catch (e) {
        console.error('LỖI:', e.message);
    }
}

fillReservedQty();
