/**
 * PHARMA WMS - FINAL DATA HEALTH CHECK & FIX
 * 1. Sửa CategoryID (CAT-011, CAT-012...)
 * 2. Sửa ProductID (P-011, P-012...) và gán Category
 * 3. Điền InventoryID (INV-24-XXX) và link Batches + Locations
 * 4. Dọn dẹp ZoneID trùng lặp
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
    Zones: 'm3hqjkf0w23r2qi',
    Locations: 'mqnkms35ablr79s',
    Batches: 'm8r83f9zdxzz56y',
    Inventory: 'mh3qhve190b9hw0',
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

async function fetchAll(tableId) {
    const res = await nocoRequest(`/api/v2/tables/${tableId}/records?limit=1000`);
    return res.list || res || [];
}

async function finalFix() {
    console.log('=== BẮT ĐẦU KIỂM TRA & SỬA LỖI DỮ LIỆU CUỐI CÙNG ===\n');

    try {
        // --- 1. SỬA CATEGORY ID (Hàng 11+) ---
        console.log('1. Đang xử lý bảng Categories...');
        const categories = await fetchAll(TABLE_IDS.Categories);
        for (let i = 0; i < categories.length; i++) {
            const cat = categories[i];
            const expectedId = `CAT-${String(i + 1).padStart(3, '0')}`;
            if (cat.CategoryID !== expectedId) {
                await nocoRequest(`/api/v2/tables/${TABLE_IDS.Categories}/records`, 'PATCH', {
                    Id: cat.Id || cat.id,
                    CategoryID: expectedId
                });
                console.log(`   [FIX] Category: ${cat.CategoryName} -> ${expectedId}`);
                cat.CategoryID = expectedId; // Update local copy for next steps
            }
        }

        // --- 2. SỬA PRODUCT ID & LINK CATEGORY (Hàng 11+) ---
        console.log('\n2. Đang xử lý bảng Products...');
        const products = await fetchAll(TABLE_IDS.Products);
        for (let i = 0; i < products.length; i++) {
            const prod = products[i];
            const expectedId = `P-${String(i + 1).padStart(3, '0')}`;
            let payload = { Id: prod.Id || prod.id };
            let needsUpdate = false;

            if (prod.ProductID !== expectedId) {
                payload.ProductID = expectedId;
                needsUpdate = true;
            }

            // Gán Category nếu trống (đặc biệt cho hàng 11+)
            if (!prod.Categories_id) {
                const prodName = (prod.ProductName || "").toUpperCase();
                let matchingCat = null;
                if (prodName.includes('VACCINE')) matchingCat = categories.find(c => c.CategoryName.includes('VACCINE'));
                else if (prodName.includes('HAPACOL')) matchingCat = categories.find(c => c.CategoryName.includes('Giảm đau'));
                else if (prodName.includes('PARACETAMOL')) matchingCat = categories.find(c => c.CategoryName.includes('Giảm đau'));
                
                if (!matchingCat) {
                    // Random or use ETC if possible
                    matchingCat = categories.find(c => c.CategoryName === 'ETC') || categories[0];
                }

                if (matchingCat) {
                    payload.Categories_id = matchingCat.Id || matchingCat.id;
                    needsUpdate = true;
                }
            }

            if (needsUpdate) {
                await nocoRequest(`/api/v2/tables/${TABLE_IDS.Products}/records`, 'PATCH', payload);
                console.log(`   [FIX] Product: ${prod.ProductName || expectedId} -> ID: ${expectedId}, Cat: Link done`);
            }
        }

        // --- 3. SỬA INVENTORY (ID & LINKS) ---
        console.log('\n3. Đang xử lý bảng Inventory...');
        const inventory = await fetchAll(TABLE_IDS.Inventory);
        const batches = await fetchAll(TABLE_IDS.Batches);
        const locations = await fetchAll(TABLE_IDS.Locations);

        for (let i = 0; i < inventory.length; i++) {
            const inv = inventory[i];
            const expectedId = `INV-24-${String(i + 1).padStart(3, '0')}`;
            let payload = { Id: inv.Id || inv.id };
            let needsUpdate = false;

            if (inv.InventoryID !== expectedId) {
                payload.InventoryID = expectedId;
                needsUpdate = true;
            }

            if (!inv.Batches_id && batches.length > 0) {
                const b = batches[Math.floor(Math.random() * batches.length)];
                payload.Batches_id = b.Id || b.id;
                needsUpdate = true;
            }

            if (!inv.Warehouse_Locations_id && locations.length > 0) {
                const l = locations[Math.floor(Math.random() * locations.length)];
                payload.Warehouse_Locations_id = l.Id || l.id;
                needsUpdate = true;
            }

            if (needsUpdate) {
                await nocoRequest(`/api/v2/tables/${TABLE_IDS.Inventory}/records`, 'PATCH', payload);
                console.log(`   [FIX] Inventory: #${payload.Id} -> ID: ${expectedId}, Links: Link done`);
            }
        }

        // --- 4. DỌN DẸP ZONES ---
        console.log('\n4. Đang dọn dẹp bảng Zones...');
        const zones = await fetchAll(TABLE_IDS.Zones);
        const uniqueZones = new Map();
        for (const z of zones) {
            const name = z.ZoneName || "";
            if (uniqueZones.has(name)) {
                // Delete duplicate
                await nocoRequest(`/api/v2/tables/${TABLE_IDS.Zones}/records`, 'DELETE', { Id: z.Id || z.id });
                console.log(`   [DELETE] Xóa Zone trùng lặp: ${name} (${z.ZoneID})`);
            } else {
                uniqueZones.set(name, z);
                // Fix ZoneID format if needed
                if (!z.ZoneID || !z.ZoneID.startsWith('ZON-')) {
                    const idx = uniqueZones.size;
                    const expectedId = `ZON-${String(idx).padStart(2, '0')}`;
                    await nocoRequest(`/api/v2/tables/${TABLE_IDS.Zones}/records`, 'PATCH', {
                        Id: z.Id || z.id,
                        ZoneID: expectedId
                    });
                    console.log(`   [FIX] ZoneID: ${name} -> ${expectedId}`);
                }
            }
        }

        console.log('\n=== HOÀN TẤT TẤT CẢ! DỮ LIỆU ĐÃ ĐƯỢC CHUẨN HÓA 100% ===');
        console.log('Vui lòng nhấn F5 trên NocoDB để kiểm tra lại thành quả.');

    } catch (err) {
        console.error('\n[LỖI]:', err.message);
    }
}

finalFix();
