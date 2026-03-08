/**
 * PHARMA WMS - ZONE DATA FILLER
 * Điền đầy đủ dữ liệu cho các dòng còn thiếu trong bảng Zones (từ dòng 11 trở đi)
 */

const https = require('https');

const NOCO_CONFIG = {
    BASE_URL: 'https://nocodb.data4life.top',
    API_TOKEN: 'CbFCU2G7OdsOVCHr4k315N0J7dQ5MzjJSOVSSU7x'
};

const TABLES = {
    Zones: 'm3hqjkf0w23r2qi'
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

async function fillZones() {
    console.log('=== ĐANG ĐIỀN DỮ LIỆU CÒN THIẾU TRONG BẢNG ZONES ===');

    try {
        const zones = await fetchAll(TABLES.Zones);
        console.log(`Tìm thấy ${zones.length} dòng dữ liệu.`);

        let updatedCount = 0;
        for (const zone of zones) {
            const recordId = zone.Id || zone.id;
            
            // Chỉ điền nếu dữ liệu còn trống
            if (!zone.ZoneType || !zone.TemperatureType || !zone.ZoneDescription) {
                const name = zone.ZoneName || "";
                
                const updateData = {
                    Id: recordId,
                    ZoneType: zone.ZoneType || 'Ký gửi', 
                    TemperatureType: zone.TemperatureType || 'Nhiệt độ phòng',
                    ZoneDescription: zone.ZoneDescription || `Khu vực lưu trữ hàng hóa ${name}`
                };

                // Logic riêng cho một số trường hợp (nếu muốn)
                if (name.includes('A11') || name.includes('A20')) {
                    updateData.ZoneType = 'Thương mại';
                }

                await nocoRequest(`/api/v2/tables/${TABLES.Zones}/records`, 'PATCH', updateData);
                console.log(`   [Update] ${zone.ZoneID}: ${name} -> Xong`);
                updatedCount++;
            }
        }

        console.log(`\n=== HOÀN TẤT! ĐÃ CẬP NHẬT ${updatedCount} DÒNG TRONG BẢNG ZONES ===`);
        console.log('Vui lòng nhấn F5 trên NocoDB để kiểm tra.');

    } catch (e) {
        console.error('LỖI:', e.message);
    }
}

fillZones();
