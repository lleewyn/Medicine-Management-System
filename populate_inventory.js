/**
 * PHARMA WMS - INVENTORY POPULATOR
 * Tự động tạo bản ghi tồn kho cho tất cả các lô hàng (Batches) chưa có trong kho.
 */

const https = require('https');

const NOCO_CONFIG = {
  BASE_URL: 'https://nocodb.data4life.top',
  API_TOKEN: 'CbFCU2G7OdsOVCHr4k315N0J7dQ5MzjJSOVSSU7x'
};

const TABLE_IDS = {
  'Batches': 'm8r83f9zdxzz56y',
  'Warehouse_Locations': 'mqnkms35ablr79s',
  'Inventory': 'mh3qhve190b9hw0'
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

async function populateInventory() {
  console.log('--- ĐANG ĐỔ DỮ LIỆU TỒN KHO ---');

  try {
    // 1. Lấy danh sách Batches và Locations
    const batches = await nocoRequest(`/api/v2/tables/${TABLE_IDS.Batches}/records?limit=100`);
    const locations = await nocoRequest(`/api/v2/tables/${TABLE_IDS.Warehouse_Locations}/records?limit=100`);
    const inventory = await nocoRequest(`/api/v2/tables/${TABLE_IDS.Inventory}/records?limit=100`);
    
    const bList = batches.list || batches;
    const lList = locations.list || locations;
    const iList = inventory.list || inventory;

    // Lấy danh sách bIds đã có trong Inventory để tránh tạo trùng
    const existingBIds = iList.map(i => {
        const b = i.BatchID;
        return typeof b === 'object' ? b.Id : b;
    });

    console.log(`Đã có ${existingBIds.length} bản ghi tồn kho. Đang kiểm tra ${bList.length} lô hàng...`);

    for (const batch of bList) {
      if (!existingBIds.includes(batch.Id)) {
        // Lô hàng này chưa có trong Inventory, tạo mới
        const randomLoc = lList[Math.floor(Math.random() * lList.length)];
        
        const newInv = {
          BatchID: batch.Id,
          LocationID: randomLoc.Id,
          Quantity: Math.floor(Math.random() * 2000 + 100),
          ReservedQty: 0
        };

        await nocoRequest(`/api/v2/tables/${TABLE_IDS.Inventory}/records`, 'POST', newInv);
        console.log(`  [POST] Đã nhập lô ${batch.BatchID || batch.Id} vào kệ ${randomLoc.LocationID}`);
      }
    }

    console.log('\n--- HOÀN TẤT ĐỔ DỮ LIỆU TỒN KHO! ---');

  } catch (err) {
    console.error('Lỗi quy trình:', err.message);
  }
}

populateInventory();
