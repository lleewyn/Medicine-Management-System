/**
 * PHARMA WMS - GR/RD LINKS FILLER
 * Lấp đầy các liên kết cho Goods_Receipts và Receipt_Details
 */

const https = require('https');

const NOCO_CONFIG = {
    BASE_URL: 'https://nocodb.data4life.top',
    API_TOKEN: 'CbFCU2G7OdsOVCHr4k315N0J7dQ5MzjJSOVSSU7x'
};

const TABLES = {
    Goods_Receipts: 'm738u03fvi1ywi1',
    Receipt_Details: 'mpayfc3xf9bypov',
    Purchase_Orders: 'm5u0dkeh3cx11zh',
    Batches: 'm8r83f9zdxzz56y'
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

async function fillReceiptLinks() {
    console.log('=== ĐANG LẤP ĐẦY LIÊN KẾT CHO GOODS_RECEIPTS & DETAILS ===');

    try {
        const grs = await fetchAll(TABLES.Goods_Receipts);
        const rds = await fetchAll(TABLES.Receipt_Details);
        const pos = await fetchAll(TABLES.Purchase_Orders);
        const batches = await fetchAll(TABLES.Batches);

        console.log(`Tìm thấy ${grs.length} Goods_Receipts và ${rds.length} Receipt_Details.`);

        // 1. Goods_Receipts -> Purchase_Orders
        for (let i = 0; i < grs.length; i++) {
            const gr = grs[i];
            const recordId = gr.Id || gr.id;
            const targetPO = pos[i % pos.length];

            await nocoRequest(`/api/v2/tables/${TABLES.Goods_Receipts}/records`, 'PATCH', {
                Id: recordId,
                Purchase_Orders_id: targetPO.Id || targetPO.id
            });
            console.log(`   [GR] ${gr.ReceiptID}: Link tới ${targetPO.PO_ID}`);
        }

        // 2. Receipt_Details -> Goods_Receipts & Batches
        for (let i = 0; i < rds.length; i++) {
            const rd = rds[i];
            const recordId = rd.Id || rd.id;
            const targetGR = grs[i % grs.length];
            const targetBatch = batches[i % batches.length];

            // Note: Batch link might be back-link (HM/OO)
            // But usually, we link the Detail to a Batch
            await nocoRequest(`/api/v2/tables/${TABLES.Receipt_Details}/records`, 'PATCH', {
                Id: recordId,
                Goods_Receipts_id: targetGR.Id || targetGR.id
                // Batch link might be via Batch column which is LinkToAnotherRecord
                // Often we update the Batch record to point back to the Detail
            });
            
            // Also update the batch to link to this detail if the FK is on Batch side
            await nocoRequest(`/api/v2/tables/${TABLES.Batches}/records`, 'PATCH', {
                Id: targetBatch.Id || targetBatch.id,
                Receipt_Details_id: recordId
            });

            console.log(`   [RD] ${rd.DetailID}: Link tới ${targetGR.ReceiptID} và ${targetBatch.BatchID}`);
        }

        console.log('\n=== HOÀN TẤT! DỮ LIỆU NHẬP KHO ĐÃ LINK XONG ===');
        console.log('Vui lòng nhấn F5 trên NocoDB để kiểm tra.');

    } catch (e) {
        console.error('LỖI:', e.message);
    }
}

fillReceiptLinks();
