/**
 * NocoDB API Bridge
 * This module handles all communication with the NocoDB backend.
 */

const NOCO_URL = 'http://localhost:8080'; // Replace with your NocoDB URL
const API_TOKEN = 'YOUR_API_TOKEN_HERE'; // Replace with your API Token
const PROJECT_ID = 'YOUR_PROJECT_ID_HERE'; // Replace with your Project ID

class NocoAPI {
    static async fetchTable(tableName, params = {}) {
        const url = new URL(`${NOCO_URL}/api/v1/db/data/noco/${PROJECT_ID}/${tableName}`);
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

        const response = await fetch(url, {
            headers: {
                'xc-token': API_TOKEN,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`NocoDB Error: ${response.statusText}`);
        }
        return await response.json();
    }

    static async createRecord(tableName, data) {
        const response = await fetch(`${NOCO_URL}/api/v1/db/data/noco/${PROJECT_ID}/${tableName}`, {
            method: 'POST',
            headers: {
                'xc-token': API_TOKEN,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`NocoDB Error: ${response.statusText}`);
        }
        return await response.json();
    }

    static async updateRecord(tableName, id, data) {
        const response = await fetch(`${NOCO_URL}/api/v1/db/data/noco/${PROJECT_ID}/${tableName}/${id}`, {
            method: 'PATCH',
            headers: {
                'xc-token': API_TOKEN,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`NocoDB Error: ${response.statusText}`);
        }
        return await response.json();
    }

    // Specific entity helpers
    static async getProducts() {
        return this.fetchTable('Products');
    }

    static async getInventory() {
        return this.fetchTable('Inventory', { nested: 'BatchID,LocationID' });
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined') {
    module.exports = NocoAPI;
} else {
    window.NocoAPI = NocoAPI;
}
