/**
 * PHARMA WMS - BATCH DATA FINAL POLISH
 * 1. Cập nhật trạng thái linh động (Sẵn sàng, Đang kiểm tra, Chờ xuất...)
 * 2. Lấp đầy dữ liệu thiếu cho dòng 21, 22 (ImportPrice, ExpDate)
 */

const https = require('https');

const NOCO_CONFIG = {
    BASE_URL: 'https://nocodb.data4life.top',
    API_TOKEN: 'CbFCU2G7OdsOVCHr4k315N0J7dQ5MzjJSOVSSU7x'
};

const TABLES = {
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

async function polishBatches() {
    console.log('=== ĐANG CHỈNH SỬA CHI TIẾT BẢNG BATCHES ===');

    try {
        const batches = await fetchAll(TABLES.Batches);
        const statusList = ['RELEASED', 'RELEASED', 'RELEASED', 'QUARANTINE', 'IN_TESTING', 'EXPIRED'];
        const vnStatusMap = {
            'RELEASED': 'Đã duyệt',
            'QUARANTINE': 'Biệt trữ',
            'IN_TESTING': 'Đang kiểm nghiệm',
            'EXPIRED': 'Hết hạn'
        };

        for (let i = 0; i < batches.length; i++) {
            const batch = batches[i];
            const recordId = batch.Id || batch.id;
            let payload = { Id: recordId };
            let needsUpdate = false;

            // 1. Cập nhật trạng thái linh động (Việt hóa)
            // Chọn ngẫu nhiên trạng thái nhưng ưu tiên RELEASED (Đã duyệt)
            const randomStatus = statusList[Math.floor(Math.random() * statusList.length)];
            const vnStatus = vnStatusMap[randomStatus];
            if (batch.BatchStatus !== vnStatus) {
                payload.BatchStatus = vnStatus;
                needsUpdate = true;
            }

            // 2. Lấp đầy dữ liệu thiếu cho dòng 21, 22 (hoặc bất kỳ dòng nào trống)
            if (!batch.ImportPrice) {
                payload.ImportPrice = 100000 + Math.floor(Math.random() * 400000);
                needsUpdate = true;
            }
            
            if (!batch.ExpDate || batch.ExpDate === '27-01-01') {
                // Fix ngày hết hạn cho hợp lý (2025-2027)
                const year = 2025 + Math.floor(Math.random() * 3);
                const month = String(1 + Math.floor(Math.random() * 12)).padStart(2, '0');
                const day = String(1 + Math.floor(Math.random() * 28)).padStart(2, '0');
                payload.ExpDate = `${year}-${month}-${day}`;
                needsUpdate = true;
            }

            if (needsUpdate) {
                await nocoRequest(`/api/v2/tables/${TABLES.Batches}/records`, 'PATCH', payload);
                console.log(`   [Batch] ${batch.BatchID}: Đã cập nhật Status & Dữ liệu thiếu.`);
            }
        }

        console.log('\n=== HOÀN TẤT! BẢNG BATCHES ĐÃ ĐẸP VÀ ĐẦY ĐỦ ===');
        console.log('Vui lòng nhấn F5 trên NocoDB để kiểm tra.');

    } catch (e) {
        console.error('LỖI:', e.message);
    }
}

polishBatches();
