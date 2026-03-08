/**
 * PHARMA WMS - GOODS ISSUES & DETAILS HARMONIZER
 * 1. Lấp đầy link SO_ID cho bảng Goods_Issues
 * 2. Lấp đầy dữ liệu và link cho bảng Issue_Details (DetailID, ShippedQty, Batches, Goods_Issues)
 */

const https = require('https');

const NOCO_CONFIG = {
    BASE_URL: 'https://nocodb.data4life.top',
    API_TOKEN: 'CbFCU2G7OdsOVCHr4k315N0J7dQ5MzjJSOVSSU7x'
};

const TABLES = {
    Goods_Issues: 'm3iu92n0nbf424n',
    Issue_Details: 'mu82yf1q7qsfrjb',
    Sales_Orders: 'm8gnl88wrij90wp',
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

async function harmonizeIssues() {
    console.log('=== ĐANG CHUẨN HÓA DỮ LIỆU XUẤT KHO (GOODS ISSUES) ===');

    try {
        const issues = await fetchAll(TABLES.Goods_Issues);
        const details = await fetchAll(TABLES.Issue_Details);
        const sos = await fetchAll(TABLES.Sales_Orders);
        const batches = await fetchAll(TABLES.Batches);

        console.log(`Tìm thấy ${issues.length} Goods_Issues và ${details.length} Issue_Details.`);

        // 1. Goods_Issues: Link to Sales Orders
        for (let i = 0; i < issues.length; i++) {
            const issue = issues[i];
            const targetSO = sos[i % sos.length];
            await nocoRequest(`/api/v2/tables/${TABLES.Goods_Issues}/records`, 'PATCH', {
                Id: issue.Id || issue.id,
                Sales_Orders_id: targetSO.Id || targetSO.id
            });
            console.log(`   [Issue] ${issue.IssueID} -> Link tới ${targetSO.SO_ID}`);
        }

        // 2. Issue_Details: Fill ID, Qty, and Links
        for (let i = 0; i < details.length; i++) {
            const detail = details[i];
            const recordId = detail.Id || detail.id;
            const expectedId = `ISD-24-${String(i + 1).padStart(3, '0')}`;
            const targetIssue = issues[i % issues.length];
            const targetBatch = batches[i % batches.length];

            await nocoRequest(`/api/v2/tables/${TABLES.Issue_Details}/records`, 'PATCH', {
                Id: recordId,
                DetailID: expectedId,
                ShippedQty: detail.ShippedQty || (100 + Math.floor(Math.random() * 500)),
                Goods_Issues_id: targetIssue.Id || targetIssue.id,
                Batches_id: targetBatch.Id || targetBatch.id
            });
            console.log(`   [Detail] ${expectedId}: Link tới ${targetIssue.IssueID} và ${targetBatch.BatchID}`);
        }

        console.log('\n=== HOÀN TẤT! DỮ LIỆU XUẤT KHO ĐÃ CHUẨN ĐẸP ===');
        console.log('Vui lòng nhấn F5 trên NocoDB để kiểm tra.');

    } catch (e) {
        console.error('LỖI:', e.message);
    }
}

harmonizeIssues();
