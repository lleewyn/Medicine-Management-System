/**
 * PHARMA WMS - NOCODB BRIDGE
 * Centralized API adapter for NocoDB
 */

const NOCO_CONFIG = {
    BASE_URL: 'https://nocodb.data4life.top',
    API_TOKEN: 'CbFCU2G7OdsOVCHr4k315N0J7dQ5MzjJSOVSSU7x',
    
    // Mapping bảng trong App sang Table ID thực tế của NocoDB
    TABLE_IDS: {
        'Category': 'ms16b7993d23ocf',
        'Products': 'm4cznh4wdhp1pgy',
        'Suppliers': 'mqx5ocahwipcpsf', 
        'Batches': 'm8r83f9zdxzz56y', 
        'Inventory': 'mh3qhve190b9hw0',
        'Purchase_Orders': '',
        'Sales_Orders': '',
        'Users': '',
        'Deliveries': '',
        'QA_History': ''
    }
};

const NocoBridge = {
    API_TOKEN: NOCO_CONFIG.API_TOKEN,
    _getTableId(tableName) {
        return NOCO_CONFIG.TABLE_IDS[tableName] || tableName;
    },

    async fetchTable(tableName, params = {}) {
        if (!NOCO_CONFIG.API_TOKEN || NOCO_CONFIG.API_TOKEN === 'YOUR_API_TOKEN_HERE') {
            console.warn(`NocoBridge: API token chưa cấu hình cho ${tableName}`);
            return [];
        }
        
        const tableId = this._getTableId(tableName);
        if (!tableId) return [];

        if (!params.limit) params.limit = 50;
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
