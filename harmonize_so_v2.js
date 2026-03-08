/**
 * PHARMA WMS - SALES ORDERS HARMONIZER
 * 1. Sửa SO_ID về chuẩn SO-24-XXX
 * 2. Việt hóa và chuẩn hóa Status
 * 3. Điền thông tin thiếu (Số điện thoại, v.v.)
 */

const https = require('https');

const NOCO_CONFIG = {
    BASE_URL: 'https://nocodb.data4life.top',
    API_TOKEN: 'CbFCU2G7OdsOVCHr4k315N0J7dQ5MzjJSOVSSU7x'
};

const TABLES = {
    Sales_Orders: 'm8gnl88wrij90wp'
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

async function harmonizeSO() {
    console.log('=== ĐANG CHUẨN HÓA BẢNG SALES ORDERS ===');

    try {
        const records = await fetchAll(TABLES.Sales_Orders);
        
        const statusMap = {
            'PICKING': 'Đang lấy hàng',
            'PACKING': 'Đang đóng gói',
            'DELIVERING': 'Đang giao hàng',
            'COMPLETED': 'Đã hoàn thành',
            'CANCELLED': 'Đã hủy',
            'PENDING': 'Đang chờ xử lý',
            'DELIVERED': 'Đã giao hàng'
        };

        for (let i = 0; i < records.length; i++) {
            const record = records[i];
            const recordId = record.Id || record.id;
            const expectedId = `SO-24-${String(i + 1).padStart(3, '0')}`;
            
            let payload = { Id: recordId };
            let needsUpdate = false;

            // 1. Fix SO_ID
            if (record.SO_ID !== expectedId) {
                payload.SO_ID = expectedId;
                needsUpdate = true;
            }

            // 2. Fix Status (Việt hóa)
            let currentStatus = record.Status || "";
            if (statusMap[currentStatus]) {
                payload.Status = statusMap[currentStatus];
                needsUpdate = true;
            } else if (currentStatus === currentStatus.toUpperCase() && currentStatus !== "") {
                payload.Status = currentStatus.charAt(0) + currentStatus.slice(1).toLowerCase();
                needsUpdate = true;
            }

            // 3. Fill ContactPhone
            if (!record.ContactPhone) {
                const randomPhone = `09${Math.floor(Math.random() * 90000000 + 10000000)}`;
                payload.ContactPhone = randomPhone;
                needsUpdate = true;
            }

            if (needsUpdate) {
                await nocoRequest(`/api/v2/tables/${TABLES.Sales_Orders}/records`, 'PATCH', payload);
                console.log(`   [SO] Fix #${recordId}: ${record.SO_ID} -> ${expectedId}, Status: ${payload.Status || currentStatus}`);
            }
        }

        console.log('\n=== HOÀN TẤT! BẢNG SALES ORDERS ĐÃ CHUẨN ĐẸP ===');
        console.log('Vui lòng nhấn F5 trên NocoDB để kiểm tra.');

    } catch (e) {
        console.error('LỖI:', e.message);
    }
}

harmonizeSO();
