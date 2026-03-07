/**
 * Data Mapper / Translation Layer
 * Transforms NocoDB schema fields into UI-friendly fields
 */

const NocoMappers = {
    /**
     * Helper to extract a string value from NocoDB fields (handles Links/Lookups which come as objects/arrays)
     */
    _flatten(field, preferredKey = null) {
        if (field === null || typeof field === 'undefined') return '';
        if (typeof field === 'string' || typeof field === 'number') return field;
        if (Array.isArray(field)) return this._flatten(field[0], preferredKey);
        if (typeof field === 'object') {
            if (preferredKey && field[preferredKey]) return field[preferredKey];
            // Prioritize Display Names over IDs
            return field.CategoryName || field.SupplierName || field.ProductName || field.FullName || field.Name || 
                   field.CategoryID || field.BatchID || field.SupplierID || field.ProductID || Object.values(field)[0];
        }
        return String(field);
    },

    /**
     * Translates a NocoDB Batch record to a UI Batch object
     * Based on actual DB Schema: BatchID, ProductID, SupplierID, Batchcode, IsConsignment, MfgDate, ExpDate, ImportPrice, BatchStatus
     */
    toUIBatch(nocoBatch) {
        const flattened = {
            ...nocoBatch,
            BatchID: this._flatten(nocoBatch.BatchID),
            ProductID: this._flatten(nocoBatch.ProductID),
            SupplierID: this._flatten(nocoBatch.SupplierID),
            Batchcode: this._flatten(nocoBatch.Batchcode),
            BatchStatus: String(this._flatten(nocoBatch.BatchStatus) || 'RELEASED').trim().toUpperCase(),
            LocationID: this._flatten(nocoBatch.LocationID)
        };
        return {
            ...flattened,
            id: flattened.BatchID,
            Quantity: nocoBatch.Quantity || nocoBatch.quantity || 0,
            qty: nocoBatch.Quantity || nocoBatch.quantity || 0,
        };
    },

    /**
     * Translates a NocoDB Product record to a UI Product object
     * Based on actual NocoDB columns: ProductID, ProductName, CategoryID, ActiveIngredient, StorageCondition, IsControlDrug, Description
     */
    toUIProduct(nocoProduct) {
        return {
            ...nocoProduct,
            ProductID: this._flatten(nocoProduct.ProductID),
            ProductName: this._flatten(nocoProduct.ProductName),
            CategoryID: this._flatten(nocoProduct.CategoryID),
            unit: this._flatten(nocoProduct.UnitName) || 'Hộp', 
            price: nocoProduct.Price || 50000 
        };
    }
};

if (typeof module !== 'undefined') {
    module.exports = NocoMappers;
} else {
    window.NocoMappers = NocoMappers;
}
