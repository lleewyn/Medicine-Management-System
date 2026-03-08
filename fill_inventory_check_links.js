/**
 * PHARMA WMS - INVENTORY CHECKS LINKS FILLER
 * Lấp đầy các liên kết (UserID) cho bảng Inventory_Checks
 */

const https = require('https');

const NOCO_CONFIG = {
    BASE_URL: 'https://nocodb.data4life.top',
    API_TOKEN: 'CbFCU2G7OdsOVCHr4k315N0J7dQ5MzjJSOVSSU7x'
};

const TABLES = {
    Inventory_Checks: 'm7mfarcw6xfiz21',
    Users: 'mm1izhsiixh0ix2'
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

async function fillInventoryCheckLinks() {
    console.log('=== ĐANG LẤP ĐẦY LIÊN KẾT CHO INVENTORY_CHECKS ===');

    try {
        const checks = await fetchAll(TABLES.Inventory_Checks);
        const users = await fetchAll(TABLES.Users);

        console.log(`Tìm thấy ${checks.length} phiếu kiểm kho.`);

        for (let i = 0; i < checks.length; i++) {
            const check = checks[i];
            const recordId = check.Id || check.id;
            
            // Phân bổ Nhân viên kiểm kho (Warehouse Staff)
            const targetUser = users[i % users.length];

            await nocoRequest(`/api/v2/tables/${TABLES.Inventory_Checks}/records`, 'PATCH', {
                Id: recordId,
                Users_id: targetUser.Id || targetUser.id
            });
            
            console.log(`   [Check] ${check.CheckID}: Link tới Nhân viên ${targetUser.id}`);
        }

        console.log('\n=== HOÀN TẤT! PHIẾU KIỂM KHO ĐÃ ĐẦY ĐỦ LIÊN KẾT ===');
        console.log('Vui lòng nhấn F5 trên NocoDB để kiểm tra.');

    } catch (e) {
        console.error('LỖI:', e.message);
    }
}

fillInventoryCheckLinks();
