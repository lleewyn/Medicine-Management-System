
const http = require('https');

const NOCO_CONFIG = {
    BASE_URL: 'nocodb.data4life.top',
    API_TOKEN: 'CbFCU2G7OdsOVCHr4k315N0J7dQ5MzjJSOVSSU7x',
    TABLES: {
        'Category': 'ms16b7993d23ocf',
        'Products': 'm4cznh4wdhp1pgy',
        'Suppliers': 'mqx5ocahwipcpsf', 
        'Batches': 'm8r83f9zdxzz56y', 
        'Inventory': 'mh3qhve190b9hw0',
        'Users': 'mm1izhsiixh0ix2',
        'Purchase_Orders': 'm5u0dkeh3cx11zh',
        'Purchase_Order_Details': 'miyern110bb8w23', 
        'Sales_Orders': 'm8gnl88wrij90wp', 
        'Sales_Order_Details': 'm04m8k78x5kmfs4',
        'Customers': 'm34ugizvp0l1ple',
        'Warehouse_locations': 'mqnkms35ablr79s',
        'Zones': 'm3hqjkf0w23r2qi',
        'Product_Units': 'm3gfuojgu8p0e3j',
        'Goods_Receipts': 'm738u03fvi1ywi1',
        'Receipt_Details': 'mpayfc3xf9bypov',
        'Goods_Issues': 'm3iu92n0nbf424n',
        'Issue_Details': 'mu82yf1q7qsfrjb',
        'QC_Requests': 'mbf6ppmcofryvi2',
        'Inventory_Checks': 'm7mfarcw6xfiz21',
        'Check_Details': 'mruch8gn79nob65',
        'Recalls': 'm5o3p7ydo7wwivl',
        'Recall_Details': 'mgfgfchxm9hiq0d',
        'Roles': 'mi8mcdqfs5tlj6c',
        'Permissions': 'm88v50e5zk1u3kq'
    }
};

async function check() {
    console.log('--- DEBUGGING NOCO SYNC (CORRECT IDS) ---');
    const entries = Object.entries(NOCO_CONFIG.TABLES);
    for (const [name, tid] of entries) {
        const options = {
            hostname: NOCO_CONFIG.BASE_URL,
            path: `/api/v2/tables/${tid}/records?limit=1`,
            method: 'GET',
            headers: { 'xc-token': NOCO_CONFIG.API_TOKEN }
        };

        const result = await new Promise((resolve) => {
            const req = http.request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => { data += chunk; });
                res.on('end', () => {
                    if (res.statusCode === 200) {
                        try {
                            const json = JSON.parse(data);
                            resolve({ status: 200, count: json.pageInfo?.totalRows ?? (Array.isArray(json.list) ? json.list.length : 0) });
                        } catch (e) {
                            resolve({ status: 200, error: 'JSON Parse Error' });
                        }
                    } else {
                        resolve({ status: res.statusCode, error: data });
                    }
                });
            });
            req.on('error', (e) => { resolve({ error: e.message }); });
            req.end();
        });
        
        console.log(`${name.padEnd(25)} | ${tid} | Status: ${result.status || 'ERR'} | Count: ${result.count ?? 'N/A'}`);
        if (result.error && result.status !== 200) {
            console.log(`  -> Error: ${result.error.slice(0, 100)}...`);
        }
    }
}

check();
