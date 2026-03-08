/**
 * PHARMA WMS - ZONE LINK FILLER
 * Điền giá trị cho cột ZoneID trong bảng Warehouse_Locations
 */

const https = require('https');

const NOCO_CONFIG = {
    BASE_URL: 'https://nocodb.data4life.top',
    API_TOKEN: 'CbFCU2G7OdsOVCHr4k315N0J7dQ5MzjJSOVSSU7x'
};

const TABLES = {
    Zones: 'm3hqjkf0w23r2qi',
    Locations: 'mqnkms35ablr79s'
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
    console.log('=== ĐANG ĐIỀN ZONEID CHO WAREHOUSE LOCATIONS ===');

    try {
        const zones = await fetchAll(TABLES.Zones);
        const locations = await fetchAll(TABLES.Locations);

        if (zones.length === 0) {
            console.log('Lỗi: Không tìm thấy Zone nào trong bảng Zones.');
            return;
        }

        console.log(`Tìm thấy ${zones.length} Zones và ${locations.length} Locations.`);

        for (let i = 0; i < locations.length; i++) {
            const loc = locations[i];
            const recordId = loc.Id || loc.id;
            
            // Nếu đã có Zones_id rồi thì bỏ qua (hoặc điền lại tất cả cho chắc)
            // Ở đây tôi sẽ điền cho tất cả các bản ghi để đảm bảo tính đồng nhất
            const zoneToAssign = zones[i % zones.length]; // Chia đều locations vào các zones
            
            await nocoRequest(`/api/v2/tables/${TABLES.Locations}/records`, 'PATCH', {
                Id: recordId,
                Zones_id: zoneToAssign.Id || zoneToAssign.id
            });
            
            console.log(`   [Link] ${loc.LocationID} -> ${zoneToAssign.ZoneID} (${zoneToAssign.ZoneName})`);
        }

        console.log('\n=== HOÀN TẤT! ĐÃ ĐIỀN XONG TOÀN BỘ ZONEID ===');
        console.log('Vui lòng nhấn F5 trên NocoDB để kiểm tra.');

    } catch (e) {
        console.error('LỖI:', e.message);
    }
}

fillZones();
