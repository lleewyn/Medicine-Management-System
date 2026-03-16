# System Class Diagram: Methods Refinement

Dưới đây là bảng thông tin các Class cho ứng dụng **PharmaWMS** (Healthcare Warehouse Management System), với cột **Methods** đã được chuẩn hóa để phản ánh đúng logic nghiệp vụ của một hệ thống quản lý kho dược chuẩn GSP.

| STT | Class                            | Attributes                                                                                           | Methods                                                                                                 |
| :-- | :------------------------------- | :--------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------ |
| 1   | **Products**               | ProductID, ProductName, ActiveIngredient, StorageCondition, CategoryID, IsControlDrug, Description   | `getTotalInventory()`, `getBatchesByExpiry()`, `validateStorageCondition()`, `getStockAlerts()` |
| 2   | **Product_Units**          | P_UnitID, ProductID, UnitName, ConversionValue, Barcode                                              | `convertToBase(quantity)`, `getConversionDisplay()`, `syncBarcode()`                              |
| 3   | **Categories**             | CategoryID, CategoryName, Description                                                                | `getProductCount()`, `getCategoryStatistics()`, `listProductsByCategory()`                        |
| 4   | **Suppliers**              | SupplierID, SupplierName, SupplierType, TaxCode, LicenseNumber, Status                               | `checkLicenseValidity()`, `getPerformanceRating()`, `listAssociatedProducts()`                    |
| 5   | **Customers**              | CustomerID, CustomerName, TaxCode, LicenseNumber, Status                                             | `getDebtStatus()`, `getPurchaseHistory()`, `validateCompliance()`                                 |
| 6   | **Warehouse_Locations**    | LocationID, ZoneID, IsLocked                                                                         | `checkAvailability()`, `suggestOptimizedLocation()`, `lockForMaintenance()`                       |
| 7   | **Zones**                  | ZoneID, ZoneName, ZoneType, TemperatureType, ZoneDescription                                         | `getTemperatureSummary()`, `calculateCapacityStatus()`, `listAllLocations()`                      |
| 8   | **Batches**                | BatchID, ProductID, SupplierID, Batchcode, IsConsignment, MfgDate, ExpDate, ImportPrice, BatchStatus | `isExpired()`, `getDaysToExpiry()`, `updateQCStatus()`, `calculateInventoryValue()`             |
| 9   | **Inventory**              | InventoryID, BatchID, LocationID, Quantity, ReservedQty                                              | `reserveStock(qty)`, `releaseStock(qty)`, `transferLocation(newLoc)`, `adjustStock(qty)`        |
| 10  | **Purchase_Orders**        | PO_ID, SupplierID, UserID, CreatedDate, Status                                                       | `calculateGrandTotal()`, `validateWithSupplier()`, `autoGenerateReceipt()`, `cancelPO()`        |
| 11  | **Purchase_Order_Details** | PODetailID, PO_ID, ProductID, OrderedQty, UnitPrice                                                  | `getLineSubtotal()`, `trackReceivedQuantity()`, `checkLeadTime()`                                 |
| 12  | **Goods_Receipts**         | ReceiptID, PO_ID, UserID, ReceiptDate, Description                                                   | `verifyAgainstPO()`, `generateBatchLabels()`, `commitToInventory()`                               |
| 13  | **Receipt_Details**        | DetailID, ReceiptID, BatchID, ActualQty, UnitPrice                                                   | `compareActualVsOrdered()`, `assignBatchID()`, `calculateTotalValue()`                            |
| 14  | **Sales_Orders**           | SO_ID, CustomerID, UserID, OrderDate, DeliveryAddress, ContactPhone, Status                          | `verifyPaymentStatus()`, `calculateTax()`, `checkInventoryLink()`, `generateInvoice()`          |
| 15  | **Sales_Order_Details**    | SODetailID, SO_ID, ProductID, OrderedQty, UnitPrice                                                  | `getLineProfitMargin()`, `checkPromotionEligibility()`, `reserveInventory()`                      |
| 16  | **Goods_Issues**           | IssueID, SO_ID, UserID, IssueDate                                                                    | `optimizePickingPath()`, `confirmDispatch()`, `generateDeliveryNote()`                            |
| 17  | **Issue_Details**          | DetailID, IssueID, BatchID, ShippedQty                                                               | `selectBatchFEFO()`, `verifyPickedQuantity()`, `suggestNextLocation()`                            |
| 18  | **QC_Requests**            | QC_ID, BatchID, QC_Date, Result, UserID                                                              | `submitTestingResult()`, `generateCertOfAnalysis()`, `quarantineBatch()`, `approveRelease()`    |
| 19  | **Inventory_Checks**       | CheckID, UserID, CheckDate, Status                                                                   | `snapshotSystemQty()`, `identifyDiscrepancies()`, `postAdjustments()`                             |
| 20  | **Check_Details**          | DetailID, CheckID, BatchID, SystemQty, ActualQty, Reason, QualityStatus                              | `calculateValueVariance()`, `logAdjustmentReason()`, `updateQualityStatus()`                      |
| 21  | **Recalls**                | RecallID, BatchID, StartDate, Status                                                                 | `traceAffectedBatches()`, `getImpactedCustomers()`, `calculateLossEstimate()`, `closeRecall()`  |
| 22  | **Recall_Details**         | DetailID, RecallID, CustomerID, ExpectedQty, ActualReturnedQty, ReturnStatus, Notes                  | `trackReturnProgress()`, `verifyDisposalStatus()`, `recordRecallLog()`                            |
| 23  | **Users**                  | UserID, FullName, Email, PasswordHash, RoleID, Department, IsActive                                  | `authenticate(password)`, `refreshSession()`, `hasPermission(code)`, `getAssignedRole()`        |
| 24  | **Roles**                  | RoleID, RoleName                                                                                     | `getAttachedPermissions()`, `assignUserToRole()`, `revokeUserFromRole()`, `updateRoleConfig()`  |
| 25  | **Permissions**            | PermissionID, PermissionCode, Description                                                            | `getAccessDescription()`, `listRolesWithThisPermission()`, `validatePermissionCode()`             |
| 26  | **Role_Permissions**       | RoleID, PermissionID                                                                                 | `togglePermissionLink()`, `checkInheritance()`, `getActivationStatus()`                           |

---

### Ghi chú về logic Methods:

1. **FEFO (First Expired, First Out):** Áp dụng trong `Issue_Details` để ưu tiên xuất các lô hàng gần hết hạn trước.
2. **GSP Compliance:** Các method như `validateStorageCondition` (Products) và `quarantineBatch` (QC_Requests) đảm bảo thuốc được lưu trữ đúng điều kiện và kiểm soát chất lượng chặt chẽ.
3. **Traceability:** Các method trong `Recalls` hỗ trợ truy xuất nguồn gốc từ lô sản xuất đến tận tay khách hàng khi có sự cố.
4. **Inventory Reservation:** Quản lý hàng "đã đặt" (`reserveStock`) để tránh tình trạng bán cùng một lô hàng cho nhiều đơn.
