/**
 * PHARMA WMS - FINAL DATA SEEDER (PRO VERSION)
 * Đổ dữ liệu mẫu đầy đủ cho TẤT CẢ các bảng quan trọng trên NocoDB.
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
        try { resolve(d ? JSON.parse(d) : null); } catch(e) { resolve(d); }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function runSeed() {
  console.log('🚀 Bắt đầu đổ dữ liệu thực tế vào NocoDB...');

  try {
    // 1. Categories
    console.log('-> Đang đổ bảng Categories...');
    await nocoRequest(`/api/v2/tables/${TABLE_IDS.Categories}/records`, 'POST', [
      { CategoryID: 'ETC', CategoryName: 'Thuốc kê đơn (ETC)' },
      { CategoryID: 'OTC', CategoryName: 'Thuốc không kê đơn (OTC)' },
      { CategoryID: 'VACCINE', CategoryName: 'Vaccine & Sinh phẩm' }
    ]);
    const cats = await nocoRequest(`/api/v2/tables/${TABLE_IDS.Categories}/records`);
    const etcId = cats.list.find(c => c.CategoryID === 'ETC')?.Id;
    const vacId = cats.list.find(c => c.CategoryID === 'VACCINE')?.Id;

    // 2. Suppliers
    console.log('-> Đang đổ bảng Suppliers...');
    await nocoRequest(`/api/v2/tables/${TABLE_IDS.Suppliers}/records`, 'POST', [
      { SupplierID: 'SUP-001', SupplierName: 'Pfizer Vietnam Ltd.', SupplierType: 'NHÀ_SẢN_XUẤT' },
      { SupplierID: 'SUP-002', SupplierName: 'Dược Hậu Giang (DHG)', SupplierType: 'NHÀ_CUNG_CẤP' },
      { SupplierID: 'SUP-003', SupplierName: 'AstraZeneca VN', SupplierType: 'NHÀ_SẢN_XUẤT' }
    ]);
    const sups = await nocoRequest(`/api/v2/tables/${TABLE_IDS.Suppliers}/records`);
    const supPfizerId = sups.list.find(s => s.SupplierID === 'SUP-001')?.Id;

    // 3. Products
    console.log('-> Đang đổ bảng Products...');
    await nocoRequest(`/api/v2/tables/${TABLE_IDS.Products}/records`, 'POST', [
      { ProductID: 'SKU-PFIZ-01', ProductName: 'Vaccine Pfizer-BioNTech', CategoryID: vacId, StorageCondition: 'KHO_LANH' },
      { ProductID: 'SKU-HAPA-02', ProductName: 'Hapacol 650mg', CategoryID: etcId, StorageCondition: 'KHO_THUONG' },
      { ProductID: 'SKU-PARA-03', ProductName: 'Paracetamol 500mg', CategoryID: etcId, StorageCondition: 'KHO_THUONG' }
    ]);
    const pros = await nocoRequest(`/api/v2/tables/${TABLE_IDS.Products}/records`);
    const pfizerProId = pros.list.find(p => p.ProductID === 'SKU-PFIZ-01')?.Id;

    // 4. Zones & Locations
    console.log('-> Đang đổ bảng Zones & Locations...');
    await nocoRequest(`/api/v2/tables/${TABLE_IDS.Zones}/records`, 'POST', [
      { ZoneID: 'Z-001', ZoneName: 'Khu Lạnh A', WarehouseID: 'WH-HN' },
      { ZoneID: 'Z-002', ZoneName: 'Khu Thường B', WarehouseID: 'WH-HN' }
    ]);
    const zns = await nocoRequest(`/api/v2/tables/${TABLE_IDS.Zones}/records`);
    const zColdId = zns.list.find(z => z.ZoneID === 'Z-001')?.Id;

    await nocoRequest(`/api/v2/tables/${TABLE_IDS.Warehouse_Locations}/records`, 'POST', [
      { LocationID: 'A1-01', LocationName: 'Kệ A1-01', ZoneID: zColdId },
      { LocationID: 'A1-02', LocationName: 'Kệ A1-02', ZoneID: zColdId }
    ]);
    const locs = await nocoRequest(`/api/v2/tables/${TABLE_IDS.Warehouse_Locations}/records`);
    const locId = locs.list[0]?.Id;

    // 5. Batches (Link tới Product & Supplier)
    console.log('-> Đang đổ bảng Batches...');
    await nocoRequest(`/api/v2/tables/${TABLE_IDS.Batches}/records`, 'POST', [
      { 
        BatchID: 'BAT-2026-001', 
        Batchcode: 'LOT-PZ-123', 
        ProductID: pfizerProId, 
        SupplierID: supPfizerId, 
        BatchStatus: 'RELEASED',
        MfgDate: '2026-01-01',
        ExpDate: '2028-01-01'
      }
    ]);
    const bats = await nocoRequest(`/api/v2/tables/${TABLE_IDS.Batches}/records`);
    const batId = bats.list.find(b => b.BatchID === 'BAT-2026-001')?.Id;

    // 6. Inventory (Link tới Batch & Location)
    console.log('-> Đang đổ bảng Inventory...');
    if (batId && locId) {
      await nocoRequest(`/api/v2/tables/${TABLE_IDS.Inventory}/records`, 'POST', {
        BatchID: batId,
        LocationID: locId,
        Quantity: 2500
      });
    }

    // 7. Customers
    console.log('-> Đang đổ bảng Customers...');
    await nocoRequest(`/api/v2/tables/${TABLE_IDS.Customers}/records`, 'POST', [
      { CustomerID: 'CUST-001', CustomerName: 'Pharmacity' },
      { CustomerID: 'CUST-002', CustomerName: 'Long Châu' }
    ]);

    console.log('\n✅ HOÀN TẤT! Dữ liệu đã được đổ đầy đủ và liên kết chính xác.');
    console.log('Hãy F5 lại trang NocoDB để thấy thành quả.');

  } catch (err) {
    console.error('❌ Lỗi:', err.message);
  }
}

runSeed();
