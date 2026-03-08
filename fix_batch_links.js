/**
 * PHARMA WMS - PRECISE LINK FILLER
 * Điền chính xác ProductID và SupplierID cho các ô trống.
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

async function fixLinks() {
  console.log('--- ĐANG SỬA LỖI LIÊN KẾT PRODUCT/SUPPLIER ---');

  try {
    const productsRes = await nocoRequest(`/api/v2/tables/${TABLE_IDS.Products}/records?limit=100`);
    const suppliersRes = await nocoRequest(`/api/v2/tables/${TABLE_IDS.Suppliers}/records?limit=100`);
    const batchesRes = await nocoRequest(`/api/v2/tables/${TABLE_IDS.Batches}/records?limit=100`);

    const products = productsRes.list || productsRes;
    const suppliers = suppliersRes.list || suppliersRes;
    const batches = batchesRes.list || batchesRes;

    console.log(`Tìm thấy ${products.length} SP, ${suppliers.length} NCC, ${batches.length} Lô.`);

    for (const batch of batches) {
      // Kiểm tra nếu ProductID hoặc SupplierID chưa được link (null hoặc rỗng)
      // NocoDB v2 Link field trả về null hoặc object. Ta kiểm tra nếu nó không phải object có Id.
      const needsProduct = !batch.ProductID || (typeof batch.ProductID !== 'object');
      const needsSupplier = !batch.SupplierID || (typeof batch.SupplierID !== 'object');

      if (needsProduct || needsSupplier) {
        const randomP = products[Math.floor(Math.random() * products.length)];
        const randomS = suppliers[Math.floor(Math.random() * suppliers.length)];

        // Trong NocoDB v2, để update Link-to-One, ta truyền ID của record đích
        const updatePayload = {
          Id: batch.Id
        };
        
        if (needsProduct) updatePayload.ProductID = randomP.Id;
        if (needsSupplier) updatePayload.SupplierID = randomS.Id;

        await nocoRequest(`/api/v2/tables/${TABLE_IDS.Batches}/records`, 'PATCH', updatePayload);
        console.log(`  [UPDATED] Lô ${batch.BatchID || batch.Id} -> SP Id: ${randomP.Id}, NCC Id: ${randomS.Id}`);
      }
    }

    console.log('\n--- XONG! HÃY F5 LẠI NOCODB ---');
  } catch (err) {
    console.error('Lỗi:', err.message);
  }
}

fixLinks();
