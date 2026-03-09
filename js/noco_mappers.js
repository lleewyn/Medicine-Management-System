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
            // Prioritize Display Names (Product, Supplier, Customer, Location) over everything else
            return field.ProductName || field.SupplierName || field.CustomerName || field.LocationName || field.FullName || field.Name || 
                   field.CategoryName || field.CategoryID || field.BatchID || field.SupplierID || field.ProductID || field.CustomerID || 
                   field.LocationID || field.PO_ID || field.SO_ID || field.DetailID || Object.values(field)[0];
        }
        return String(field);
    },

    /**
     * Translates a NocoDB Batch record to a UI Batch object
     * Based on actual DB Schema: BatchID, ProductID, SupplierID, Batchcode, IsConsignment, MfgDate, ExpDate, ImportPrice, BatchStatus
     */
    toUIBatch(nocoBatch) {
        const rawStatus = String(this._flatten(nocoBatch.BatchStatus) || 'Đã duyệt').trim().toUpperCase();
        
        // Map status names (VN -> EN)
        const statusMap = {
            'ĐÃ DUYỆT': 'RELEASED',
            'SẴN SÀNG': 'RELEASED',
            'AVAILABLE': 'RELEASED',
            'RELEASED': 'RELEASED',
            'PENDING': 'QUARANTINE',
            'CHỜ DUYỆT': 'QUARANTINE',
            'AWAITING_APPROVAL': 'QUARANTINE',
            'ĐANG CHỜ XỬ LÝ': 'QUARANTINE',
            'QUARANTINE': 'QUARANTINE',
            'BIỆT TRỮ': 'QUARANTINE',
            'BIET TRU': 'QUARANTINE',
            'biệt trữ': 'QUARANTINE',
            'PENDING_PUTAWAY': 'PENDING_PUTAWAY',
            'CHỜ CẤT HÀNG': 'PENDING_PUTAWAY',
            'ĐANG KIỂM NGHIỆM': 'QUARANTINE',
            'QC_PENDING': 'QC_PENDING',
            'CHỜ QA DUYỆT': 'QC_PENDING',
            'ĐÃ CÓ KẾT QUẢ QC': 'QC_PENDING',
            'PARTIAL': 'PARTIAL',
            'COMPLETED': 'COMPLETED',
            'CANCELLED': 'CANCELLED',
            'ĐÃ HỦY': 'CANCELLED'
        };

        const flattened = {
            ...nocoBatch,
            BatchID: this._flatten(nocoBatch.BatchID),
            ProductID: this._flatten(nocoBatch.ProductID),
            SupplierID: this._flatten(nocoBatch.SupplierID),
            Batchcode: this._flatten(nocoBatch.Batchcode),
            BatchStatus: statusMap[rawStatus] || rawStatus,
            LocationID: nocoBatch.Warehouse_Locations ? this._flatten(nocoBatch.Warehouse_Locations, 'LocationID') : 
                       (this._flatten(nocoBatch.LocationID) || 'Chưa gán')
        };
        return {
            ...flattened,
            nocoId: nocoBatch.Id || nocoBatch.id, // Keep original NocoDB Internal ID
            id: flattened.BatchID, // UI uses human BatchID
            Quantity: nocoBatch.Quantity || nocoBatch.quantity || 0,
            qty: nocoBatch.Quantity || nocoBatch.quantity || 0,
        };
    },

    /**
     * Map UI Status back to NocoDB Status Label
     */
    fromUIStatus(uiStatus) {
        const reverseMap = {
            'RELEASED': 'Đã duyệt',
            'QUARANTINE': 'Biệt trữ',
            'QC_PENDING': 'Chờ QA duyệt',
            'PENDING_PUTAWAY': 'Chờ cất hàng',
            'LOCKED': 'Đã khóa',
            'DESTROYED': 'Đã tiêu hủy',
            'CANCELLED': 'Đã hủy',
            'COMPLETED': 'Hoàn tất'
        };
        return reverseMap[uiStatus] || uiStatus;
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
            BaseUnit: this._flatten(nocoProduct.UnitName) || 'Hộp',
            UnitName: this._flatten(nocoProduct.UnitName) || 'Hộp',
            ImportPrice: nocoProduct.UnitPrice || nocoProduct.Price || 50000,
            UnitPrice: nocoProduct.UnitPrice || nocoProduct.Price || 50000,
            StorageCondition: nocoProduct.StorageCondition || 'KHO_THUONG'
        };
    },

    /**
     * Map Users and Roles
     */
    toUIUser(nocoUser) {
        const roleMapByCode = {
            'ROLE-01': 'SYSTEM_ADMIN',
            'ROLE-02': 'WAREHOUSE_MANAGER',
            'ROLE-03': 'WAREHOUSE_STAFF',
            'ROLE-04': 'DIRECTOR',
            'ROLE-05': 'DRIVER',
            'ROLE-06': 'SALES_STAFF',
            'ROLE-07': 'PROCUREMENT_STAFF',
            'ROLE-08': 'QA_PHARMACIST',
            'ROLE-09': 'QC_SPECIALIST',
            'ROLE-10': 'ACCOUNTANT'
        };

        let roleCode = 'ROLE-03';
        if (nocoUser.RoleID) {
            if (typeof nocoUser.RoleID === 'object') {
                roleCode = nocoUser.RoleID.RoleID || nocoUser.RoleID.id_code || 'ROLE-03';
            } else {
                roleCode = nocoUser.RoleID;
            }
        }

        return {
            ...nocoUser,
            UserID: this._flatten(nocoUser.UserID) || nocoUser.Id,
            FullName: this._flatten(nocoUser.FullName),
            username: (this._flatten(nocoUser.Email) || '').split('@')[0] || `user${nocoUser.Id}`,
            email: this._flatten(nocoUser.Email),
            role: roleMapByCode[roleCode] || 'WAREHOUSE_STAFF',
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(this._flatten(nocoUser.FullName) || 'U')}&background=7C3AED&color=fff`
        };
    },

    /**
     * Map Purchase Orders
     */
    toUIPO(nocoPO) {
        const supplier = this._flatten(nocoPO.SupplierID);
        const rawStatus = String(nocoPO.Status || '').trim();
        const statusMap = { 
            'chờ duyệt': 'AWAITING_APPROVAL',
            'đã duyệt': 'PENDING',
            'chờ nhận': 'PENDING',
            'đang thực hiện': 'PARTIAL',
            'nhập một phần': 'PARTIAL',
            'hoàn tất': 'COMPLETED',
            'đã hoàn tất': 'COMPLETED',
            'hoàn thành': 'COMPLETED',
            'đã hoàn thành': 'COMPLETED',
            'biệt trữ': 'QUARANTINE',
            'biệt trữ (quarantine)': 'QUARANTINE',
            'biet tru': 'QUARANTINE',
            'chờ qa duyệt': 'QUARANTINE',
            'đã hủy': 'CANCELLED'
        };
        const mappedStatus = statusMap[rawStatus.toLowerCase()] || rawStatus.toUpperCase();

        return {
            ...nocoPO,
            PO_ID: this._flatten(nocoPO.PO_ID),
            SupplierID: supplier,
            supplierCode: supplier.split('-')[1] || supplier.substring(0, 2).toUpperCase(),
            supplierColor: 'blue',
            expectedDate: this._flatten(nocoPO.CreatedDate) || '',
            Status: mappedStatus,
            total: 0,
            received: parseFloat(nocoPO.ReceivedQty || nocoPO.received || 0),
            totalValue: 0
        };
    },

    /**
     * Map Sales Orders
     */
    toUISO(nocoSO) {
        const soId = this._flatten(nocoSO.SO_ID);
        const custName = this._flatten(nocoSO.CustomerID);
        const rawStatus = String(nocoSO.Status || '').trim();
        const statusMap = {
            'Đã duyệt': 'PICKING',
            'Mới': 'PICKING',
            'Đang lấy hàng': 'PICKING',
            'Đang soạn hàng': 'IN_PROGRESS',
            'Đang đóng gói': 'PACKING',
            'Chờ phê duyệt': 'PACKING',
            'Đang giao hàng': 'DELIVERING',
            'Đã hoàn thành': 'COMPLETED',
            'Hoàn thành': 'COMPLETED',
            'Đã hủy': 'CANCELLED',
            'Đang chờ xử lý': 'PENDING'
        };
        const mappedStatus = statusMap[rawStatus] || statusMap[rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1)] || statusMap[rawStatus.toLowerCase()] || rawStatus.toUpperCase();

        let priority = nocoSO.Priority;
        if (!priority) {
            // Fake priority if missing
            priority = (soId.includes('001') || soId.includes('002') || soId.includes('005')) ? 'URGENT' : 'NORMAL';
        }

        let orderDate = this._flatten(nocoSO.OrderDate) || new Date().toISOString().split('T')[0];
        let deadline = orderDate;
        try {
            // Add 1 or 2 days for deadline
            const d = new Date(orderDate);
            d.setDate(d.getDate() + (priority === 'URGENT' ? 1 : 2));
            deadline = d.toISOString().split('T')[0];
        } catch(e) {}

        return {
            ...nocoSO,
            SO_ID: soId,
            CustomerID: custName,
            OrderDate: orderDate,
            deadline: deadline,
            DeliveryAddress: this._flatten(nocoSO.DeliveryAddress),
            ContactPhone: this._flatten(nocoSO.ContactPhone),
            Status: mappedStatus,
            priority: priority,
            region: this._flatten(nocoSO.DeliveryAddress).split(',').pop().trim(),
            totalValue: 0,
            itemsCount: 0
        };
    },

    /**
     * Map Goods Receipts
     */
    toUIGoodsReceipt(nocoGR) {
        return {
            ...nocoGR,
            ReceiptID: this._flatten(nocoGR.ReceiptID),
            ReceiptDate: this._flatten(nocoGR.ReceiptDate),
            PO_ID: this._flatten(nocoGR.PO_ID),
            status: 'COMPLETED'
        };
    },

    /**
     * Map Goods Issues
     */
    toUIGoodsIssue(nocoGI) {
        return {
            ...nocoGI,
            IssueID: this._flatten(nocoGI.IssueID),
            IssueDate: this._flatten(nocoGI.IssueDate),
            SO_ID: this._flatten(nocoGI.SO_ID),
            status: 'COMPLETED'
        };
    },

    /**
     * Map Customers
     */
    toUICustomer(nocoCust) {
        return {
            ...nocoCust,
            id: this._flatten(nocoCust.CustomerID),
            name: this._flatten(nocoCust.CustomerName),
            taxCode: this._flatten(nocoCust.TaxCode),
            status: this._flatten(nocoCust.Status)
        };
    },

    /**
     * Map Suppliers
     */
    toUISupplier(nocoSupp) {
        return {
            ...nocoSupp,
            id: this._flatten(nocoSupp.SupplierID),
            name: this._flatten(nocoSupp.SupplierName),
            type: this._flatten(nocoSupp.SupplierType)
        };
    }
};

if (typeof module !== 'undefined') {
    module.exports = NocoMappers;
} else {
    window.NocoMappers = NocoMappers;
}
