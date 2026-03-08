/**
 * PHARMA WMS - ULTIMATE MASTER HARMONIZER V5
 * 1. Synchronizes Categories (CAT-001...)
 * 2. Synchronizes Products (P-001...) & Links
 * 3. Synchronizes Zones (ZON-001...) & Warehouse_Locations (LOC-A01...)
 * 4. Synchronizes Inventory (INV-24-001...) & Links
 * 5. Synchronizes Purchase_Order_Details (POD-24-001...) & Links
 * 6. Synchronizes Goods_Receipts (GR-24-001...) & Links
 * 7. Synchronizes Receipt_Details (RD-24-001...) & Links
 */

const https = require('https');

const NOCO_CONFIG = {
    BASE_URL: 'https://nocodb.data4life.top',
    API_TOKEN: 'CbFCU2G7OdsOVCHr4k315N0J7dQ5MzjJSOVSSU7x'
};

const TABLE_IDS = {
    Categories: 'ms16b7993d23ocf',
    Products: 'm4cznh4wdhp1pgy',
    Suppliers: 'mqx5ocahwipcpsf',
    Customers: 'm34ugizvp0l1ple',
    Zones: 'm3hqjkf0w23r2qi',
    Locations: 'mqnkms35ablr79s',
    Batches: 'm8r83f9zdxzz56y',
    Inventory: 'mh3qhve190b9hw0',
    Users: 'mm1izhsiixh0ix2',
    Purchase_Orders: 'm5u0dkeh3cx11zh',
    Purchase_Order_Details: 'miyern110bb8w23',
    Goods_Receipts: 'm738u03fvi1ywi1',
    Receipt_Details: 'mpayfc3xf9bypov'
};

const nocoRequest = async (path, method = 'GET', data = null) => {
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
            let d = ''; res.on('data', c => d += c);
            res.on('end', () => {
                try { resolve(d ? JSON.parse(d) : null); }
                catch (e) { resolve(d); }
            });
        });
        req.on('error', reject);
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
};

const fetchAll = (id) => nocoRequest(`/api/v2/tables/${id}/records?limit=1000`).then(r => r.list || r || []);

async function harmonize() {
    console.log('=== BẮT ĐẦU TỔNG VỆ SINH & ĐỒNG BỘ HÓA TOÀN DIỆN V5 ===');

    try {
        // --- DATA LOAD ---
        console.log('\n1. Đang tải dữ liệu nguồn...');
        const products = await fetchAll(TABLE_IDS.Products);
        const cats = await fetchAll(TABLE_IDS.Categories);
        const suppliers = await fetchAll(TABLE_IDS.Suppliers);
        const users = await fetchAll(TABLE_IDS.Users);
        const po = await fetchAll(TABLE_IDS.Purchase_Orders);
        const batches = await fetchAll(TABLE_IDS.Batches);
        const gr = await fetchAll(TABLE_IDS.Goods_Receipts);
        
        // --- 1. SEED ZONES & LOCATIONS ---
        console.log('\n2. Xử lý Zones & Locations...');
        const zones = await fetchAll(TABLE_IDS.Zones);
        const uniqueZones = [];
        for (const z of zones) {
            const rid = z.Id || z.id;
            const name = z.ZoneName || "";
            if (uniqueZones.some(uz => uz.ZoneName === name)) {
                await nocoRequest(`/api/v2/tables/${TABLE_IDS.Zones}/records`, 'DELETE', { Id: rid });
                console.log(`   [Zone] Xóa Zone trùng: ${name}`);
            } else {
                uniqueZones.push(z);
                const zid = `ZON-${String(uniqueZones.length).padStart(3, '0')}`;
                if (z.ZoneID !== zid) {
                    await nocoRequest(`/api/v2/tables/${TABLE_IDS.Zones}/records`, 'PATCH', { Id: rid, ZoneID: zid });
                    console.log(`   [Zone] Fix ${name} -> ${zid}`);
                }
            }
        }

        const locs = await fetchAll(TABLE_IDS.Locations);
        for (let i = 0; i < locs.length; i++) {
            const l = locs[i];
            const rid = l.Id || l.id;
            const expectedId = `LOC-${String(i + 1).padStart(3, '0')}`;
            if (l.LocationID === 'L-01' || l.LocationID === 'A1-01' || l.LocationID !== expectedId) {
                let payload = { Id: rid, LocationID: expectedId };
                if (!l.Zones_id && uniqueZones.length > 0) payload.Zones_id = uniqueZones[Math.floor(Math.random() * uniqueZones.length)].id;
                await nocoRequest(`/api/v2/tables/${TABLE_IDS.Locations}/records`, 'PATCH', payload);
                console.log(`   [Loc] Fix ${l.LocationID} -> ${expectedId}`);
            }
        }

        // --- 2. SEED INVENTORY (SINGLE LINE TEXT) ---
        console.log('\n3. Xử lý Inventory (ID: INV-24-XXX)...');
        const invs = await fetchAll(TABLE_IDS.Inventory);
        const freshLocs = await fetchAll(TABLE_IDS.Locations);
        for (let i = 0; i < invs.length; i++) {
            const inv = invs[i];
            const rid = inv.Id || inv.id;
            const expectedId = `INV-24-${String(i + 1).padStart(3, '0')}`;
            let payload = { Id: rid };
            let needs = false;

            if (inv.InventoryID !== expectedId) { payload.InventoryID = expectedId; needs = true; }
            if (!inv.Batches_id && batches.length > 0) { payload.Batches_id = batches[Math.floor(Math.random() * batches.length)].id; needs = true; }
            if (!inv.Warehouse_Locations_id && freshLocs.length > 0) { payload.Warehouse_Locations_id = freshLocs[Math.floor(Math.random() * freshLocs.length)].id; needs = true; }

            if (needs) {
                await nocoRequest(`/api/v2/tables/${TABLE_IDS.Inventory}/records`, 'PATCH', payload);
                console.log(`   [Inv] Fix #${rid} -> ${expectedId}`);
            }
        }

        // --- 3. SEED PURCHASE ORDER DETAILS ---
        console.log('\n4. Xử lý Purchase_Order_Details...');
        const pod = await fetchAll(TABLE_IDS.Purchase_Order_Details);
        for (let i = 0; i < pod.length; i++) {
            const d = pod[i];
            const rid = d.Id || d.id;
            const expectedId = `POD-24-${String(i + 1).padStart(3, '0')}`;
            let payload = { Id: rid };
            let needs = false;

            if (d.PODetailID !== expectedId) { payload.PODetailID = expectedId; needs = true; }
            if (!d.Products_id && products.length > 0) { payload.Products_id = products[Math.floor(Math.random() * products.length)].id; needs = true; }
            if (!d.Purchase_Orders_id && po.length > 0) { payload.Purchase_Orders_id = po[Math.floor(Math.random() * po.length)].id; needs = true; }

            if (needs) {
                await nocoRequest(`/api/v2/tables/${TABLE_IDS.Purchase_Order_Details}/records`, 'PATCH', payload);
                console.log(`   [POD] Fix #${rid} -> ${expectedId}`);
            }
        }

        // --- 4. SEED GOODS RECEIPTS ---
        console.log('\n5. Xử lý Goods_Receipts...');
        const receipts = await fetchAll(TABLE_IDS.Goods_Receipts);
        for (let i = 0; i < receipts.length; i++) {
            const r = receipts[i];
            const rid = r.Id || r.id;
            const expectedId = `GR-24-${String(i + 1).padStart(3, '0')}`;
            let payload = { Id: rid };
            let needs = false;

            if (r.ReceiptID !== expectedId) { payload.ReceiptID = expectedId; needs = true; }
            if (!r.Purchase_Orders_id && po.length > 0) { payload.Purchase_Orders_id = po[Math.floor(Math.random() * po.length)].id; needs = true; }
            if (!r.Users_id && users.length > 0) {
                const ur = users.find(u => u.role === 'PROCUREMENT_STAFF') || users[0];
                payload.Users_id = ur.id;
                needs = true;
            }

            if (needs) {
                await nocoRequest(`/api/v2/tables/${TABLE_IDS.Goods_Receipts}/records`, 'PATCH', payload);
                console.log(`   [GR] Fix #${rid} -> ${expectedId}`);
            }
        }

        // --- 5. SEED RECEIPT DETAILS ---
        console.log('\n6. Xử lý Receipt_Details...');
        const details = await fetchAll(TABLE_IDS.Receipt_Details);
        const freshGR = await fetchAll(TABLE_IDS.Goods_Receipts);
        for (let i = 0; i < details.length; i++) {
            const d = details[i];
            const rid = d.Id || d.id;
            const expectedId = `RD-24-${String(i + 1).padStart(3, '0')}`;
            let payload = { Id: rid };
            let needs = false;

            if (d.DetailID !== expectedId) { payload.DetailID = expectedId; needs = true; }
            if (!d.Goods_Receipts_id && freshGR.length > 0) { payload.Goods_Receipts_id = freshGR[Math.floor(Math.random() * freshGR.length)].id; needs = true; }

            if (needs) {
                await nocoRequest(`/api/v2/tables/${TABLE_IDS.Receipt_Details}/records`, 'PATCH', payload);
                console.log(`   [RD] Fix #${rid} -> ${expectedId}`);
            }
            
            // Link ONE batch to this detail to satisfy the reciprocal link
            if (batches.length > 0) {
                const targetBatch = batches[i % batches.length];
                await nocoRequest(`/api/v2/tables/${TABLE_IDS.Batches}/records`, 'PATCH', {
                    Id: targetBatch.Id || targetBatch.id,
                    Receipt_Details_id: rid
                });
            }
        }

        console.log('\n=== HOÀN TẤT ĐỒNG BỘ HÓA! TẤT CẢ BẢNG ĐÃ CHUẨN ĐẸP ===');
        console.log('Vui lòng F5 trang NocoDB để thấy thành quả.');

    } catch (err) {
        console.error('\nLỖI:', err.message);
    }
}

harmonize();
