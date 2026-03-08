/**
 * PHARMA WMS - ROLE PERMISSIONS TITLE FILLER
 * Điền cột Title bằng cách kết hợp thông tin Role và Permission
 */

const https = require('https');

const NOCO_CONFIG = {
    BASE_URL: 'https://nocodb.data4life.top',
    API_TOKEN: 'CbFCU2G7OdsOVCHr4k315N0J7dQ5MzjJSOVSSU7x'
};

const TABLES = {
    Role_Permissions: 'msx7md4os865qai'
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

async function fillRolePermissionTitles() {
    console.log('=== ĐANG ĐIỀN CỘT TITLE CHO BẢNG ROLE_PERMISSIONS ===');

    try {
        const records = await fetchAll(TABLES.Role_Permissions);
        console.log(`Tìm thấy ${records.length} dòng.`);

        for (const record of records) {
            const recordId = record.Id || record.id;
            
            // Lấy ID từ cột link (nếu noco trả về object link, hoặc text)
            // Thường trong response sẽ có text hiển thị của link
            const roleObj = record.Roles || {};
            const permObj = record.Permissions || {};
            
            const roleStr = roleObj.RoleID || "Role";
            const permStr = permObj.PermissionID || "Perm";
            
            const newTitle = `${roleStr} - ${permStr}`;

            await nocoRequest(`/api/v2/tables/${TABLES.Role_Permissions}/records`, 'PATCH', {
                Id: recordId,
                Title: newTitle
            });
            
            console.log(`   [Update] ID ${recordId}: Title -> ${newTitle}`);
        }

        console.log('\n=== HOÀN TẤT! CỘT TITLE ĐÃ ĐƯỢC TẬN DỤNG XONG ===');
        console.log('Vui lòng nhấn F5 trên NocoDB để kiểm tra.');

    } catch (e) {
        console.error('LỖI:', e.message);
    }
}

fillRolePermissionTitles();
