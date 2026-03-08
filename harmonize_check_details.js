/**
 * PHARMA WMS - CHECK DETAILS HARMONIZER
 * 1. Chuẩn hóa DetailID sang CKD-24-XXX
 * 2. Lấp đầy liên kết tới Inventory_Checks và Batches
 * 3. Điền ActualQty (Số lượng thực tế) gần khớp với SystemQty
 */

const https = require('https');

const NOCO_CONFIG = {
    BASE_URL: 'https://nocodb.data4life.top',
    API_TOKEN: 'CbFCU2G7OdsOVCHr4k315N0J7dQ5MzjJSOVSSU7x'
};

const TABLES = {
    Check_Details: 'mruch8gn79nob65',
    Inventory_Checks: 'm7mfarcw6xfiz21',
    Batches: 'm8r83f9zdxzz56y'
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

async function harmonizeCheckDetails() {
    console.log('=== ĐANG CHUẨN HÓA CHI TIẾT KIỂM KÊ (CHECK DETAILS) ===');

    try {
        const details = await fetchAll(TABLES.Check_Details);
        const checks = await fetchAll(TABLES.Inventory_Checks);
        const batches = await fetchAll(TABLES.Batches);

        console.log(`Tìm thấy ${details.length} dòng chi tiết kiểm kê.`);

        for (let i = 0; i < details.length; i++) {
            const detail = details[i];
            const recordId = detail.Id || detail.id;
            const expectedId = `CKD-24-${String(i + 1).padStart(3, '0')}`;
            
            const targetCheck = checks[i % checks.length];
            const targetBatch = batches[i % batches.length];
            
            // Tính toán ActualQty (lệch tối đa +/- 5 đơn vị so với SystemQty cho thực tế)
            const sysQty = parseInt(detail.SystemQty || 0);
            let actQty = sysQty;
            if (sysQty > 0) {
                // Giả lập sai lệch nhỏ (90% khớp, 10% lệch ít)
                if (Math.random() > 0.9) {
                    actQty = Math.max(0, sysQty + (Math.floor(Math.random() * 11) - 5));
                }
            }

            await nocoRequest(`/api/v2/tables/${TABLES.Check_Details}/records`, 'PATCH', {
                Id: recordId,
                DetailID: expectedId,
                Inventory_Checks_id: targetCheck.Id || targetCheck.id,
                Batches_id: targetBatch.Id || targetBatch.id,
                ActualQty: actQty
            });
            
            console.log(`   [Detail] ${expectedId}: Link tới ${targetCheck.CheckID} và ${targetBatch.BatchID}, Qty: ${sysQty} -> ${actQty}`);
        }

        console.log('\n=== HOÀN TẤT! CHI TIẾT KIỂM KÊ ĐÃ ĐẦY ĐỦ VÀ CHUẨN ĐẸP ===');
        console.log('Vui lòng nhấn F5 trên NocoDB để kiểm tra.');

    } catch (e) {
        console.error('LỖI:', e.message);
    }
}

harmonizeCheckDetails();
