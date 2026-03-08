/**
 * PHARMA WMS - PURCHASE ORDERS HARMONIZER
 * 1. Sửa PO_ID về chuẩn PO-24-XXX
 * 2. Việt hóa và chuẩn hóa Status (không viết hoa toàn bộ)
 */

const https = require('https');

const NOCO_CONFIG = {
    BASE_URL: 'https://nocodb.data4life.top',
    API_TOKEN: 'CbFCU2G7OdsOVCHr4k315N0J7dQ5MzjJSOVSSU7x'
};

const TABLES = {
    Purchase_Orders: 'm5u0dkeh3cx11zh'
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

async function harmonizePO() {
    console.log('=== ĐANG CHUẨN HÓA BẢNG PURCHASE ORDERS ===');

    try {
        const records = await fetchAll(TABLES.Purchase_Orders);
        
        const statusMap = {
            'PENDING': 'Đang chờ xử lý',
            'PARTIAL': 'Đã nhận một phần',
            'COMPLETED': 'Đã hoàn thành',
            'APPROVED': 'Đã duyệt',
            'RECEIVED': 'Đã nhận hàng'
        };

        for (let i = 0; i < records.length; i++) {
            const record = records[i];
            const recordId = record.Id || record.id;
            const expectedId = `PO-24-${String(i + 1).padStart(3, '0')}`;
            
            let payload = { Id: recordId };
            let needsUpdate = false;

            // 1. Fix PO_ID
            if (record.PO_ID !== expectedId) {
                payload.PO_ID = expectedId;
                needsUpdate = true;
            }

            // 2. Fix Status
            let currentStatus = record.Status || "";
            if (statusMap[currentStatus]) {
                payload.Status = statusMap[currentStatus];
                needsUpdate = true;
            } else if (currentStatus === currentStatus.toUpperCase() && currentStatus !== "") {
                // If it's something like "DRAFT", we still want to make it "Draft"
                payload.Status = currentStatus.charAt(0) + currentStatus.slice(1).toLowerCase();
                needsUpdate = true;
            }

            if (needsUpdate) {
                await nocoRequest(`/api/v2/tables/${TABLES.Purchase_Orders}/records`, 'PATCH', payload);
                console.log(`   [PO] Fix #${recordId}: ${record.PO_ID} -> ${expectedId}, Status: ${payload.Status || currentStatus}`);
            }
        }

        console.log('\n=== HOÀN TẤT! BẢNG PURCHASE ORDERS ĐÃ CHUẨN ĐẸP ===');
        console.log('Vui lòng nhấn F5 trên NocoDB để kiểm tra.');

    } catch (e) {
        console.error('LỖI:', e.message);
    }
}

harmonizePO();
