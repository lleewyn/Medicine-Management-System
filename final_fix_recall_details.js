/**
 * PHARMA WMS - RECALL DETAILS FINAL FILLER
 * Sửa lỗi Table ID cho Recall_Details và lấp đầy 100% dữ liệu
 */

const https = require('https');

const NOCO_CONFIG = {
    BASE_URL: 'https://nocodb.data4life.top',
    API_TOKEN: 'CbFCU2G7OdsOVCHr4k315N0J7dQ5MzjJSOVSSU7x'
};

const TABLES = {
    Recalls: 'm5o3p7ydo7wwivl',
    Recall_Details: 'mgfgfchxm9hiq0d',
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

const fetchAll = (tid) => nocoRequest(`/api/v2/tables/${tid}/records?limit=100`).then(r => r.list || r || []);

async function fixRecallDetails() {
    console.log('=== ĐANG LẤP ĐẦY DỮ LIỆU THIẾU CHO BẢNG RECALL DETAILS ===');

    try {
        const recalls = await fetchAll(TABLES.Recalls);
        const details = await fetchAll(TABLES.Recall_Details);
        const customers = await fetchAll(TABLES.Customers);

        console.log(`Tìm thấy ${recalls.length} Recalls, ${details.length} Details, ${customers.length} Customers.`);

        for (let i = 0; i < details.length; i++) {
            const detail = details[i];
            const recordId = detail.Id || detail.id;
            const expectedId = `RCD-24-${String(i + 1).padStart(3, '0')}`;
            
            const targetRecall = recalls[i % recalls.length];
            const targetCustomer = customers[i % customers.length];
            
            const expQty = parseInt(detail.ExpectedQty || (10 * (i+1)));
            const actQty = Math.floor(expQty * (0.85 + Math.random() * 0.15));

            await nocoRequest(`/api/v2/tables/${TABLES.Recall_Details}/records`, 'PATCH', {
                Id: recordId,
                DetailID: expectedId,
                Recalls_id: targetRecall.Id || targetRecall.id,
                Customers_id: targetCustomer.Id || targetCustomer.id,
                ActualReturnedQty: actQty,
                ReturnStatus: 'Đã nhận'
            });
            
            console.log(`   [Final Fix] ${expectedId}: Link -> ${targetRecall.RecallID} & ${targetCustomer.CustomerName}`);
        }

        console.log('\n=== HOÀN TẤT! BẢNG RECALL DETAILS ĐÃ ĐẦY ĐỦ 100% ===');
        console.log('Vui lòng nhấn F5 trên NocoDB để kiểm tra.');

    } catch (e) {
        console.error('LỖI:', e.message || e);
    }
}

fixRecallDetails();
