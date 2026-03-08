/**
 * PHARMA WMS - BATCH LINK FILLER
 * Lấp đầy các ô trống trong bảng Batches (ProductID và SupplierID)
 */

const https = require('https');

const NOCO_CONFIG = {
    BASE_URL: 'https://nocodb.data4life.top',
    API_TOKEN: 'CbFCU2G7OdsOVCHr4k315N0J7dQ5MzjJSOVSSU7x'
};

const TABLES = {
    Batches: 'm8r83f9zdxzz56y',
    Products: 'm4cznh4wdhp1pgy',
    Suppliers: 'mqx5ocahwipcpsf'
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

async function fillBatchLinks() {
    console.log('=== ĐANG LẤP ĐẦY LIÊN KẾT CHO BẢNG BATCHES ===');

    try {
        const batches = await fetchAll(TABLES.Batches);
        const products = await fetchAll(TABLES.Products);
        const suppliers = await fetchAll(TABLES.Suppliers);

        console.log(`Tìm thấy: ${batches.length} Batches, ${products.length} Products, ${suppliers.length} Suppliers.`);

        let updatedCount = 0;
        for (const batch of batches) {
            const recordId = batch.Id || batch.id;
            let payload = { Id: recordId };
            let needsUpdate = false;

            // Kiểm tra ProductID (Link)
            if (!batch.Products_id) {
                const randomProd = products[Math.floor(Math.random() * products.length)];
                payload.Products_id = randomProd.Id || randomProd.id;
                needsUpdate = true;
            }

            // Kiểm tra SupplierID (Link)
            if (!batch.Suppliers_id) {
                const randomSup = suppliers[Math.floor(Math.random() * suppliers.length)];
                payload.Suppliers_id = randomSup.Id || randomSup.id;
                needsUpdate = true;
            }

            if (needsUpdate) {
                await nocoRequest(`/api/v2/tables/${TABLES.Batches}/records`, 'PATCH', payload);
                console.log(`   [Batch] ${batch.BatchID}: Đã lấp đầy liên kết Sản phẩm/Nhà cung cấp.`);
                updatedCount++;
            }
        }

        console.log(`\n=== HOÀN TẤT! ĐÃ CẬP NHẬT ${updatedCount} LÔ HÀNG ===`);
        console.log('Vui lòng nhấn F5 trên NocoDB để kiểm tra kết quả.');

    } catch (e) {
        console.error('LỖI:', e.message);
    }
}

fillBatchLinks();
