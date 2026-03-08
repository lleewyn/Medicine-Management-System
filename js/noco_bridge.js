/**
 * PHARMA WMS - NOCODB BRIDGE
 * Centralized API adapter for NocoDB
 */

const NOCO_CONFIG = {
    BASE_URL: 'https://nocodb.data4life.top',
    API_TOKEN: 'CbFCU2G7OdsOVCHr4k315N0J7dQ5MzjJSOVSSU7x',
    
    // Mapping bảng trong App sang Table ID thực tế của NocoDB (m...)
    TABLE_IDS: {
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
    },

    // Mapping sang View ID (vw...) để lấy dữ liệu đã qua bộ lọc/sắp xếp
    VIEW_IDS: {
        'Product_Units': 'vwjqh18w6jbmkzo1',
        'Suppliers': 'vwmuk4zqhe2tnpe4',
        'Customers': 'vwm9b8070hdof46p',
        'Warehouse_locations': 'vwd4obvm7zt3z37n',
        'Zones': 'vw008bq6vygqj64n',
        'Users': 'vwgncwtrok7r3ffo',
        'Purchase_Orders': 'vw06mn9e12f6iy1v',
        'Purchase_Order_Details': 'vwsoegrym6c8lthk',
        'Sales_Orders': 'vwjhg542sx50p0se',
        'Sales_Order_Details': 'vw4f6ee8d5f6ej5j',
        'Goods_Receipts': 'vwi9z24chzfjo40q',
        'Receipt_Details': 'vwqrdbm7oressd92',
        'Goods_Issues': 'vwkiyg8dqaqb799d',
        'Issue_Details': 'vwgs3pjwq55k3523',
        'QC_Requests': 'vw4sovj7o92p7adp',
        'Inventory_Checks': 'vwlwgkevgjffeuce',
        'Check_Details': 'vwtbg0nz1ccke905',
        'Recalls': 'vw6v2fl490qpomwh',
        'Recall_Details': 'vw5smkgioejwlkzy',
        'Roles': 'vw1ft00hw0pu45y5',
        'Permissions': 'vwxigsv8ai9roqnt'
    }
};

const NocoBridge = {
    API_TOKEN: NOCO_CONFIG.API_TOKEN,
    _getTableId(tableName) {
        return NOCO_CONFIG.TABLE_IDS[tableName] || tableName;
    },
    _getViewId(tableName) {
        return NOCO_CONFIG.VIEW_IDS[tableName] || null;
    },

    async fetchTable(tableName, params = {}) {
        if (!NOCO_CONFIG.API_TOKEN || NOCO_CONFIG.API_TOKEN === 'YOUR_API_TOKEN_HERE') {
            console.warn(`NocoBridge: API token chưa cấu hình cho ${tableName}`);
            return [];
        }
        
        const tableId = this._getTableId(tableName);
        if (!tableId) return [];

        // Tự động gán viewId nếu có cấu hình
        const viewId = this._getViewId(tableName);
        if (viewId && !params.viewId) {
            params.viewId = viewId;
        }

        if (!params.limit) params.limit = 500;
        if (typeof params.offset === 'undefined') params.offset = 0;

        const query = new URLSearchParams(params).toString();
        // API v2 endpoint
        const url = `${NOCO_CONFIG.BASE_URL}/api/v2/tables/${tableId}/records?${query}`;
        console.log(`NocoBridge: Fetching ${tableName} from ${url}`);
        
        try {
            const response = await fetch(url, {
                headers: {
                    'xc-token': NOCO_CONFIG.API_TOKEN,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`NocoDB Error (${response.status}): ${errorText}`);
                // alert(`Lỗi khi tải bảng ${tableName}: ${response.status} - ${errorText}`);
                throw new Error(`NocoDB Error: ${response.statusText}`);
            }
            const data = await response.json();
            const list = data.list || data;
            console.log(`NocoBridge: ${tableName} loaded, found ${Array.isArray(list) ? list.length : 'non-array'} items`);
            return list;
        } catch (error) {
            console.error(`Error fetching ${tableName}:`, error);
            // alert(`Cảnh báo: Không thể tải dữ liệu bảng ${tableName}. Vui lòng kiểm tra Console (F12).`);
            throw error;
        }
    },

    async createRow(tableName, data) {
        if (!NOCO_CONFIG.API_TOKEN || NOCO_CONFIG.API_TOKEN === 'YOUR_API_TOKEN_HERE') return null;
        
        const tableId = this._getTableId(tableName);
        if (!tableId) return null;

        const url = `${NOCO_CONFIG.BASE_URL}/api/v2/tables/${tableId}/records`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'xc-token': NOCO_CONFIG.API_TOKEN,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error(`NocoDB Error: ${response.statusText}`);
            return await response.json();
        } catch (error) {
            console.error(`Error creating in ${tableName}:`, error);
            throw error;
        }
    },

    async updateRow(tableName, id, data) {
        if (!NOCO_CONFIG.API_TOKEN || NOCO_CONFIG.API_TOKEN === 'YOUR_API_TOKEN_HERE') return null;
        
        const tableId = this._getTableId(tableName);
        if (!tableId) return null;

        const url = `${NOCO_CONFIG.BASE_URL}/api/v2/tables/${tableId}/records`;
        try {
            // NocoDB v2 PATCH expects id inside payload body
            const payload = { Id: id, ...data };

            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'xc-token': NOCO_CONFIG.API_TOKEN,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error(`NocoDB Error: ${response.statusText}`);
            return await response.json();
        } catch (error) {
            console.error(`Error updating ${tableName} ${id}:`, error);
            throw error;
        }
    } // Ensure this brace closes the updateRow function
}; // Ensure this brace closes the NocoBridge object

window.NocoBridge = NocoBridge;
