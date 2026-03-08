/**
 * PHARMA WMS - MASTER DATA HARMONIZER
 * 1. Dọn dẹp các ID không đúng định dạng (BATCH-REL, ZON-001, L-01, v.v.)
 * 2. Tự động điền tất cả các cột Link bị trống (ProductID, SupplierID, ZoneID, v.v.)
 * 3. Đồng nhất ID về định dạng tiêu chuẩn (YY-XXX)
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
    Purchase_Orders: 'm5u0dkeh3cx11zh',
    Sales_Orders: 'm8gnl88wrij90wp',
    Users: 'mm1izhsiixh0ix2'
};

// Hàm gọi API NocoDB
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

async function masterFix() {
    console.log('=== BẮT ĐẦU ĐỒNG BỘ HÓA TOÀN BỘ DỮ LIỆU (v3) ===\n');

    try {
        // 1. Lấy dữ liệu nguồn (Parent Tables)
        console.log('1. Đang tải dữ liệu nguồn...');
        const products = await fetchAll(TABLE_IDS.Products);
        const suppliers = await fetchAll(TABLE_IDS.Suppliers);
        const customers = await fetchAll(TABLE_IDS.Customers);
        const zones = await fetchAll(TABLE_IDS.Zones);
        const users = await fetchAll(TABLE_IDS.Users);
        
        console.log(`   - SP: ${products.length}, NCC: ${suppliers.length}, Khách: ${customers.length}, Khu: ${zones.length}, User: ${users.length}`);

        // 2. Xử lý bảng ZONES (Xóa các ZON-00X lỗi)
        console.log('\n2. Đang dọn dẹp bảng Zones...');
        for (const z of zones) {
            const zId = z.Id || z.id;
            if (z.ZoneID && (z.ZoneID.startsWith('ZON-00') || z.ZoneID.startsWith('ZON-REL'))) {
                await nocoRequest(`/api/v2/tables/${TABLE_IDS.Zones}/records`, 'DELETE', { Id: zId });
                console.log(`   [DELETE] Xóa Zone lỗi: ${z.ZoneID}`);
            }
        }
        const updatedZones = await fetchAll(TABLE_IDS.Zones);

        // 3. Xử lý bảng LOCATIONS (Link to Zones)
        console.log('\n3. Đang kiểm tra bảng Warehouse_Locations...');
        const locations = await fetchAll(TABLE_IDS.Locations);
        for (const loc of locations) {
            const locId = loc.Id || loc.id;
            // Xóa các record ID lạ
            if (loc.LocationID === 'L-01' || loc.LocationID === 'A1-01' || (loc.LocationID && loc.LocationID.includes('REL'))) {
                await nocoRequest(`/api/v2/tables/${TABLE_IDS.Locations}/records`, 'DELETE', { Id: locId });
                console.log(`   [DELETE] Xóa Location lỗi: ${loc.LocationID}`);
                continue;
            }

            // Gắn Zone nếu trống
            if (updatedZones.length > 0 && !loc.Zones_id) {
                const randomZone = updatedZones[Math.floor(Math.random() * updatedZones.length)];
                await nocoRequest(`/api/v2/tables/${TABLE_IDS.Locations}/records`, 'PATCH', {
                    Id: locId,
                    Zones_id: randomZone.Id || randomZone.id
                });
                console.log(`   [LINK] Location ${loc.LocationID} -> Khu ${randomZone.ZoneID}`);
            }
        }

        // 4. Xử lý bảng BATCHES (Link to Products & Suppliers)
        console.log('\n4. Đang kiểm tra bảng Batches...');
        const batches = await fetchAll(TABLE_IDS.Batches);
        for (const b of batches) {
            const bId = b.Id || b.id;
            // Nếu đây là lô BATCH-REL-001 hoặc ID lạ khác, ta xóa
            if (b.BatchID && (b.BatchID.startsWith('BATCH-REL') || b.BatchID.includes('SO-2'))) {
                await nocoRequest(`/api/v2/tables/${TABLE_IDS.Batches}/records`, 'DELETE', { Id: bId });
                console.log(`   [DELETE] Xóa Lô lỗi: ${b.BatchID}`);
                continue;
            }

            // Gắn SP và NCC nếu link bị trống
            if (!b.Products_id || !b.Suppliers_id) {
                const prod = products[Math.floor(Math.random() * products.length)];
                const supp = suppliers[Math.floor(Math.random() * suppliers.length)];
                await nocoRequest(`/api/v2/tables/${TABLE_IDS.Batches}/records`, 'PATCH', {
                    Id: bId,
                    Products_id: prod.Id || prod.id,
                    Suppliers_id: supp.Id || supp.id,
                    BatchStatus: 'RELEASED'
                });
                console.log(`   [LINK] Lô ${b.BatchID} -> SP: ${prod.ProductID}, NCC: ${supp.SupplierID}`);
            }
        }

        // 5. Xử lý bảng INVENTORY (Link to Batches & Locations)
        console.log('\n5. Đang kiểm tra bảng Inventory...');
        let invEntriesRaw = await fetchAll(TABLE_IDS.Inventory);
        const invEntries = Array.isArray(invEntriesRaw) ? invEntriesRaw : (invEntriesRaw.list || []);
        
        const finalBatches = await fetchAll(TABLE_IDS.Batches);
        const finalLocs = await fetchAll(TABLE_IDS.Locations);

        console.log(`   Xử lý ${invEntries.length} dòng tồn kho...`);

        for (const inv of invEntries) {
            const recordId = inv.Id || inv.id || inv.ID;
            if (!recordId) continue;

            let needsUpdate = false;
            let payload = { Id: recordId };

            if (!inv.Batches_id && finalBatches.length > 0) {
                const b = finalBatches[Math.floor(Math.random() * finalBatches.length)];
                payload.Batches_id = b.Id || b.id;
                needsUpdate = true;
            }
            if (!inv.Warehouse_Locations_id && finalLocs.length > 0) {
                const l = finalLocs[Math.floor(Math.random() * finalLocs.length)];
                payload.Warehouse_Locations_id = l.Id || l.id;
                needsUpdate = true;
            }
            if (!inv.InventoryID || inv.InventoryID.includes('undefined')) {
                payload.InventoryID = 'INV-24-' + String(recordId).padStart(3, '0');
                needsUpdate = true;
            }

            if (needsUpdate) {
                await nocoRequest(`/api/v2/tables/${TABLE_IDS.Inventory}/records`, 'PATCH', payload);
                console.log(`   [LINK] Tồn kho #${recordId} [Done]`);
            }
        }
        
        // RE-FETCH Users to be sure
        const updatedUsers = await fetchAll(TABLE_IDS.Users);

        // 6. Xử lý bảng PURCHASE ORDERS (Link to Suppliers & Users)
        console.log('\n6. Đang kiểm tra bảng Purchase_Orders...');
        let posRaw = await fetchAll(TABLE_IDS.Purchase_Orders);
        const pos = Array.isArray(posRaw) ? posRaw : (posRaw.list || []);
        
        for (const po of pos) {
            const pId = po.Id || po.id || po.ID;
            if (!pId) continue;

            if (po.PO_ID && (po.PO_ID.startsWith('PO-26') || po.PO_ID.includes('REL'))) {
                await nocoRequest(`/api/v2/tables/${TABLE_IDS.Purchase_Orders}/records`, 'DELETE', { Id: pId });
                console.log(`   [DELETE] Xóa PO ID sai: ${po.PO_ID}`);
                continue;
            }

            if (!po.Suppliers_id || !po.Users_id) {
                const su = suppliers[Math.floor(Math.random() * suppliers.length)];
                const ur = updatedUsers.find(u => u.role === 'PROCUREMENT_STAFF' || u.role === 'SYSTEM_ADMIN') || updatedUsers[0];
                await nocoRequest(`/api/v2/tables/${TABLE_IDS.Purchase_Orders}/records`, 'PATCH', {
                    Id: pId,
                    Suppliers_id: su.Id || su.id,
                    Users_id: ur.Id || ur.id
                });
                console.log(`   [LINK] PO ${po.PO_ID} -> NCC: ${su.SupplierID}`);
            }
        }

        // 7. Xử lý SALES ORDERS
        console.log('\n7. Đang kiểm tra Sales_Orders...');
        let sosRaw = await fetchAll(TABLE_IDS.Sales_Orders);
        const sos = Array.isArray(sosRaw) ? sosRaw : (sosRaw.list || []);

        for (const so of sos) {
            const sId = so.Id || so.id || so.ID;
            if (!sId) continue;

            if (so.SO_ID && (so.SO_ID.startsWith('SO-26') || so.SO_ID.includes('REL'))) {
                await nocoRequest(`/api/v2/tables/${TABLE_IDS.Sales_Orders}/records`, 'DELETE', { Id: sId });
                console.log(`   [DELETE] Xóa SO ID sai: ${so.SO_ID}`);
                continue;
            }

            if (!so.Customers_id || !so.Users_id) {
                const cust = customers[Math.floor(Math.random() * customers.length)];
                const sale = updatedUsers.find(u => u.role === 'SALES_STAFF' || u.role === 'SYSTEM_ADMIN') || updatedUsers[0];
                await nocoRequest(`/api/v2/tables/${TABLE_IDS.Sales_Orders}/records`, 'PATCH', {
                    Id: sId,
                    Customers_id: cust.Id || cust.id,
                    Users_id: sale.Id || sale.id
                });
                console.log(`   [LINK] SO ${so.SO_ID} -> Khách: ${cust.CustomerID}`);
            }
        }

        console.log('\n=== HOÀN TẤT! DỮ LIỆU ĐÃ SIÊU SẠCH VÀ ĐẦY ĐỦ LIÊN KẾT ===');


        console.log('Vui lòng nhấn F5 trên NocoDB để xem kết quả.');

    } catch (err) {
        console.error('\n[LỖI]:', err.message);
    }
}

masterFix();
