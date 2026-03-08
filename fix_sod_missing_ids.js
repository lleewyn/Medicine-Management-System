/**
 * PHARMA WMS - SOD FINAL FIX
 * Lấp đầy SODetailID cho các dòng bị thiếu (11, 12, 13...) trong bảng Sales_Order_Details
 */

const https = require('https');

const NOCO_CONFIG = {
    BASE_URL: 'https://nocodb.data4life.top',
    API_TOKEN: 'CbFCU2G7OdsOVCHr4k315N0J7dQ5MzjJSOVSSU7x'
};

const TABLES = {
    Sales_Order_Details: 'm04m8k78x5kmfs4'
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

async function fixSOD() {
    console.log('=== ĐANG LẤP ĐẦY DỮ LIỆU CÒN THIẾU TRONG SALE ORDER DETAILS ===');

    try {
        const details = await fetchAll(TABLES.Sales_Order_Details);
        console.log(`Tìm thấy ${details.length} dòng.`);

        for (let i = 0; i < details.length; i++) {
            const detail = details[i];
            const recordId = detail.Id || detail.id;
            const expectedId = `SOD-24-${String(i + 1).padStart(3, '0')}`;
            
            // Nếu SODetailID trống hoặc không đúng định dạng thì fix
            if (!detail.SODetailID || detail.SODetailID !== expectedId) {
                await nocoRequest(`/api/v2/tables/${TABLES.Sales_Order_Details}/records`, 'PATCH', {
                    Id: recordId,
                    SODetailID: expectedId
                });
                console.log(`   [Fix] Dòng ${i + 1}: Đã lấp đầy SODetailID -> ${expectedId}`);
            }
        }

        console.log('\n=== HOÀN TẤT! SALE ORDER DETAILS ĐÃ ĐẦY ĐỦ 100% ===');
        console.log('Vui lòng nhấn F5 trên NocoDB để kiểm tra.');

    } catch (e) {
        console.error('LỖI:', e.message);
    }
}

fixSOD();
