/**
 * PHARMA WMS - FIELD-ID BASED SEEDER
 * Sửa lỗi cột Link cho bảng Batches bằng cách sử dụng field internal ID chính xác (Products_id, Suppliers_id).
 */

const https = require('https');

const NOCO_CONFIG = {
  BASE_URL: 'https://nocodb.data4life.top',
  API_TOKEN: 'CbFCU2G7OdsOVCHr4k315N0J7dQ5MzjJSOVSSU7x'
};

const TABLE_IDS = {
  'Products': 'm4cznh4wdhp1pgy',
  'Suppliers': 'mqx5ocahwipcpsf',
  'Batches': 'm8r83f9zdxzz56y'
};

const nocoRequest = (path, method = 'GET', data = null) => new Promise((resolve) => {
  const req = https.request({ hostname: 'nocodb.data4life.top', path, method, headers: { 'xc-token': NOCO_CONFIG.API_TOKEN, 'Content-Type': 'application/json' } }, res => {
    let d = ''; res.on('data', c => d += c); res.on('end', () => resolve(d ? JSON.parse(d) : d));
  });
  if (data) req.write(JSON.stringify(data)); req.end();
});

async function run() {
  console.log('--- ĐANG SỬA CỘT LINK TRÊN BẢNG BATCHES ---');
  
  const productsRes = await nocoRequest(`/api/v2/tables/${TABLE_IDS.Products}/records`);
  const suppliersRes = await nocoRequest(`/api/v2/tables/${TABLE_IDS.Suppliers}/records`);
  const batchesRes = await nocoRequest(`/api/v2/tables/${TABLE_IDS.Batches}/records?limit=100`);
  
  const pList = productsRes.list || productsRes;
  const sList = suppliersRes.list || suppliersRes;
  const bList = batchesRes.list || batchesRes;
  
  console.log(`Đang xử lý ${bList.length} hàng...`);
  
  for (const batch of bList) {
    if (!batch.Products_id || !batch.Suppliers_id) {
        const p = pList[Math.floor(Math.random() * pList.length)];
        const s = sList[Math.floor(Math.random() * sList.length)];
        
        await nocoRequest(`/api/v2/tables/${TABLE_IDS.Batches}/records`, 'PATCH', {
            Id: batch.Id,
            Products_id: p.Id,
            Suppliers_id: s.Id
        });
        console.log(`  [OK] Đã link lô ${batch.BatchID || batch.Id} -> SP: ${p.ProductName}, NCC: ${s.SupplierName}`);
    }
  }
}

run();
