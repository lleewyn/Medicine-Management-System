/**
 * PHARMA WMS - SOD LINKS FILLER
 * Lấp đầy các liên kết (SO_ID, ProductID) cho bảng Sales_Order_Details
 */

const https = require('https');

const NOCO_CONFIG = {
    BASE_URL: 'https://nocodb.data4life.top',
    API_TOKEN: 'CbFCU2G7OdsOVCHr4k315N0J7dQ5MzjJSOVSSU7x'
};

const TABLES = {
    Sales_Order_Details: 'm04m8k78x5kmfs4',
    Sales_Orders: 'm8gnl88wrij90wp',
    Products: 'm4cznh4wdhp1pgy'
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

async function fillSODLinks() {
    console.log('=== ĐANG LẤP ĐẦY LIÊN KẾT CHO SALES_ORDER_DETAILS ===');

    try {
        const details = await fetchAll(TABLES.Sales_Order_Details);
        const sos = await fetchAll(TABLES.Sales_Orders);
        const products = await fetchAll(TABLES.Products);

        console.log(`Tìm thấy ${details.length} chi tiết đơn bán.`);

        for (let i = 0; i < details.length; i++) {
            const detail = details[i];
            const recordId = detail.Id || detail.id;
            
            // Phân bổ đơn hàng và sản phẩm
            const targetSO = sos[i % sos.length];
            const targetProd = products[i % products.length];

            await nocoRequest(`/api/v2/tables/${TABLES.Sales_Order_Details}/records`, 'PATCH', {
                Id: recordId,
                Sales_Orders_id: targetSO.Id || targetSO.id,
                Products_id: targetProd.Id || targetProd.id
            });
            
            console.log(`   [SOD] ${detail.SODetailID}: Link tới ${targetSO.SO_ID} và ${targetProd.ProductName}`);
        }

        console.log('\n=== HOÀN TẤT! CHI TIẾT ĐƠN BÁN ĐÃ ĐẦY ĐỦ LIÊN KẾT ===');
        console.log('Vui lòng nhấn F5 trên NocoDB để kiểm tra.');

    } catch (e) {
        console.error('LỖI:', e.message);
    }
}

fillSODLinks();
