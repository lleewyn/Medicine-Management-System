/**
 * PHARMA WMS - QC REQUEST LINKS FILLER
 * Lấp đầy các liên kết (BatchID, UserID) cho bảng QC_Requests
 */

const https = require('https');

const NOCO_CONFIG = {
    BASE_URL: 'https://nocodb.data4life.top',
    API_TOKEN: 'CbFCU2G7OdsOVCHr4k315N0J7dQ5MzjJSOVSSU7x'
};

const TABLES = {
    QC_Requests: 'mbf6ppmcofryvi2',
    Batches: 'm8r83f9zdxzz56y',
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

async function fillQCLinks() {
    console.log('=== ĐANG LẤP ĐẦY LIÊN KẾT CHO QC_REQUESTS ===');

    try {
        const requests = await fetchAll(TABLES.QC_Requests);
        const batches = await fetchAll(TABLES.Batches);
        const users = await fetchAll(TABLES.Users);

        const qcUsers = users.filter(u => u.Role !== 'QC_STAFF'); // QC staff hoặc lấy random nếu k lọc đc role
        const targetUsers = qcUsers.length > 0 ? qcUsers : users;

        console.log(`Tìm thấy ${requests.length} lệnh QC.`);

        for (let i = 0; i < requests.length; i++) {
            const req = requests[i];
            const recordId = req.Id || req.id;
            
            // Phân bổ Lô hàng và Nhân viên QC
            const targetBatch = batches[i % batches.length];
            const targetUser = targetUsers[i % targetUsers.length];

            await nocoRequest(`/api/v2/tables/${TABLES.QC_Requests}/records`, 'PATCH', {
                Id: recordId,
                Batches_id: targetBatch.Id || targetBatch.id,
                Users_id: targetUser.Id || targetUser.id
            });
            
            console.log(`   [QC] ${req.QC_ID}: Link tới Lô hàng ${targetBatch.BatchID} và Nhân viên ${targetUser.id}`);
        }

        console.log('\n=== HOÀN TẤT! LỆNH QC ĐÃ ĐẦY ĐỦ LIÊN KẾT ===');
        console.log('Vui lòng nhấn F5 trên NocoDB để kiểm tra.');

    } catch (e) {
        console.error('LỖI:', e.message);
    }
}

fillQCLinks();
