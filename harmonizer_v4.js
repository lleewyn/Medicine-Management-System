/**
 * PHARMA WMS - DATA HARMONIZER V4 (BẢN CHUẨN)
 * 1. Đồng bộ Categories (CAT-001 -> CAT-015+)
 * 2. Đồng bộ Products (P-001 -> P-014+) và gắn link Category chính xác
 * 3. Đồng bộ Inventory:
 *    - Điền InventoryID kiểu SỐ (e.g. 24001, 24002...) vì cột này là BigInt
 *    - Link Batches_id và Warehouse_Locations_id (ForeignKey)
 * 4. Đồng bộ Zones: Fix ZoneID (ZON-01...)
 */

const https = require('https');

const NOCO_CONFIG = {
    BASE_URL: 'https://nocodb.data4life.top',
    API_TOKEN: 'CbFCU2G7OdsOVCHr4k315N0J7dQ5MzjJSOVSSU7x'
};

const TABLES = {
    Categories: 'ms16b7993d23ocf',
    Products: 'm4cznh4wdhp1pgy',
    Batches: 'm8r83f9zdxzz56y',
    Inventory: 'mh3qhve190b9hw0',
    Locations: 'mqnkms35ablr79s',
    Zones: 'm3hqjkf0w23r2qi',
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

async function start() {
    console.log('=== BẮT ĐẦU CHUẨN HÓA DỮ LIỆU TOÀN DIỆN ===');

    try {
        // 1. Categories
        console.log('\n1. Đang chuẩn hóa Categories...');
        const cats = await fetchAll(TABLES.Categories);
        for (let i = 0; i < cats.length; i++) {
            const idValue = `CAT-${String(i + 1).padStart(3, '0')}`;
            const recordId = cats[i].Id || cats[i].id;
            if (cats[i].CategoryID !== idValue) {
                await nocoRequest(`/api/v2/tables/${TABLES.Categories}/records`, 'PATCH', { Id: recordId, CategoryID: idValue });
                console.log(`   [Update] Category: ${cats[i].CategoryName} -> ${idValue}`);
                cats[i].CategoryID = idValue;
            }
        }

        // 2. Products
        console.log('\n2. Đang chuẩn hóa Products...');
        const prods = await fetchAll(TABLES.Products);
        for (let i = 0; i < prods.length; i++) {
            const recordId = prods[i].Id || prods[i].id;
            const idValue = `P-${String(i + 1).padStart(3, '0')}`;
            let payload = { Id: recordId };
            let needsUpdate = false;

            if (prods[i].ProductID !== idValue) {
                payload.ProductID = idValue;
                needsUpdate = true;
            }

            // Gán link Category nếu trống
            if (!prods[i].Categories_id) {
                const name = prods[i].ProductName || "";
                let match = null;
                if (name.includes('Vaccine')) match = cats.find(c => c.CategoryName.includes('Vaccine'));
                else if (name.includes('Paracetamol') || name.includes('Hapacol')) match = cats.find(c => c.CategoryName.includes('Giảm đau'));
                
                if (!match) match = cats[Math.floor(Math.random() * cats.length)]; // Random if unknown
                
                payload.Categories_id = match.Id || match.id;
                needsUpdate = true;
            }

            if (needsUpdate) {
                await nocoRequest(`/api/v2/tables/${TABLES.Products}/records`, 'PATCH', payload);
                console.log(`   [Update] Product: ${prods[i].ProductName || idValue} -> ${idValue}`);
            }
        }

        // 3. Inventory
        console.log('\n3. Đang chuẩn hóa Inventory...');
        const invs = await fetchAll(TABLES.Inventory);
        const batches = await fetchAll(TABLES.Batches);
        const locs = await fetchAll(TABLES.Locations);

        for (let i = 0; i < invs.length; i++) {
            const recordId = invs[i].Id || invs[i].id;
            let payload = { Id: recordId };
            let needsUpdate = false;

            // Chú ý: Cột InventoryID là BIGINT nên chỉ dùng số
            const numericId = 24000 + (i + 1);
            if (parseInt(invs[i].InventoryID) !== numericId) {
                payload.InventoryID = numericId;
                needsUpdate = true;
            }

            if (!invs[i].Batches_id && batches.length > 0) {
                const b = batches[Math.floor(Math.random() * batches.length)];
                payload.Batches_id = b.Id || b.id;
                needsUpdate = true;
            }

            if (!invs[i].Warehouse_Locations_id && locs.length > 0) {
                const l = locs[Math.floor(Math.random() * locs.length)];
                payload.Warehouse_Locations_id = l.Id || l.id;
                needsUpdate = true;
            }

            if (needsUpdate) {
                await nocoRequest(`/api/v2/tables/${TABLES.Inventory}/records`, 'PATCH', payload);
                console.log(`   [Update] Inventory #${recordId} -> ID: ${numericId}, Link done`);
            }
        }

        // 4. Zones & Locations
        console.log('\n4. Đang dọn dẹp Zones & Locations...');
        const currentZones = await fetchAll(TABLES.Zones);
        const uniqueZones = [];
        for (const z of currentZones) {
            const recordId = z.Id || z.id;
            const name = z.ZoneName || "";
            if (uniqueZones.some(uz => uz.ZoneName === name)) {
                await nocoRequest(`/api/v2/tables/${TABLES.Zones}/records`, 'DELETE', { Id: recordId });
                console.log(`   [Delete] Xóa Zone trùng: ${name}`);
            } else {
                uniqueZones.push(z);
                const zid = `ZON-${String(uniqueZones.length).padStart(2, '0')}`;
                if (z.ZoneID !== zid) {
                    await nocoRequest(`/api/v2/tables/${TABLES.Zones}/records`, 'PATCH', { Id: recordId, ZoneID: zid });
                    console.log(`   [Update] ZoneID: ${name} -> ${zid}`);
                }
            }
        }

        console.log('\n=== HOÀN TẤT CHUẨN HÓA DỮ LIỆU! ===');
        console.log('Bạn hãy F5 (Reload) trang NocoDB để nhận kết quả mới nhé.');

    } catch (e) {
        console.error('LỖI:', e.message);
    }
}

start();
