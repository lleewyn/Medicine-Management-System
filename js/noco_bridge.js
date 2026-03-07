/**
 * PHARMA WMS - NOCODB BRIDGE
 * Centralized API adapter for NocoDB
 */

const NOCO_CONFIG = {
    BASE_URL: 'https://app.nocodb.com/api/v1/db/data/noco', // Update with real project ID
    PROJECT_ID: 'p_pharma', // Update with real project ID
    API_TOKEN: 'YOUR_API_TOKEN_HERE' // User will need to provide this
};

const NocoBridge = {
    async fetchTable(tableName, params = {}) {
        const query = new URLSearchParams(params).toString();
        const url = `${NOCO_CONFIG.BASE_URL}/${NOCO_CONFIG.PROJECT_ID}/${tableName}?${query}`;
        
        try {
            const response = await fetch(url, {
                headers: {
                    'xc-token': NOCO_CONFIG.API_TOKEN,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) throw new Error(`NocoDB Error: ${response.statusText}`);
            const data = await response.json();
            return data.list || data;
        } catch (error) {
            console.error(`Error fetching ${tableName}:`, error);
            throw error;
        }
    },

    async createRow(tableName, data) {
        const url = `${NOCO_CONFIG.BASE_URL}/${NOCO_CONFIG.PROJECT_ID}/${tableName}`;
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
        const url = `${NOCO_CONFIG.BASE_URL}/${NOCO_CONFIG.PROJECT_ID}/${tableName}/${id}`;
        try {
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'xc-token': NOCO_CONFIG.API_TOKEN,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error(`NocoDB Error: ${response.statusText}`);
            return await response.json();
        } catch (error) {
            console.error(`Error updating ${tableName} ${id}:`, error);
            throw error;
        }
    }
};

window.NocoBridge = NocoBridge;
