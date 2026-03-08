/**
 * PHARMA WMS - SUPER SEEDER (DATA RELATIONSHIPS)
 * Tự động thiết lập dữ liệu mẫu chuẩn hóa với các mối liên kết (Link-to-Link) trên NocoDB.
 */

const https = require('https');

const NOCO_CONFIG = {
  BASE_URL: 'https://nocodb.data4life.top',
  API_TOKEN: 'CbFCU2G7OdsOVCHr4k315N0J7dQ5MzjJSOVSSU7x'
};

const TABLE_IDS = {
  'Categories': 'ms16b7993d23ocf',
  'Products': 'm4cznh4wdhp1pgy',
  'Suppliers': 'mqx5ocahwipcpsf',
  'Customers': 'm34ugizvp0l1ple',
  'Warehouse_Locations': 'mqnkms35ablr79s',
  'Zones': 'm3hqjkf0w23r2qi',
  'Batches': 'm8r83f9zdxzz56y',
  'Inventory': 'mh3qhve190b9hw0',
  'Users': 'mm1izhsiixh0ix2',
  'Purchase_Orders': 'm5u0dkeh3cx11zh',
  'Sales_Orders': 'm8gnl88wrij90wp'
};

/**
 * Helper to call NocoDB API
 */
async function nocoRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(NOCO_CONFIG.BASE_URL);
    const options = {
      hostname: url.hostname,
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
        try { resolve(d ? JSON.parse(d) : null); } catch(e) { resolve(d); }
      });
    });
    req.on('error', (e) => {
      console.error('Request Error:', e.message);
      reject(e);
    });
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

/**
 * Lấy toàn bộ danh sách bản ghi để lấy ID thực tế
 */
async function fetchAll(tableName) {
  const res = await nocoRequest(`/api/v2/tables/${TABLE_IDS[tableName]}/records?limit=100`);
  return res.list || res;
}

/**
 * Xoá sạch bảng trước khi seed
 */
async function clearTable(tableName) {
  const records = await fetchAll(tableName);
  if (records.length > 0) {
    const ids = records.map(r => ({ Id: r.Id }));
    await nocoRequest(`/api/v2/tables/${TABLE_IDS[tableName]}/records`, 'DELETE', ids);
    console.log(`- Đã xoá sạch bảng ${tableName}`);
  }
}

async function seed() {
  console.log('--- BẮT ĐẦU QUY TRÌNH SIÊU ĐỒNG BỘ (SUPER SEED) ---');

  // 1. CLEAR DỮ LIỆU CŨ (Thứ tự quan trọng do quan hệ cha-con)
  // Xoá con trước cha
  await clearTable('Inventory');
  await clearTable('Batches');
  await clearTable('Products');
  await clearTable('Categories');
  await clearTable('Suppliers');
  await clearTable('Customers');
  await clearTable('Warehouse_Locations');
  await clearTable('Zones');

  // 2. SEED CATEGORIES
  console.log('\n--- 1. Cài đặt Danh mục & Đối tác ---');
  await nocoRequest(`/api/v2/tables/${TABLE_IDS.Categories}/records`, 'POST', [
    { CategoryID: 'ETC', CategoryName: 'Thuốc kê đơn (ETC)', Description: 'Cần sự chỉ định của bác sĩ' },
    { CategoryID: 'OTC', CategoryName: 'Thuốc không kê đơn (OTC)', Description: 'Sử dụng tự do' }
  ]);
  const categories = await fetchAll('Categories');
  const etcId = categories.find(c => c.CategoryID === 'ETC')?.Id;
  const otcId = categories.find(c => c.CategoryID === 'OTC')?.Id;

  // 3. SEED SUPPLIERS & CUSTOMERS
  await nocoRequest(`/api/v2/tables/${TABLE_IDS.Suppliers}/records`, 'POST', [
    { SupplierID: 'SUP-001', SupplierName: 'Pfizer Vietnam Ltd.', SupplierType: 'NHÀ_SẢN_XUẤT' },
    { SupplierID: 'SUP-002', SupplierName: 'Dược Hậu Giang (DHG)', SupplierType: 'NHÀ_CUNG_CẤP' }
  ]);
  const suppliers = await fetchAll('Suppliers');
  const supplierId = suppliers[0]?.Id;

  await nocoRequest(`/api/v2/tables/${TABLE_IDS.Customers}/records`, 'POST', [
    { CustomerID: 'CUST-001', CustomerName: 'Hệ thống Nhà thuốc Pharmacity', Region: 'Toàn quốc' },
    { CustomerID: 'CUST-002', CustomerName: 'Bệnh viện Chợ Rẫy', Region: 'Miền Nam' }
  ]);

  // 4. SEED PRODUCTS (Liên kết với Categories)
  console.log('--- 2. Cài đặt Sản phẩm ---');
  await nocoRequest(`/api/v2/tables/${TABLE_IDS.Products}/records`, 'POST', [
    { ProductID: 'SKU-PFIZ-01', ProductName: 'Vaccine Pfizer-BioNTech', CategoryID: etcId, StorageCondition: 'KHO_LANH' },
    { ProductID: 'SKU-HAPA-02', ProductName: 'Hapacol 650mg', CategoryID: otcId, StorageCondition: 'KHO_THUONG' }
  ]);
  const products = await fetchAll('Products');
  const pfizerId = products.find(p => p.ProductID === 'SKU-PFIZ-01')?.Id;

  // 5. SEED ZONES & LOCATIONS
  console.log('--- 3. Cài đặt Kho bãi ---');
  await nocoRequest(`/api/v2/tables/${TABLE_IDS.Zones}/records`, 'POST', [
    { ZoneID: 'Z-COLD', ZoneName: 'Vùng kho lạnh', WarehouseID: 'WH-HN' },
    { ZoneID: 'Z-AMB', ZoneName: 'Vùng kho thường', WarehouseID: 'WH-HN' }
  ]);
  const zones = await fetchAll('Zones');
  const zColdId = zones.find(z => z.ZoneID === 'Z-COLD')?.Id;

  await nocoRequest(`/api/v2/tables/${TABLE_IDS.Warehouse_Locations}/records`, 'POST', [
    { LocationID: 'A1-01', LocationName: 'Kệ A1-Hàng 1', ZoneID: zColdId },
    { LocationID: 'B2-03', LocationName: 'Kệ B2-Hàng 3', ZoneID: zColdId }
  ]);
  const locations = await fetchAll('Warehouse_Locations');
  const locId = locations[0]?.Id;

  // 6. SEED BATCHES (Liên kết với Product & Supplier)
  console.log('--- 4. Cài đặt Lô hàng & Tồn kho ---');
  await nocoRequest(`/api/v2/tables/${TABLE_IDS.Batches}/records`, 'POST', [
    {
      BatchID: 'BATCH-2026-001', 
      Batchcode: 'PF-260309', 
      ProductID: pfizerId, 
      SupplierID: supplierId,
      MfgDate: '2026-01-01',
      ExpDate: '2028-01-01',
      BatchStatus: 'RELEASED'
    }
  ]);
  const batches = await fetchAll('Batches');
  const batchId = batches[0]?.Id;

  // 7. SEED INVENTORY (Liên kết với Batch & Location)
  if (batchId && locId) {
    await nocoRequest(`/api/v2/tables/${TABLE_IDS.Inventory}/records`, 'POST', {
      BatchID: batchId,
      LocationID: locId,
      Quantity: 5000,
      ReservedQty: 0
    });
  }

  console.log('\n--- TẤT CẢ DỮ LIỆU ĐÃ ĐƯỢC THIẾT LẬP VỚI MỐI QUAN HỆ CHUẨN! ---');
}

seed().catch(err => {
    console.error('Seed Process Failed:', err);
});
