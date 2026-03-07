/**
 * Data Mapper / Translation Layer
 * Transforms NocoDB schema fields into UI-friendly fields
 */

const NocoMappers = {
    /**
     * Translates a NocoDB Batch record to a UI Batch object
     * Database: BatchID, ProductID, Batchcode, ExpDate, BatchStatus
     * UI: id, productId, lotNumber, expiry, status
     */
    toUIBatch(nocoBatch) {
        return {
            id: nocoBatch.BatchID,
            productId: nocoBatch.ProductID,
            lotNumber: nocoBatch.Batchcode,
            expiry: nocoBatch.ExpDate,
            status: nocoBatch.BatchStatus,
            qty: nocoBatch.Quantity || 0, // From Inventory table join
            location: nocoBatch.LocationID
        };
    },

    /**
     * Translates a NocoDB Product record to a UI Product object
     */
    toUIProduct(nocoProduct) {
        return {
            id: nocoProduct.ProductID,
            name: nocoProduct.ProductName,
            category: nocoProduct.CategoryID,
            storage: nocoProduct.StorageCondition,
            unit: nocoProduct.UnitName, // From Product_Units join
            price: nocoProduct.Price
        };
    }
};

if (typeof module !== 'undefined') {
    module.exports = NocoMappers;
} else {
    window.NocoMappers = NocoMappers;
}
