
const http = require('https');

const NOCO_CONFIG = {
    BASE_URL: 'nocodb.data4life.top',
    API_TOKEN: 'CbFCU2G7OdsOVCHr4k315N0J7dQ5MzjJSOVSSU7x',
    TABLES: {
        'Products': 'm4cznh4wdhp1pgy',
        'Batches': 'mm9x5j5h5qlyh9s',
        'Purchase_Orders': 'm5u0dkeh3cx11zh',
        'Sales_Orders': 'm8gnl88wrij90wp',
        'Users': 'mm1izhsiixh0ix2',
        'Purchase_Order_Details': 'miyern110bb8w23',
        'Sales_Order_Details': 'mryhnc6gn7qhlls'
    }
};

async function check() {
    console.log('--- DEBUGGING NOCO SYNC (HTTPS) ---');
    for (const [name, tid] of Object.entries(NOCO_CONFIG.TABLES)) {
        const options = {
            hostname: NOCO_CONFIG.BASE_URL,
            path: `/api/v2/tables/${tid}/records?limit=100`,
            method: 'GET',
            headers: { 'xc-token': NOCO_CONFIG.API_TOKEN }
        };

        const result = await new Promise((resolve) => {
            const req = http.request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => { data += chunk; });
                res.on('end', () => {
                    try {
                        const json = JSON.parse(data);
                        const list = json.list || json;
                        resolve({ status: res.statusCode, count: Array.isArray(list) ? list.length : 'NOT ARRAY' });
                    } catch (e) {
                        resolve({ status: res.statusCode, error: 'JSON PARSE ERROR' });
                    }
                });
            });
            req.on('error', (e) => { resolve({ error: e.message }); });
            req.end();
        });
        console.log(`Table: ${name.padEnd(25)} | TID: ${tid} | Status: ${result.status || 'ERR'} | Count: ${result.count || 'ERR'}`);
        if (result.error) console.log('  -> Details:', result.error);
    }
}

check();
