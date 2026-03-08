/**
 * PHARMA WMS - ELEGANT MASS SEEDER
 * Tự động "điền hộ" dữ liệu cho các dòng trống trong bảng Batches.
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

async function massUpdate() {
  console.log('--- ĐANG ĐIỀN DỮ LIỆU TỰ ĐỘNG ---');

  try {
    // 1. Lấy danh sách Products và Suppliers để mapping
    const products = await nocoRequest(`/api/v2/tables/${TABLE_IDS.Products}/records?limit=100`);
    const suppliers = await nocoRequest(`/api/v2/tables/${TABLE_IDS.Suppliers}/records?limit=100`);
    
    // Chuyển sang mảng
    const pList = products.list || products;
    const sList = suppliers.list || suppliers;

    if (pList.length === 0 || sList.length === 0) {
      console.log('Lỗi: Chưa có Sản phẩm hoặc Nhà cung cấp để liên kết!');
      return;
    }

    // 2. Lấy danh sách Batches hiện có
    const batches = await nocoRequest(`/api/v2/tables/${TABLE_IDS.Batches}/records?limit=100`);
    const bList = batches.list || batches;

    console.log(`Đã tìm thấy ${bList.length} lô hàng. Đang tiến hành "điền hộ" các ô trống...`);

    // 3. Cập nhật từng dòng
    for (const batch of bList) {
      // Chỉ cập nhật nếu ProductID hoặc SupplierID còn trống (null/undefined)
      // Lưu ý: Trong NocoDB v2 Link field trả về Object hoặc Null
      if (!batch.ProductID || !batch.SupplierID) {
        // Chọn ngẫu nhiên sản phẩm và nhà cung cấp
        const randomP = pList[Math.floor(Math.random() * pList.length)];
        const randomS = sList[Math.floor(Math.random() * sList.length)];

        const updateData = {
          Id: batch.Id, // Primary Key quan trọng để PATCH
          ProductID: randomP.Id,
          SupplierID: randomS.Id,
          BatchStatus: 'RELEASED',
          ImportPrice: Math.floor(Math.random() * 500000 + 50000)
        };

        await nocoRequest(`/api/v2/tables/${TABLE_IDS.Batches}/records`, 'PATCH', updateData);
        console.log(`  [OK] Đã điền dữ liệu cho lô: ${batch.BatchID || batch.Id}`);
      }
    }

    console.log('\n--- HOÀN TẤT "ĐIỀN HỘ"! ---');
    console.log('Bạn hãy F5 (Reload) lại trang NocoDB để thấy các ô trống đã được lấp đầy.');

  } catch (err) {
    console.error('Lỗi quy trình:', err.message);
  }
}

massUpdate();
