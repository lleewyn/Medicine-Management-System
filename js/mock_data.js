/**
 * PHARMA WMS - MOCK DATA LAYER
 * Phiên bản 2.0 — Đầy đủ 10 roles theo Use Case diagram
 * Thay thế bằng API call thật khi tích hợp NocoDB
 */

// ============================================================
// 1. ĐỊNH NGHĨA ROLE VÀ QUYỀN HẠN (10 roles)
// ============================================================

const ROLES = {

  // ── IT / System Admin ──────────────────────────────────────
  SYSTEM_ADMIN: {
    label: 'IT / Quản trị hệ thống',
    color: '#7C3AED',
    icon: 'manage_accounts',
    pages: ['dashboard', 'inventory-management', 'inbound', 'outbound',
      'qa-dashboard', 'qa-approval', 'qa-pending', 'qa-recall', 'qa-reports',
      'purchase-order', 'sales-order', 'accounting', 'delivery', 'user-management'],
    permissions: ['read_all', 'write_all', 'delete_all', 'approve_qa',
      'approve_director', 'manage_users', 'export_report']
  },

  // ── Thủ kho (Warehouse Manager) ───────────────────────────
  WAREHOUSE_MANAGER: {
    label: 'Thủ kho',
    color: '#1D4ED8',
    icon: 'warehouse',
    pages: ['dashboard', 'inventory-management', 'inbound', 'outbound',
      'qa-reports', 'purchase-order', 'sales-order'],
    permissions: ['read_all', 'write_inventory', 'write_inbound', 'write_outbound',
      'approve_outbound', 'write_orders', 'export_report']
  },

  // ── Nhân viên kho ─────────────────────────────────────────
  WAREHOUSE_STAFF: {
    label: 'Nhân viên kho',
    color: '#EA580C',
    icon: 'person',
    pages: ['inbound', 'outbound', 'inventory-management'],
    permissions: ['read_inventory', 'write_inbound', 'write_outbound', 'update_stock', 'read_po']
  },

  // ── Chuyên viên QC ─────────────────────────────────────────
  QC_SPECIALIST: {
    label: 'Chuyên viên QC',
    color: '#0D9488',
    icon: 'science',
    pages: ['qa-dashboard', 'qa-approval', 'qa-pending', 'qa-reports', 'inventory-management'],
    permissions: ['read_inventory', 'write_qa_result', 'read_qa_report']
  },

  // ── Dược sĩ QA ─────────────────────────────────────────────
  QA_PHARMACIST: {
    label: 'Dược sĩ QA',
    color: '#0891B2',
    icon: 'verified_user',
    pages: ['qa-dashboard', 'qa-approval', 'qa-pending', 'qa-recall', 'qa-reports', 'inventory-management'],
    permissions: ['read_inventory', 'approve_qa', 'quarantine_items',
      'write_qa_report', 'write_recall', 'destroy_batch']
  },

  // ── NV Kinh doanh (Sales) ──────────────────────────────────
  SALES_STAFF: {
    label: 'NV Kinh doanh',
    color: '#D97706',
    icon: 'storefront',
    pages: ['inventory-management', 'sales-order', 'qa-reports'],
    permissions: ['read_inventory', 'write_so', 'read_report']
  },

  // ── NV Thu mua (Procurement) ───────────────────────────────
  PROCUREMENT_STAFF: {
    label: 'NV Thu mua',
    color: '#B45309',
    icon: 'shopping_cart',
    pages: ['inventory-management', 'purchase-order', 'inbound'],
    permissions: ['read_inventory', 'write_po', 'read_po', 'write_supplier_complaint']
  },

  // ── Kế toán kho ────────────────────────────────────────────
  ACCOUNTANT: {
    label: 'Kế toán kho',
    color: '#CA8A04',
    icon: 'account_balance',
    pages: ['accounting', 'qa-reports', 'purchase-order', 'sales-order'],
    permissions: ['read_all', 'write_accounting', 'export_report']
  },

  // ── Ban giám đốc ───────────────────────────────────────────
  DIRECTOR: {
    label: 'Ban giám đốc',
    color: '#DC2626',
    icon: 'supervisor_account',
    pages: ['dashboard', 'qa-reports', 'accounting'],
    permissions: ['read_all', 'approve_director', 'export_report']
  },

  // ── Tài xế ─────────────────────────────────────────────────
  DRIVER: {
    label: 'Tài xế',
    color: '#64748B',
    icon: 'local_shipping',
    pages: ['delivery'],
    permissions: ['confirm_delivery']
  }
};

// ============================================================
// 2. DANH SÁCH NGƯỜI DÙNG GIẢ LẬP (1 user mỗi role)
// ============================================================

const USERS = [
  {
    UserID: 'U001', username: 'admin', password: '123456',
    FullName: 'Admin Pharma', title: 'IT / Quản trị hệ thống',
    role: 'SYSTEM_ADMIN',
    avatar: 'https://ui-avatars.com/api/?name=Admin+Pharma&background=7C3AED&color=fff&size=120'
  },
  {
    UserID: 'U002', username: 'thukho', password: '123456',
    FullName: 'Nguyễn Văn Hùng', title: 'Thủ kho',
    role: 'WAREHOUSE_MANAGER',
    avatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+Hung&background=1D4ED8&color=fff&size=120'
  },
  {
    UserID: 'U003', username: 'nvkho', password: '123456',
    FullName: 'Trần Văn Nam', title: 'Nhân viên kho',
    role: 'WAREHOUSE_STAFF',
    avatar: 'https://ui-avatars.com/api/?name=Tran+Van+Nam&background=EA580C&color=fff&size=120'
  },
  {
    UserID: 'U004', username: 'qcvien', password: '123456',
    FullName: 'Lê Thị Bích Ngọc', title: 'Chuyên viên QC',
    role: 'QC_SPECIALIST',
    avatar: 'https://ui-avatars.com/api/?name=Le+Thi+Bich+Ngoc&background=0D9488&color=fff&size=120'
  },
  {
    UserID: 'U005', username: 'qaduoc', password: '123456',
    FullName: 'DS. Nguyễn Thị Lan', title: 'Dược sĩ QA',
    role: 'QA_PHARMACIST',
    avatar: 'https://ui-avatars.com/api/?name=Nguyen+Thi+Lan&background=0891B2&color=fff&size=120'
  },
  {
    UserID: 'U006', username: 'sales', password: '123456',
    FullName: 'Phạm Quỳnh Anh', title: 'NV Kinh doanh',
    role: 'SALES_STAFF',
    avatar: 'https://ui-avatars.com/api/?name=Pham+Quynh+Anh&background=D97706&color=fff&size=120'
  },
  {
    UserID: 'U007', username: 'mua', password: '123456',
    FullName: 'Vũ Đức Thắng', title: 'NV Thu mua',
    role: 'PROCUREMENT_STAFF',
    avatar: 'https://ui-avatars.com/api/?name=Vu+Duc+Thang&background=B45309&color=fff&size=120'
  },
  {
    UserID: 'U008', username: 'ketoan', password: '123456',
    FullName: 'Trần Thu Hà', title: 'Kế toán kho',
    role: 'ACCOUNTANT',
    avatar: 'https://ui-avatars.com/api/?name=Tran+Thu+Ha&background=CA8A04&color=fff&size=120'
  },
  {
    UserID: 'U009', username: 'giamdoc', password: '123456',
    FullName: 'PGS. TS. Lê Văn A', title: 'Ban Giám đốc',
    role: 'DIRECTOR',
    avatar: 'https://ui-avatars.com/api/?name=Le+Van+A&background=DC2626&color=fff&size=120'
  },
  {
    UserID: 'U010', username: 'taixe', password: '123456',
    FullName: 'Phan Anh Vũ', title: 'Tài xế',
    role: 'DRIVER',
    avatar: 'https://ui-avatars.com/api/?name=Phan+Anh+Vu&background=64748B&color=fff&size=120'
  }
];

// ============================================================
// 3. DỮ LIỆU KHO
// ============================================================

const WAREHOUSES = [
  { id: 'WH-HN', name: 'Kho Miền Bắc (Hà Nội)', capacity: 10000, used: 6500 },
  { id: 'WH-HCM', name: 'Kho Miền Nam (TP.HCM)', capacity: 15000, used: 9200 },
];

const PRODUCTS = [
  { ProductID: 'SKU-PFIZ-01', ProductName: 'Vaccine Pfizer BioNTech', CategoryID: 'ETC', StorageCondition: 'KHO_LANH', BaseUnit: 'Liều', ImportPrice: 320000 },
  { ProductID: 'SKU-HAPA-02', ProductName: 'Hapacol 650mg', CategoryID: 'OTC', StorageCondition: 'KHO_THUONG', BaseUnit: 'Hộp', ImportPrice: 45000 },
  { ProductID: 'SKU-AZIT-03', ProductName: 'Azithromycin 250mg', CategoryID: 'ETC', StorageCondition: 'KHO_THUONG', BaseUnit: 'Hộp', ImportPrice: 85000 },
  { ProductID: 'SKU-VITA-04', ProductName: 'Vitamin C 1000mg', CategoryID: 'OTC', StorageCondition: 'KHO_THUONG', BaseUnit: 'Hộp', ImportPrice: 120000 },
  { ProductID: 'SKU-INSU-05', ProductName: 'Insulin Glargine', CategoryID: 'ETC', StorageCondition: 'KHO_LANH', BaseUnit: 'Lọ', ImportPrice: 750000 },
];

const BATCHES = [
  { BatchID: 'BATCH-001', ProductID: 'SKU-PFIZ-01', Batchcode: 'PF-230401', Quantity: 500, ExpDate: '2025-04-01', BatchStatus: 'RELEASED', LocationID: 'A1-01', warehouseId: 'WH-HN' },
  { BatchID: 'BATCH-002', ProductID: 'SKU-HAPA-02', Batchcode: 'HP-231015', Quantity: 1200, ExpDate: '2025-10-15', BatchStatus: 'RELEASED', LocationID: 'B2-03', warehouseId: 'WH-HN' },
  { BatchID: 'BATCH-003', ProductID: 'SKU-AZIT-03', Batchcode: 'AZ-230820', Quantity: 300, ExpDate: '2024-02-20', BatchStatus: 'QUARANTINE', LocationID: 'Q-01', warehouseId: 'WH-HN' },
  { BatchID: 'BATCH-004', ProductID: 'SKU-INSU-05', Batchcode: 'IN-230905', Quantity: 80, ExpDate: '2024-03-05', BatchStatus: 'QUARANTINE', LocationID: 'Q-02', warehouseId: 'WH-HCM' },
  { BatchID: 'BATCH-005', ProductID: 'SKU-VITA-04', Batchcode: 'VT-231201', Quantity: 2000, ExpDate: '2026-12-01', BatchStatus: 'RELEASED', LocationID: 'C3-05', warehouseId: 'WH-HCM' },
  { BatchID: 'BATCH-006', ProductID: 'SKU-PFIZ-01', Batchcode: 'PF-240112', Quantity: 1500, ExpDate: '2026-01-12', BatchStatus: 'RELEASED', LocationID: 'A1-02', warehouseId: 'WH-HN' },
  { BatchID: 'BATCH-007', ProductID: 'SKU-HAPA-02', Batchcode: 'HP-240220', Quantity: 5000, ExpDate: '2026-02-20', BatchStatus: 'RELEASED', LocationID: 'B2-04', warehouseId: 'WH-HCM' },
  { BatchID: 'BATCH-008', ProductID: 'SKU-AZIT-03', Batchcode: 'AZ-240315', Quantity: 800, ExpDate: '2025-03-15', BatchStatus: 'QUARANTINE', LocationID: 'Q-03', warehouseId: 'WH-HN' },
  { BatchID: 'BATCH-009', ProductID: 'SKU-VITA-04', Batchcode: 'VT-240401', Quantity: 3000, ExpDate: '2027-04-01', BatchStatus: 'RELEASED', LocationID: 'C3-06', warehouseId: 'WH-HCM' },
  { BatchID: 'BATCH-010', ProductID: 'SKU-INSU-05', Batchcode: 'IN-240510', Quantity: 120, ExpDate: '2025-05-10', BatchStatus: 'LOCKED', LocationID: 'L-01', warehouseId: 'WH-HN' },
  { BatchID: 'BATCH-011', ProductID: 'SKU-PFIZ-01', Batchcode: 'PF-240620', Quantity: 200, ExpDate: '2024-12-20', BatchStatus: 'RELEASED', LocationID: 'A1-05', warehouseId: 'WH-HN' },
  { BatchID: 'BATCH-012', ProductID: 'SKU-HAPA-02', Batchcode: 'HP-240715', Quantity: 2500, ExpDate: '2026-07-15', BatchStatus: 'RELEASED', LocationID: 'B2-10', warehouseId: 'WH-HCM' },
  { BatchID: 'BATCH-013', ProductID: 'SKU-AZIT-03', Batchcode: 'AZ-240801', Quantity: 450, ExpDate: '2024-05-01', BatchStatus: 'QUARANTINE', LocationID: 'Q-04', warehouseId: 'WH-HN' },
  { BatchID: 'BATCH-014', ProductID: 'SKU-VITA-04', Batchcode: 'VT-240905', Quantity: 1500, ExpDate: '2027-09-05', BatchStatus: 'RELEASED', LocationID: 'C3-12', warehouseId: 'WH-HCM' },
  { BatchID: 'BATCH-015', ProductID: 'SKU-INSU-05', Batchcode: 'IN-241012', Quantity: 300, ExpDate: '2026-10-12', BatchStatus: 'RELEASED', LocationID: 'A2-01', warehouseId: 'WH-HN' },
  { BatchID: 'BATCH-016', ProductID: 'SKU-PFIZ-01', Batchcode: 'PF-241130', Quantity: 800, ExpDate: '2026-11-30', BatchStatus: 'RELEASED', LocationID: 'A1-08', warehouseId: 'WH-HCM' },
  { BatchID: 'BATCH-017', ProductID: 'SKU-HAPA-02', Batchcode: 'HP-250115', Quantity: 10000, ExpDate: '2027-01-15', BatchStatus: 'RELEASED', LocationID: 'B5-01', warehouseId: 'WH-HN' },
  { BatchID: 'BATCH-018', ProductID: 'SKU-AZIT-03', Batchcode: 'AZ-250228', Quantity: 600, ExpDate: '2026-02-28', BatchStatus: 'RELEASED', LocationID: 'A3-04', warehouseId: 'WH-HCM' },
  { BatchID: 'BATCH-019', ProductID: 'SKU-VITA-04', Batchcode: 'VT-250310', Quantity: 4000, ExpDate: '2028-03-10', BatchStatus: 'RELEASED', LocationID: 'C4-02', warehouseId: 'WH-HN' },
  { BatchID: 'BATCH-020', ProductID: 'SKU-INSU-05', Batchcode: 'IN-250415', Quantity: 250, ExpDate: '2027-04-15', BatchStatus: 'QUARANTINE', LocationID: 'Q-05', warehouseId: 'WH-HCM' },
];

const QA_HISTORY = [
  { Batchcode: 'HP-231015', ProductName: 'Hapacol 650mg', QC_Date: '01/10/2023', UserID: 'DS. Nguyễn Thị Lan', Result: 'ĐẠT', Status: 'RELEASED' },
  { Batchcode: 'VT-231201', ProductName: 'Vitamin C 1000mg', QC_Date: '05/10/2023', UserID: 'Lê Thị Bích Ngọc', Result: 'ĐẠT', Status: 'RELEASED' },
  { Batchcode: 'PX-230901', ProductName: 'Paracetamol 500mg', QC_Date: '08/09/2023', UserID: 'DS. Nguyễn Thị Lan', Result: 'KHÔNG ĐẠT', Status: 'REJECT' },
];

// ============================================================
// 4. PURCHASE ORDERS
// ============================================================

const PURCHASE_ORDERS = [
  {
    PO_ID: 'PO-2023-0891', SupplierID: 'Pfizer Vietnam Ltd.', supplierCode: 'PF', supplierColor: 'blue',
    expectedDate: '25/10/2023', items: 2, received: 7, total: 12, Status: 'PARTIAL', urgency: 'NORMAL',
    itemsDetails: [
      { ProductID: 'SKU-PFIZ-01', OrderedQty: 10 },
      { ProductID: 'SKU-INSU-05', OrderedQty: 2 }
    ]
  },
  {
    PO_ID: 'PO-2023-0892', SupplierID: 'Dược Hậu Giang (DHG)', supplierCode: 'DH', supplierColor: 'green',
    expectedDate: '26/10/2023', items: 1, received: 0, total: 5, Status: 'PENDING', urgency: 'NORMAL',
    itemsDetails: [
      { ProductID: 'SKU-HAPA-02', OrderedQty: 5 }
    ]
  },
  {
    PO_ID: 'PO-2023-0885', SupplierID: 'AstraZeneca VN', supplierCode: 'AZ', supplierColor: 'purple',
    expectedDate: '22/10/2023', items: 1, received: 8, total: 8, Status: 'COMPLETED', urgency: 'NORMAL',
    itemsDetails: [
      { ProductID: 'SKU-AZIT-03', OrderedQty: 8 }
    ]
  },
  {
    PO_ID: 'PO-2023-0880', SupplierID: 'Sanofi-Aventis', supplierCode: 'SN', supplierColor: 'red',
    expectedDate: '20/10/2023', items: 1, received: 0, total: 2, Status: 'CANCELLED', urgency: 'NORMAL',
    itemsDetails: [
      { ProductID: 'SKU-VITA-04', OrderedQty: 2 }
    ]
  },
  {
    PO_ID: 'PO-2023-0901', SupplierID: 'Merck Sharp & Dohme', supplierCode: 'MS', supplierColor: 'teal',
    expectedDate: '01/11/2023', items: 2, received: 0, total: 50, Status: 'PENDING', urgency: 'URGENT',
    itemsDetails: [{ ProductID: 'SKU-INSU-05', OrderedQty: 50 }]
  },
  {
    PO_ID: 'PO-2023-0905', SupplierID: 'GSK Vietnam', supplierCode: 'GS', supplierColor: 'orange',
    expectedDate: '05/11/2023', items: 1, received: 0, total: 200, Status: 'PENDING', urgency: 'NORMAL',
    itemsDetails: [{ ProductID: 'SKU-AZIT-03', OrderedQty: 200 }]
  },
];

// ============================================================
// 5. SALES ORDERS
// ============================================================

const COMPLAINTS = [
  { id: 'CPL-001', PO_ID: 'PO-2023-0882', supplier: 'Pfizer Vietnam Ltd.', type: 'Thiếu hàng (Quantity Shortage)', item: 'Hapacol 650mg', qty: 12, desc: 'Giao thiếu 12 hộp so với hóa đơn', request: 'Đổi hàng mới', date: '15/09/2023', Status: 'Đã xử lý', color: 'green' },
  { id: 'CPL-002', PO_ID: 'PO-2023-0876', supplier: 'Dược Hậu Giang (DHG)', type: 'Lỗi chất lượng / CoA không đạt', item: 'Azithromycin 250mg', qty: 50, desc: 'CoA không khớp với lô hàng nhận', request: 'Hoàn tiền', date: '02/10/2023', Status: 'Đang xử lý', color: 'amber' },
];

const SALES_ORDERS = [
  {
    SO_ID: 'SO-24-001', CustomerID: 'Hệ thống Nhà thuốc Pharmacity', region: 'TP.HCM',
    OrderDate: '08/03/2026', deadline: '09/03/2026 08:00', priority: 'URGENT', Status: 'PICKING', progress: '0/2 SKU', progressPct: 0,
    itemsDetails: [
      { ProductID: 'SKU-PFIZ-01', OrderedQty: 100, UnitPrice: 320000 },
      { ProductID: 'SKU-HAPA-02', OrderedQty: 200, UnitPrice: 45000 }
    ]
  },
  {
    SO_ID: 'SO-24-002', CustomerID: 'Bệnh viện Đa khoa Tâm Anh', region: 'Hà Nội',
    OrderDate: '07/03/2026', deadline: '08/03/2026 10:00', priority: 'URGENT', Status: 'PACKING', progress: '2/3 SKU', progressPct: 66,
    itemsDetails: [
      { ProductID: 'SKU-PFIZ-01', OrderedQty: 50, UnitPrice: 320000 },
      { ProductID: 'SKU-INSU-05', OrderedQty: 30, UnitPrice: 750000 },
      { ProductID: 'SKU-AZIT-03', OrderedQty: 100, UnitPrice: 85000 }
    ]
  },
  {
    SO_ID: 'SO-24-003', CustomerID: 'Chuỗi Nhà thuốc An Khang', region: 'Cần Thơ',
    OrderDate: '07/03/2026', deadline: '10/03/2026 14:00', priority: 'NORMAL', Status: 'PICKING', progress: '0/2 SKU', progressPct: 0,
    itemsDetails: [
      { ProductID: 'SKU-HAPA-02', OrderedQty: 500, UnitPrice: 45000 },
      { ProductID: 'SKU-VITA-04', OrderedQty: 300, UnitPrice: 120000 }
    ]
  },
  {
    SO_ID: 'SO-24-004', CustomerID: 'Nhà thuốc Long Châu #12', region: 'Bình Dương',
    OrderDate: '06/03/2026', deadline: '07/03/2026 15:00', priority: 'NORMAL', Status: 'DELIVERING', progress: '2/2 SKU', progressPct: 100,
    itemsDetails: [
      { ProductID: 'SKU-AZIT-03', OrderedQty: 50, UnitPrice: 85000 },
      { ProductID: 'SKU-VITA-04', OrderedQty: 100, UnitPrice: 120000 }
    ]
  },
  {
    SO_ID: 'SO-24-005', CustomerID: 'Bệnh viện Chợ Rẫy', region: 'TP.HCM',
    OrderDate: '05/03/2026', deadline: '06/03/2026 10:00', priority: 'URGENT', Status: 'DELIVERING', progress: 'Lấy hàng hoàn tất', progressPct: 100,
    itemsDetails: [
      { ProductID: 'SKU-INSU-05', OrderedQty: 20, UnitPrice: 750000 }
    ]
  },
  {
    SO_ID: 'SO-24-006', CustomerID: 'Nhà thuốc An Khang Hà Nội', region: 'Hà Nội',
    OrderDate: '04/03/2026', deadline: '06/03/2026 10:00', priority: 'NORMAL', Status: 'COMPLETED', progress: 'Hoàn thành', progressPct: 100,
    itemsDetails: [
      { ProductID: 'SKU-VITA-04', OrderedQty: 50, UnitPrice: 120000 }
    ]
  },
  {
    SO_ID: 'SO-24-007', CustomerID: 'Phòng khám Đa khoa Thu Cúc', region: 'Hà Nội',
    OrderDate: '02/03/2026', deadline: '04/03/2026 09:00', priority: 'NORMAL', Status: 'COMPLETED', progress: 'Hoàn thành', progressPct: 100,
    itemsDetails: [{ ProductID: 'SKU-HAPA-02', OrderedQty: 100, UnitPrice: 45000 }]
  },
  {
    SO_ID: 'SO-24-008', CustomerID: 'Hệ thống Pharmacity Miền Bắc', region: 'Bắc Ninh',
    OrderDate: '08/03/2026', deadline: '10/03/2026 15:00', priority: 'NORMAL', Status: 'PICKING', progress: '0/2 SKU', progressPct: 0,
    itemsDetails: [
      { ProductID: 'SKU-PFIZ-01', OrderedQty: 500, UnitPrice: 320000 },
      { ProductID: 'SKU-AZIT-03', OrderedQty: 300, UnitPrice: 85000 }
    ]
  },
  {
    SO_ID: 'SO-24-009', CustomerID: 'Bệnh viện Vinmec', region: 'TP.HCM',
    OrderDate: '05/03/2026', deadline: '07/03/2026 10:00', priority: 'URGENT', Status: 'CANCELLED', progress: 'Đã hủy', progressPct: 0,
    itemsDetails: [
      { ProductID: 'SKU-INSU-05', OrderedQty: 100, UnitPrice: 750000 }
    ]
  },
  {
    SO_ID: 'SO-24-010', CustomerID: 'Nhà thuốc Minh Châu', region: 'Đà Nẵng',
    OrderDate: '09/03/2026', deadline: '11/03/2026 12:00', priority: 'NORMAL', Status: 'PENDING', progress: 'Chờ xử lý', progressPct: 0,
    itemsDetails: [
      { ProductID: 'SKU-HAPA-02', OrderedQty: 300, UnitPrice: 45000 },
      { ProductID: 'SKU-VITA-04', OrderedQty: 150, UnitPrice: 120000 }
    ]
  }
];

// ============================================================
// 6. DELIVERY (Tài xế)
// ============================================================

const DELIVERIES = [
  {
    id: 'DEL-001', SO_ID: 'SO-24-004', customer: 'Nhà thuốc Long Châu #12',
    driver: 'Võ Công Danh', address: 'Bình Dương', Status: 'DELIVERING',
    estimatedTime: '16:00 hôm nay'
  },
  {
    id: 'DEL-002', SO_ID: 'SO-24-005', customer: 'Bệnh viện Chợ Rẫy',
    driver: 'Võ Công Danh', address: '201B Nguyễn Chí Thanh, Q5, TP.HCM', Status: 'PENDING',
    estimatedTime: '09:00 ngày mai'
  },
];

// ============================================================
// 7. DASHBOARD STATS
// ============================================================

const DASHBOARD_STATS = {
  totalInventoryValue: '12,482,900,000 VNĐ',
  quarantineBatches: 2,
  nearExpiryBatches: 2,
  pendingPO: PURCHASE_ORDERS.filter(p => p.Status === 'PENDING').length,
  todayInbound: 24,
  todayOutbound: 61,
  temperatureAlerts: [
    { zone: 'Cold Storage Zone A-4', temp: '8.4°C', limit: '2.0°C - 8.0°C', severity: 'URGENT', time: '2 phút trước', sensorId: 'LOG-9921' },
    { zone: 'Vaccine Fridge VF-02', temp: '-12.1°C', limit: '-25°C - -15°C', severity: 'URGENT', time: '14 phút trước', sensorId: 'LOG-4402' },
    { zone: 'Ambient Warehouse North', temp: '24.8°C', limit: '25°C', severity: 'WARNING', time: '1 giờ trước', sensorId: 'LOG-8110' },
  ]
};

// ============================================================
// 8. REACTIVE STATE LAYER (sessionStorage-backed)
// ============================================================

const STATE_KEY = 'pharma_wms_state';

function loadState() {
  try {
    const raw = sessionStorage.getItem(STATE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}

function saveState(state) {
  try { sessionStorage.setItem(STATE_KEY, JSON.stringify(state)); } catch (e) { }
}

function initState() {
  const existing = loadState();
  
  // Create a fresh version for comparison or partial update
  const initial = {
    batches: JSON.parse(JSON.stringify(BATCHES)),
    users: JSON.parse(JSON.stringify(USERS)),
    qaHistory: JSON.parse(JSON.stringify(QA_HISTORY)),
    purchaseOrders: JSON.parse(JSON.stringify(PURCHASE_ORDERS)),
    salesOrders: JSON.parse(JSON.stringify(SALES_ORDERS)),
    deliveries: JSON.parse(JSON.stringify(DELIVERIES)),
    complaints: JSON.parse(JSON.stringify(COMPLAINTS)),
    auditLogs: [
      { id: 1, time: new Date().toLocaleTimeString('vi-VN'), user: 'system', action: 'Hệ thống khởi tạo', detail: 'Cơ sở dữ liệu giả lập đã được thiết lập.', lvl: 'info' }
    ],
    notifications: [],
    approvals: [
      {
        id: 'APV-001', type: 'Xuất kho đặc biệt', Status: 'PENDING', dept: 'Kho + Kinh doanh', urgent: true,
        desc: 'SO-2023-1488 — Xuất 1,200 liều Vaccine Pfizer cho BV Chợ Rẫy. Trị giá: 384,000,000 VNĐ.'
      },
      {
        id: 'APV-002', type: 'Thu hồi lô hàng', Status: 'PENDING', dept: 'QA/QC', urgent: true,
        desc: 'Thu hồi lô AZ-230901 theo Quyết định 45/QĐ-BYT. 200 hộp, đang biệt trữ Q-01.'
      },
      {
        id: 'APV-003', type: 'Điều chỉnh tồn kho', Status: 'PENDING', dept: 'Kho + Kế toán', urgent: false,
        desc: 'Điều chỉnh chênh lệch kiểm kê T10/2023: +3 hộp Hapacol (nhầm lẫn nhập liệu).'
      },
    ],
    inventoryChecks: [
      {
        CheckID: 'SC-202310-01',
        CheckDate: '2023-10-15',
        UserID: 'U001',
        Status: 'COMPLETED',
        items: [
          { BatchID: 1, Batchcode: 'PF-230401', SystemQty: 500, ActualQty: 500 },
          { BatchID: 2, Batchcode: 'HP-231015', SystemQty: 1200, ActualQty: 1210 }
        ]
      }
    ],
    customers: [],
    locations: [],
    zones: [],
    productUnits: [],
    purchaseOrderDetails: [],
    salesOrderDetails: [],
    goodsReceipts: [],
    receiptDetails: [],
    goodsIssues: [],
    issueDetails: [],
    qcRequests: [],
    checkDetails: [],
    recalls: [],
    recallDetails: [],
    roles: [],
    permissions: [],
  };

  if (existing) {
    // If we added significant new mock data, merge or overwrite
    if (existing.batches.length < BATCHES.length) {
        existing.batches = JSON.parse(JSON.stringify(BATCHES));
    }
    return existing;
  }
  
  saveState(initial);
  return initial;
}

// Live mutable state — always read from here
let _state = initState();

// ============================================================
// 9. API HELPER METHODS
// ============================================================

const MockData = {
  // Static reference data (read-only)
  ROLES, USERS, WAREHOUSES, 
  
  get DASHBOARD_STATS() {
    const batches = _state.batches || [];
    const pos = _state.purchaseOrders || [];
    const val = batches.reduce((acc, b) => acc + ((b.qty || 0) * (b.ImportPrice || 0)), 0);
    return {
      totalInventoryValue: val.toLocaleString('vi-VN') + ' VNĐ',
      quarantineBatches: batches.filter(b => b.BatchStatus === 'QUARANTINE').length,
      nearExpiryBatches: batches.filter(b => {
          if (!b.ExpDate) return false;
          const exp = new Date(b.ExpDate);
          const diff = (exp - new Date()) / (1000 * 60 * 60 * 24);
          return diff < 90 && diff > 0;
      }).length,
      pendingPO: pos.filter(p => p.Status === 'PENDING').length,
      todayInbound: _state.goodsReceipts?.length || 0,
      todayOutbound: _state.goodsIssues?.length || 0,
      temperatureAlerts: DASHBOARD_STATS.temperatureAlerts
    };
  },

  // ── Reactive getters ─────────────────────────────────────
  get PRODUCTS() { return _state.products || PRODUCTS; },
  get BATCHES() { return _state.batches; },
  get QA_HISTORY() { return _state.qaHistory || []; },
  get PURCHASE_ORDERS() { return _state.purchaseOrders; },
  get SALES_ORDERS() { return _state.salesOrders; },
  get DELIVERIES() { return _state.deliveries; },
  get CUSTOMERS() { return _state.customers; },
  get LOCATIONS() { return _state.locations; },
  get ZONES() { return _state.zones; },
  get PRODUCT_UNITS() { return _state.productUnits; },
  get PURCHASE_ORDER_DETAILS() { return _state.purchaseOrderDetails; },
  get SALES_ORDER_DETAILS() { return _state.salesOrderDetails; },
  get GOODS_RECEIPTS() { return _state.goodsReceipts; },
  get RECEIPT_DETAILS() { return _state.receiptDetails; },
  get GOODS_ISSUES() { return _state.goodsIssues; },
  get ISSUE_DETAILS() { return _state.issueDetails; },
  get QC_REQUESTS() { return _state.qcRequests; },
  get CHECK_DETAILS() { return _state.checkDetails; },
  get RECALLS() { return _state.recalls; },
  get RECALL_DETAILS() { return _state.recallDetails; },
  get ROLES_TABLE() { return _state.roles; },
  get PERMISSIONS() { return _state.permissions; },
  get COMPLAINTS() { return _state.complaints || []; },
  get APPROVALS() { return _state.approvals; },
  get AUDIT_LOGS() { return _state.auditLogs || []; },
  get NOTIFICATIONS() { return _state.notifications; },
  get INVENTORY_CHECKS() { return _state.inventoryChecks || []; },
  get SUPPLIERS() { return _state.suppliers || []; },
  getSupplierName(id) {
    if (!id) return '—';
    const s = (_state.suppliers || []).find(x => x.id === id || x.SupplierID === id);
    return s ? s.name || s.SupplierName : id;
  },
  getCustomerName(id) {
    if (!id) return '—';
    const c = (_state.customers || []).find(x => x.id === id || x.CustomerID === id);
    return c ? c.name || c.CustomerName : id;
  },

  // ── Auth helpers ─────────────────────────────────────────
  authenticateUser(username, password) {
    return USERS.find(u => u.username === username && u.password === password) || null;
  },
  getUserRole(user) { 
    if (!user) return null;
    let r = user.role;
    if (!r && user.RoleID) {
        // Fallback for unmapped NocoDB users
        const roleData = user.RoleID;
        const roleCode = typeof roleData === 'object' ? (roleData.RoleID || roleData.Id) : roleData;
        const roleMapByCode = {
            'ROLE-01': 'SYSTEM_ADMIN', 'ROLE-02': 'WAREHOUSE_MANAGER', 'ROLE-03': 'WAREHOUSE_STAFF',
            'ROLE-04': 'DIRECTOR', 'ROLE-05': 'DRIVER', 'ROLE-06': 'SALES_STAFF',
            'ROLE-07': 'PROCUREMENT_STAFF', 'ROLE-08': 'QA_PHARMACIST', 'ROLE-09': 'QC_SPECIALIST',
            'ROLE-10': 'ACCOUNTANT'
        };
        r = roleMapByCode[roleCode];
    }
    return ROLES[r] || ROLES.WAREHOUSE_STAFF; 
  },
  canAccessPage(user, pageId) {
    const role = this.getUserRole(user);
    return role ? role.pages.includes(pageId) : false;
  },
  hasPermission(user, permission) {
    const role = this.getUserRole(user);
    if (!role) return false;
    return role.permissions.includes(permission) || role.permissions.includes('write_all');
  },
  getAllUsers() { return _state.users || USERS; },
  addUser(userData) {
    if (!_state.users) _state.users = JSON.parse(JSON.stringify(USERS));
    const newUser = {
      UserID: 'U' + (Math.random() * 1000).toFixed(0).padStart(3, '0'),
      ...userData,
      password: '123456', // Default password
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.FullName)}&background=7C3AED&color=fff`
    };
    _state.users.push(newUser);
    saveState(_state);
    this.addAuditLog('Thêm người dùng', `Đã tạo tài khoản cho ${newUser.username}`, 'info');
    this._emit('user:added', { user: newUser });
    return newUser;
  },
  updateUserRole(userId, newRole) {
    if (!_state.users) _state.users = JSON.parse(JSON.stringify(USERS));
    const user = _state.users.find(u => u.UserID === userId);
    if (!user) return false;
    const oldRole = user.role;
    user.role = newRole;
    saveState(_state);
    this.addAuditLog('Thay đổi quyền', `Người dùng ${user.username}: ${oldRole} → ${newRole}`, 'warn');
    this._emit('user:updated', { userId, newRole });
    return true;
  },
  deleteUser(userId) {
    if (!_state.users) _state.users = JSON.parse(JSON.stringify(USERS));
    _state.users = _state.users.filter(u => u.UserID !== userId);
    saveState(_state);
    this.addAuditLog('Xóa người dùng', `Đã xóa ID ${userId}`, 'error');
    this._emit('user:deleted', { userId });
    return true;
  },

  // ── Batch mutations ──────────────────────────────────────
  /** Cập nhật trạng thái lô hàng: QUARANTINE → RELEASED | LOCKED | DESTROYED */
  async updateBatchStatus(batchId, newStatus) {
    const b = _state.batches.find(x => x.BatchID === batchId);
    if (!b) return false;
    b.BatchStatus = newStatus;

    // Xóa tồn kho nếu tiêu hủy
    if (newStatus === 'DESTROYED') {
      b.Quantity = 0;
    }

    saveState(_state);
    this.addAuditLog('Kiểm định QA', `Lô ${batchId} → ${newStatus}`, newStatus === 'RELEASED' ? 'info' : 'warn');
    this._emit('batch:updated', { batchId, newStatus });
    this._emit('pharma:statechange');

    // NocoDB Sync
    if (window.NocoBridge && window.NocoBridge.API_TOKEN !== 'YOUR_API_TOKEN_HERE') {
      try {
        await window.NocoBridge.updateRow('Batches', b.id || batchId, { BatchStatus: newStatus, Quantity: b.Quantity });
      } catch (e) { console.error('NocoDB sync failed:', e); }
    }
    return true;
  },

  /** Thêm lô hàng mới vào kho (sau khi Nhân viên kho xác nhận nhập) */
  async addBatch({ ProductID, Batchcode, Quantity, ExpDate, LocationID, WarehouseID }) {
    const BatchID = 'BATCH-' + (Date.now() % 10000).toString().padStart(3, '0');
    const newBatch = { BatchID, ProductID, Batchcode, Quantity: parseInt(Quantity), ExpDate, BatchStatus: 'QUARANTINE', LocationID, WarehouseID: WarehouseID || 'WH-HCM' };
    
    _state.batches.push(newBatch);
    saveState(_state);
    this._emit('batch:added', { batch: newBatch });
    this.addAuditLog('Nhập kho', `Đã nhập lô ${Batchcode} vào vị trí ${LocationID}`, 'info');
    this.addNotification(`Lô ${Batchcode} đã nhập kho — đang chờ QA phê duyệt`, 'warning');

    // NocoDB Sync
    if (window.NocoBridge && window.NocoBridge.API_TOKEN !== 'YOUR_API_TOKEN_HERE') {
      try {
        const created = await window.NocoBridge.createRow('Batches', newBatch);
        if (created && created.id) newBatch.id = created.id; // Map internal NocoDB ID
      } catch (e) { console.error('NocoDB sync failed:', e); }
    }
    return newBatch;
  },

  /** Cập nhật vị trí kê của lô hàng */
  async updateBatchLocation(batchId, location) {
    const b = _state.batches.find(x => x.BatchID === batchId);
    if (!b) return false;
    const oldLoc = b.LocationID;
    b.LocationID = location;
    saveState(_state);
    this.addAuditLog('Tồn kho', `Đã chuyển lô ${batchId} từ ${oldLoc} sang ${location}`, 'info');
    this._emit('batch:updated', { batchId, location });
    this._emit('pharma:statechange');

    // NocoDB Sync
    if (window.NocoBridge && window.NocoBridge.API_TOKEN !== 'YOUR_API_TOKEN_HERE') {
      try {
        await window.NocoBridge.updateRow('Batches', b.id || batchId, { LocationID: location });
      } catch (e) { console.error('NocoDB sync failed:', e); }
    }
    return true;
  },

  /** Ghi nhận lịch sử kiểm hàng QA */
  async addQAHistory(record) {
    if (!_state.qaHistory) _state.qaHistory = [];
    _state.qaHistory.unshift(record);
    saveState(_state);
    this._emit('qaHistory:added', { record });

    // NocoDB Sync
    if (window.NocoBridge && window.NocoBridge.API_TOKEN !== 'YOUR_API_TOKEN_HERE') {
      try {
        await window.NocoBridge.createRow('QA_History', record);
      } catch (e) { console.error('NocoDB sync failed:', e); }
    }
    return record;
  },

  // ── SO mutations ─────────────────────────────────────────
  /** Cập nhật trạng thái SO */
  async updateSOStatus(soId, newStatus) {
    const so = _state.salesOrders.find(x => x.SO_ID === soId);
    if (!so) return false;
    so.Status = newStatus;
    saveState(_state);
    this._emit('so:updated', { soId, newStatus });
    this._emit('pharma:statechange');

    // NocoDB Sync
    if (window.NocoBridge && window.NocoBridge.API_TOKEN !== 'YOUR_API_TOKEN_HERE') {
      try {
        await window.NocoBridge.updateRow('Sales_Orders', so.id || soId, { Status: newStatus });
        console.log(`NocoDB: Updated SO ${soId} status to ${newStatus}`);
      } catch (e) { console.error('NocoDB sync failed:', e); }
    }
    return true;
  },

  /** Ghi nhận Xuất kho (vào NocoDB và local state) */
  async addGoodsIssue(soId, items) {
    const SO = _state.salesOrders.find(s => s.SO_ID === soId);
    if (!SO) return null;

    const IssueID = `GI-${new Date().getFullYear()}${String(Date.now()).slice(-4)}`;
    const issueDate = new Date().toISOString().split('T')[0];

    // Find internal ID for SO link
    const soInternalId = SO.id || SO.Id;

    const newIssue = {
        IssueID,
        IssueDate: issueDate,
        SO_ID: SO.SO_ID,
        Sales_Orders_id: soInternalId,
        status: 'COMPLETED'
    };

    // 1. Local state Goods Issue
    if (!_state.goodsIssues) _state.goodsIssues = [];
    _state.goodsIssues.push(newIssue);
    
    let issueIdInNoco = null;
    if (window.NocoBridge && window.NocoBridge.API_TOKEN !== 'YOUR_API_TOKEN_HERE') {
        try {
            const created = await window.NocoBridge.createRow('Goods_Issues', {
                IssueID: newIssue.IssueID,
                IssueDate: newIssue.IssueDate,
                Sales_Orders_id: soInternalId
            });
            if (created) {
                issueIdInNoco = created.Id || created.id;
                newIssue.id = issueIdInNoco;
            }
        } catch (e) { console.error('NocoDB create Goods_Issue failed:', e); }
    }

    // 2. Create Issue Details and Update Inventory
    if (!_state.issueDetails) _state.issueDetails = [];
    
    for (const item of items) {
        const detail = {
            DetailID: `GID-${String(Date.now()).slice(-6)}-${Math.floor(Math.random()*100)}`,
            IssueID: IssueID,
            Goods_Issues_id: issueIdInNoco,
            Batches_id: item.batchInternalId || item.BatchID,
            ShippedQty: item.ActualQty,
            ActualQty: item.ActualQty,
            ProductID: item.ProductID
        };
        _state.issueDetails.push(detail);

        // a. Create detail in NocoDB
        if (window.NocoBridge && window.NocoBridge.API_TOKEN !== 'YOUR_API_TOKEN_HERE' && issueIdInNoco) {
            try {
                await window.NocoBridge.createRow('Issue_Details', {
                    DetailID: detail.DetailID,
                    Goods_Issues_id: issueIdInNoco,
                    Batches_id: detail.Batches_id,
                    ShippedQty: detail.ShippedQty,
                    ActualQty: detail.ActualQty
                });
                
                // b. Update Inventory/Batch Quantity locally
                const batch = _state.batches.find(b => b.BatchID === item.BatchID || b.id === item.batchInternalId);
                if (batch) {
                    batch.Quantity = (batch.Quantity || 0) - item.ActualQty;
                    batch.qty = batch.Quantity;
                    
                    await window.NocoBridge.updateRow('Batches', batch.id || batch.BatchID, { 
                        Quantity: batch.Quantity 
                    });
                }
            } catch (e) { console.error('NocoDB Update failed for item:', item.ProductID, e); }
        }
    }

    // 3. Update SO Status
    await this.updateSOStatus(soId, 'COMPLETED');
    
    saveState(_state);
    this.addAuditLog('Xuất kho', `Đã xuất kho cho đơn hàng ${soId}. IssueID: ${IssueID}`, 'success');
    this._emit('pharma:statechange');
    return newIssue;
  },

  /** Thêm SO mới */
  updateSO(soId, data) {
    const so = _state.salesOrders.find(x => x.SO_ID === soId);
    if (!so) return false;
    if (data.CustomerID) so.CustomerID = data.CustomerID;
    if (data.deadline) so.deadline = data.deadline;
    if (data.priority) so.priority = data.priority;
    if (data.itemsDetails) {
      so.itemsDetails = data.itemsDetails;
      so.progress = `0/${data.itemsDetails.length} SKU`;
    }
    saveState(_state);
    this.addAuditLog('Cập nhật SO', `Đã cập nhật đơn hàng ${soId}`, 'info');
    this.addNotification(`Đã cập nhật thông tin đơn hàng ${soId}`, 'info');
    this._emit('so:updated', { soId });
    return so;
  },

  cancelSO(soId) {
    const so = _state.salesOrders.find(x => x.SO_ID === soId);
    if (!so || so.Status !== 'PICKING') return false;
    so.Status = 'CANCELLED';
    saveState(_state);
    this.addAuditLog('Hủy SO', `Đã hủy đơn hàng ${soId}`, 'warn');
    this.addNotification(`Đã hủy đơn hàng ${soId}`, 'warning');
    this._emit('so:updated', { soId });
    return true;
  },

  async addSO({ CustomerID, region, priority, deadline, itemsDetails }) {
    const SO_ID = `SO-${new Date().getFullYear()}${String(Date.now()).slice(-4)}-${Math.floor(Math.random() * 900 + 100)}`;
    const so = {
      SO_ID, CustomerID, region,
      priority: priority || 'NORMAL',
      deadline: deadline || '—',
      OrderDate: new Date().toLocaleDateString('vi-VN'),
      Status: 'PICKING',
      itemsDetails: itemsDetails || [],
      progress: `0/${(itemsDetails || []).length} SKU`,
      progressPct: 0
    };
    _state.salesOrders.unshift(so);
    saveState(_state);
    this._emit('so:added', { so });
    this.addAuditLog('Lập SO', `Đã tạo đơn hàng ${SO_ID} cho khách ${CustomerID}`, 'info');
    this.addNotification(`Đơn hàng ${SO_ID} đã được tạo — chờ kho soạn hàng`, 'info');

    // NocoDB Sync
    if (window.NocoBridge && window.NocoBridge.API_TOKEN !== 'YOUR_API_TOKEN_HERE') {
      try {
        const created = await window.NocoBridge.createRow('Sales_Orders', so);
        if (created && created.id) so.id = created.id;
      } catch (e) { console.error('NocoDB sync failed:', e); }
    }
    return so;
  },

  // ── PO mutations ─────────────────────────────────────────
  updatePOStatus(poId, newStatus) {
    const po = _state.purchaseOrders.find(x => x.PO_ID === poId);
    if (!po) return false;
    po.Status = newStatus;
    saveState(_state);
    return true;
  },

  updatePO(poId, data) {
    const po = _state.purchaseOrders.find(x => x.PO_ID === poId);
    if (!po) return false;
    if (data.expectedDate) po.expectedDate = data.expectedDate;
    if (data.note !== undefined) po.note = data.note;
    if (data.SupplierID) po.SupplierID = data.SupplierID;
    saveState(_state);
    this.addAuditLog('Cập nhật PO', `Đã cập nhật đơn mua hàng ${poId}`, 'info');
    this.addNotification(`Đã cập nhật thông tin đơn mua ${poId}`, 'info');
    this._emit('po:updated', { poId });
    return po;
  },

  cancelPO(poId) {
    const po = _state.purchaseOrders.find(x => x.PO_ID === poId);
    if (!po || po.Status !== 'PENDING') return false;
    po.Status = 'CANCELLED';
    saveState(_state);
    this.addAuditLog('Hủy PO', `Đã hủy đơn mua hàng ${poId}`, 'warn');
    this.addNotification(`Đã hủy đơn mua hàng ${poId}`, 'warning');
    this._emit('po:updated', { poId });
    return true;
  },

  async approvePO(poId) {
    const po = _state.purchaseOrders.find(x => x.PO_ID === poId);
    if (!po) return false;
    po.Status = 'PENDING';
    saveState(_state);
    this.addAuditLog('Duyệt PO', `Đã phê duyệt đơn mua hàng ${poId}`, 'info');
    this.addNotification(`Đơn mua hàng ${poId} đã được phê duyệt`, 'success');
    this._emit('po:updated', { poId });
    this._emit('pharma:statechange');

    // NocoDB Sync
    if (window.NocoBridge && window.NocoBridge.API_TOKEN !== 'YOUR_API_TOKEN_HERE') {
      try {
        await window.NocoBridge.updateRow('Purchase_Orders', po.id || poId, { Status: 'Đã duyệt' });
      } catch (e) { console.error('NocoDB sync failed:', e); }
    }
    return true;
  },

  async updatePOReceived(poId, receivedQty) {
    const po = _state.purchaseOrders.find(x => x.PO_ID === poId);
    if (!po) return false;
    po.received = Math.min(po.total, (po.received || 0) + parseInt(receivedQty));
    if (po.received >= po.total) po.Status = 'COMPLETED';
    else po.Status = 'PARTIAL';
    saveState(_state);
    this._emit('po:updated', { poId });

    // NocoDB Sync
    if (window.NocoBridge && window.NocoBridge.API_TOKEN !== 'YOUR_API_TOKEN_HERE') {
      try {
        await window.NocoBridge.updateRow('Purchase_Orders', po.id || poId, { 
          received: po.received, 
          Status: po.Status 
        });
      } catch (e) { console.error('NocoDB sync failed:', e); }
    }
    return po;
  },

  /** Thêm PO mới */
  async addPO({ SupplierID, supplierCode, supplierColor, expectedDate, itemsDetails, totalItems, totalQty, totalValue, note }) {
    const PO_ID = `PO-${new Date().getFullYear()}-${Math.floor(Math.random() * 900 + 100)}`;
    const po = {
      PO_ID, SupplierID,
      supplierCode: supplierCode || SupplierID.substring(0, 3).toUpperCase(),
      supplierColor: supplierColor || 'blue',
      expectedDate,
      itemsDetails: itemsDetails || [],
      items: totalItems || 0,
      total: totalQty || 0,
      totalValue: totalValue || 0,
      note: note || '',
      received: 0,
      Status: 'PENDING',
      urgency: 'NORMAL'
    };
    _state.purchaseOrders.unshift(po);
    saveState(_state);
    this._emit('po:added', { po });
    this.addAuditLog('Lập PO', `Đã tạo đơn mua hàng ${PO_ID} gửi NCC ${SupplierID}`, 'info');
    this.addNotification(`Đơn mua hàng ${PO_ID} đã được tạo và gửi đến ${SupplierID}`, 'info');

    // NocoDB Sync
    if (window.NocoBridge && window.NocoBridge.API_TOKEN !== 'YOUR_API_TOKEN_HERE') {
      try {
        const created = await window.NocoBridge.createRow('Purchase_Orders', po);
        if (created && created.id) po.id = created.id;
      } catch (e) { console.error('NocoDB sync failed:', e); }
    }
    return po;
  },

  /** Thêm khiếu nại mới */
  addComplaint({ PO_ID, type, item, qty, desc, request }) {
    if (!_state.complaints) _state.complaints = [];
    const id = `CPL-${new Date().getFullYear()}-${Math.floor(Math.random() * 900 + 100)}`;
    // Find PO to get supplier
    const po = _state.purchaseOrders.find(p => p.PO_ID === PO_ID);
    const SupplierID = po ? po.SupplierID : 'Unknown';

    const complaint = {
      id, PO_ID, SupplierID, type, ProductID: item, Quantity: parseInt(qty) || 0, Description: desc, ResolutionRequest: request,
      date: new Date().toLocaleDateString('vi-VN'),
      Status: 'Mới gửi',
      color: 'blue'
    };

    _state.complaints.unshift(complaint);
    saveState(_state);
    this._emit('complaint:added', { complaint });
    this.addNotification(`Đã gửi khiếu nại ${id} cho đơn ${PO_ID}`, 'warning');
    return complaint;
  },

  // ── Approval mutations ───────────────────────────────────
  updateApproval(apvId, decision, comment) {
    const a = _state.approvals.find(x => x.id === apvId);
    if (!a) return false;
    a.Status = decision; // 'APPROVED' | 'REJECTED'
    a.comment = comment || '';
    a.decidedAt = new Date().toLocaleString('vi-VN');
    saveState(_state);
    this.addAuditLog('Phê duyệt', `${decision}: ${a.type} (${apvId})`, decision === 'APPROVED' ? 'info' : 'warn');
    this._emit('approval:updated', { apvId, decision });
    const msg = decision === 'APPROVED' ? `✅ Đã phê duyệt: ${a.type}` : `❌ Đã từ chối: ${a.type}`;
    this.addNotification(msg, decision === 'APPROVED' ? 'success' : 'error');
    return a;
  },

  /** Xác nhận giao hàng */
  async confirmDelivery(deliveryId, { recipientName, photos, notes } = {}) {
    const d = _state.deliveries.find(x => x.id === deliveryId);
    if (d) {
      d.Status = 'DELIVERED';
      d.deliveredAt = new Date().toLocaleString('vi-VN');
      d.recipientName = recipientName;
      d.notes = notes;
    }
    // Also mark linked SO as COMPLETED
    if (d?.soId) await this.updateSOStatus(d.soId, 'COMPLETED');
    saveState(_state);
    this.addAuditLog('Giao hàng', `Xác nhận giao hàng thành công đơn ${d?.soId || deliveryId}`, 'info');
    this._emit('delivery:confirmed', { deliveryId });
    this.addNotification(`Giao hàng ${deliveryId} xác nhận thành công`, 'success');

    // NocoDB Sync
    if (window.NocoBridge && window.NocoBridge.API_TOKEN !== 'YOUR_API_TOKEN_HERE') {
      try {
        await window.NocoBridge.updateRow('Deliveries', d.id || deliveryId, { 
          Status: 'DELIVERED', 
          deliveredAt: d.deliveredAt, 
          recipientName: recipientName,
          notes: notes
        });
      } catch (e) { console.error('NocoDB sync failed:', e); }
    }
    return d;
  },

  // ── Notification ─────────────────────────────────────────
  addNotification(message, type = 'info') {
    _state.notifications.unshift({ id: Date.now(), message, type, time: new Date().toLocaleTimeString('vi-VN'), read: false });
    if (_state.notifications.length > 50) _state.notifications.pop();
    saveState(_state);
    this._emit('notification:new', { message, type });
  },

  addAuditLog(action, detail, lvl = 'info') {
    const user = window.Auth.getCurrentUser();
    const log = {
      id: Date.now(),
      time: new Date().toLocaleTimeString('vi-VN'),
      user: user ? user.username : 'system',
      action,
      detail,
      lvl // 'info', 'warn', 'error'
    };
    if (!_state.auditLogs) _state.auditLogs = [];
    _state.auditLogs.unshift(log);
    if (_state.auditLogs.length > 500) _state.auditLogs.pop();
    saveState(_state);
    this._emit('auditlog:new', { log });
  },

  // ── Stock Check mutations ──────────────────────────────
  addStockCheck(checkData) {
    if (!_state.stockChecks) _state.stockChecks = [];
    const CheckID = `SC-${new Date().getFullYear()}${(Date.now() % 10000).toString().padStart(4, '0')}`;
    const newCheck = {
      CheckID,
      CheckDate: new Date().toISOString().split('T')[0],
      Status: 'PENDING',
      ...checkData
    };
    _state.stockChecks.unshift(newCheck);
    saveState(_state);
    this._emit('stockCheck:added', { check: newCheck });
    this.addAuditLog('Kiểm kê', `Tạo phiếu kiểm kê mới ${CheckID}`, 'info');
    return newCheck;
  },

  updateStockCheckStatus(CheckID, status) {
    const check = _state.stockChecks.find(c => c.CheckID === CheckID);
    if (!check) return false;
    check.Status = status;

    if (status === 'COMPLETED') {
      let changed = false;
      check.items.forEach(item => {
        if (item.ActualQuantity !== item.BookQuantity) {
          const batch = _state.batches.find(b => b.ProductID === item.ProductID && b.Batchcode === item.Batchcode);
          if (batch) {
            batch.Quantity = item.ActualQuantity;
            changed = true;
          }
        }
      });
      if (changed) {
        this.addAuditLog('Điều chỉnh tồn kho', `Đã điều chỉnh tồn kho theo phiếu kiểm kê ${CheckID}`, 'warn');
        this._emit('pharma:statechange');
      }
    }

    saveState(_state);
    this._emit('stockCheck:updated', { CheckID, status });
    return true;
  },

  exportToCSV(data, filename) {
    if (!data || !data.length) return;
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(obj => Object.values(obj).map(v => `"${v}"`).join(',')).join('\n');
    const csvContent = headers + '\n' + rows;
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename || 'data.csv');
    link.click();
    this.addAuditLog('Xuất dữ liệu', `Đã xuất file ${filename}`, 'info');
  },

  markNotificationsRead() {
    _state.notifications.forEach(n => n.read = true);
    saveState(_state);
  },

  // ── Reset (IT Admin / dev only) ──────────────────────────
  resetState() {
    sessionStorage.removeItem(STATE_KEY);
    _state = initState();
    window.location.reload();
  },

  // ── Event system (lightweight pub/sub for page updates) ──
  _listeners: {},
  _emit(event, data) {
    (this._listeners[event] || []).forEach(fn => { try { fn(data); } catch (e) { } });
    // Also dispatch DOM event for pages to listen on
    window.dispatchEvent(new CustomEvent('pharma:statechange', { detail: { event, data } }));
  },
  on(event, fn) {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(fn);
  },

  // ── NocoDB Synchronization ──────────────────────────────
  async syncWithNoco() {
    if (!window.NocoBridge || !window.NocoBridge.API_TOKEN || window.NocoBridge.API_TOKEN === 'YOUR_API_TOKEN_HERE') {
      console.warn('NocoDB Bridge not configured. Using local mock data.');
      return;
    }

    try {
      console.log('Syncing with NocoDB...');
      
      // Fetch core tables in parallel, handling failures per table
      const results = await Promise.allSettled([
        window.NocoBridge.fetchTable('Products').catch(() => null),
        window.NocoBridge.fetchTable('Batches').catch(() => null),
        window.NocoBridge.fetchTable('Inventory').catch(() => null),
        window.NocoBridge.fetchTable('Suppliers').catch(() => null),
        window.NocoBridge.fetchTable('Purchase_Orders').catch(() => null),
        window.NocoBridge.fetchTable('Sales_Orders').catch(() => null),
        window.NocoBridge.fetchTable('Users').catch(() => null),
        window.NocoBridge.fetchTable('Customers').catch(() => null),
        window.NocoBridge.fetchTable('Warehouse_locations').catch(() => null),
        window.NocoBridge.fetchTable('Zones').catch(() => null),
        window.NocoBridge.fetchTable('Product_Units').catch(() => null),
        window.NocoBridge.fetchTable('Purchase_Order_Details').catch(() => null),
        window.NocoBridge.fetchTable('Sales_Order_Details').catch(() => null),
        window.NocoBridge.fetchTable('Goods_Receipts').catch(() => null),
        window.NocoBridge.fetchTable('Receipt_Details').catch(() => null),
        window.NocoBridge.fetchTable('Goods_Issues').catch(() => null),
        window.NocoBridge.fetchTable('Issue_Details').catch(() => null),
        window.NocoBridge.fetchTable('QC_Requests').catch(() => null),
        window.NocoBridge.fetchTable('Inventory_Checks').catch(() => null),
        window.NocoBridge.fetchTable('Check_Details').catch(() => null),
        window.NocoBridge.fetchTable('Recalls').catch(() => null),
        window.NocoBridge.fetchTable('Recall_Details').catch(() => null),
        window.NocoBridge.fetchTable('Roles').catch(() => null),
        window.NocoBridge.fetchTable('Permissions').catch(() => null)
      ]);

      const [
        productsRes, batchesRes, inventoryRes, suppliersRes, posRes, sosRes, 
        usersRes, customersRes, locationsRes, zonesRes, unitsRes, poDetailsRes, 
        soDetailsRes, receiptsRes, rDetailsRes, issuesRes, iDetailsRes, 
        qcRes, checksRes, checkDetailsRes, recallsRes, recallDetailsRes, 
        rolesRes, permsRes
      ] = results;

      // Extract values
      const products = productsRes.status === 'fulfilled' ? productsRes.value : null;
      const batches = batchesRes.status === 'fulfilled' ? batchesRes.value : null;
      const inventory = inventoryRes.status === 'fulfilled' ? inventoryRes.value : null;
      const suppliers = suppliersRes.status === 'fulfilled' ? suppliersRes.value : null;
      const pos = posRes.status === 'fulfilled' ? posRes.value : null;
      const sos = sosRes.status === 'fulfilled' ? sosRes.value : null;
      const users = usersRes.status === 'fulfilled' ? usersRes.value : null;
      const customers = customersRes.status === 'fulfilled' ? customersRes.value : null;
      const locations = locationsRes.status === 'fulfilled' ? locationsRes.value : null;
      const zones = zonesRes.status === 'fulfilled' ? zonesRes.value : null;
      const units = unitsRes.status === 'fulfilled' ? unitsRes.value : null;
      const poDetails = poDetailsRes.status === 'fulfilled' ? poDetailsRes.value : null;
      const soDetails = soDetailsRes.status === 'fulfilled' ? soDetailsRes.value : null;
      const receipts = receiptsRes.status === 'fulfilled' ? receiptsRes.value : null;
      const rDetails = rDetailsRes.status === 'fulfilled' ? rDetailsRes.value : null;
      const issues = issuesRes.status === 'fulfilled' ? issuesRes.value : null;
      const iDetails = iDetailsRes.status === 'fulfilled' ? iDetailsRes.value : null;
      const qc = qcRes.status === 'fulfilled' ? qcRes.value : null;
      const checks = checksRes.status === 'fulfilled' ? checksRes.value : null;
      const checkDetails = checkDetailsRes.status === 'fulfilled' ? checkDetailsRes.value : null;
      const recalls = recallsRes.status === 'fulfilled' ? recallsRes.value : null;
      const recallDetails = recallDetailsRes.status === 'fulfilled' ? recallDetailsRes.value : null;
      const roles = rolesRes.status === 'fulfilled' ? rolesRes.value : null;
      const perms = permsRes.status === 'fulfilled' ? permsRes.value : null;

      if (Array.isArray(products)) {
        _state.products = products.map(p => window.NocoMappers.toUIProduct(p));
      }

      if (Array.isArray(batches)) {
        const uiBatches = batches.map(b => window.NocoMappers.toUIBatch(b));
        if (Array.isArray(inventory)) {
            _state.batches = uiBatches.map(b => {
                // Find inventory record by matching BatchID inside the Batches object
                const inv = inventory.find(i => {
                    const mappedBatchID = window.NocoMappers._flatten(i.Batches, 'BatchID') || 
                                        (i.Batches ? i.Batches.BatchID : null);
                    return mappedBatchID === b.BatchID;
                }) || {};
                
                const q = typeof inv.Quantity !== 'undefined' ? inv.Quantity : 
                          (typeof inv.quantity !== 'undefined' ? inv.quantity : 0);
                
                return {
                    ...b,
                    Quantity: q,
                    qty: q,
                    LocationID: window.NocoMappers._flatten(inv.Warehouse_Locations, 'LocationID') || 'Chưa gán',
                    ReservedQty: inv.ReservedQty || 0
                };
            });
        } else {
            _state.batches = uiBatches;
        }
      }

      if (Array.isArray(suppliers)) _state.suppliers = suppliers.map(s => window.NocoMappers.toUISupplier(s));
      if (Array.isArray(pos)) {
          _state.purchaseOrders = pos.map(p => {
              const base = window.NocoMappers.toUIPO(p);
              
              // 1. Get PO Details to find metadata
              const poDetailsForThisPO = (Array.isArray(poDetails) ? poDetails : [])
                .filter(d => window.NocoMappers._flatten(d.PO_ID) === base.PO_ID);
              
              base.total = poDetailsForThisPO.reduce((acc, d) => acc + (d.OrderedQty || 0), 0);
              base.totalItems = poDetailsForThisPO.length;
              base.totalValue = poDetailsForThisPO.reduce((acc, d) => acc + ((d.OrderedQty || 0) * (d.UnitPrice || 0)), 0);

              // 2. Get Goods Receipts for this PO
              const receiptsForPo = (Array.isArray(receipts) ? receipts : [])
                .filter(r => window.NocoMappers._flatten(r.PO_ID) === base.PO_ID);
              const receiptIds = receiptsForPo.map(r => r.ReceiptID || r.Id);

              // 3. Calculate fulfillment per product line
              let fullyReceivedCount = 0;
              let totalRealReceived = 0;

              base.itemsDetails = poDetailsForThisPO.map(detail => {
                  const pid = window.NocoMappers._flatten(detail.ProductID);
                  
                  // Find all receipt details for this specific product linked to this PO's receipts
                  const receivedQtyForThisItem = (Array.isArray(rDetails) ? rDetails : [])
                      .filter(rd => {
                          const rid = window.NocoMappers._flatten(rd.ReceiptID);
                          // In our DB, we link RD to Product via BatchID -> ProductID 
                          // (or sometimes directly if your schema allows)
                          // Looking at your Receipt_Details, it has BatchID.
                          const b = (Array.isArray(batches) ? batches : []).find(b => b.BatchID === window.NocoMappers._flatten(rd.BatchID));
                          const rdPid = b ? b.ProductID : window.NocoMappers._flatten(rd.ProductID);
                          return receiptIds.includes(rid) && rdPid === pid;
                      })
                      .reduce((acc, rd) => acc + (rd.ActualQty || 0), 0);

                  totalRealReceived += receivedQtyForThisItem;
                  if (receivedQtyForThisItem >= (detail.OrderedQty || 0)) {
                      fullyReceivedCount++;
                  }

                  return {
                      ...detail,
                      ProductID: pid,
                      PO_ID: window.NocoMappers._flatten(detail.PO_ID),
                      _actualReceived: receivedQtyForThisItem // For internal tracking
                  };
              });

              base.received = totalRealReceived;

              // 4. Robust Status Logic: Only COMPLETED if ALL lines are fulfilled
              if (base.received <= 0) {
                  // Keep initial mapped status
              } else if (fullyReceivedCount === base.totalItems) {
                  base.Status = 'COMPLETED';
              } else {
                  base.Status = 'PARTIAL';
              }
                return base;
            });
        }
      
      if (Array.isArray(sos)) {
          _state.salesOrders = sos.map(s => {
              const base = window.NocoMappers.toUISO(s);
              
              const soDetailsForThisSO = (Array.isArray(soDetails) ? soDetails : [])
                .filter(d => window.NocoMappers._flatten(d.SO_ID) === base.SO_ID);
              
              base.total = soDetailsForThisSO.reduce((acc, d) => acc + (d.OrderedQty || 0), 0);
              base.totalItems = soDetailsForThisSO.length;
              base.itemsDetails = soDetailsForThisSO.map(d => ({
                  ...d,
                  ProductID: window.NocoMappers._flatten(d.ProductID),
                  SO_ID: window.NocoMappers._flatten(d.SO_ID)
              }));

              const issuesForSo = (Array.isArray(issues) ? issues : [])
                .filter(i => window.NocoMappers._flatten(i.SO_ID) === base.SO_ID);
              
              const issueIds = issuesForSo.map(i => i.IssueID || i.Id);
              
              const issuedFromDetails = (Array.isArray(iDetails) ? iDetails : [])
                .filter(id => issueIds.includes(window.NocoMappers._flatten(id.IssueID)))
                .reduce((acc, id) => acc + (id.ActualQty || 0), 0);

              base.issued = issuedFromDetails;
              base.progressPct = base.total > 0 ? Math.round((base.issued / base.total) * 100) : 0;
              base.progress = `${base.issued}/${base.total} đơn vị`;

              if (base.issued <= 0) {
              } else if (base.issued < base.total) {
                  base.Status = 'IN_PROGRESS';
              } else {
                  base.Status = 'COMPLETED';
              }

              return base;
          });
      }

      if (Array.isArray(users)) {
          _state.users = users.map(u => window.NocoMappers.toUIUser(u));
      }
      if (Array.isArray(customers)) _state.customers = customers.map(c => window.NocoMappers.toUICustomer(c));
      if (Array.isArray(locations)) _state.locations = locations;
      if (Array.isArray(zones)) _state.zones = zones;
      if (Array.isArray(units)) _state.productUnits = units;

      if (Array.isArray(poDetails)) _state.purchaseOrderDetails = poDetails;
      if (Array.isArray(soDetails)) _state.salesOrderDetails = soDetails;
      if (Array.isArray(receipts)) _state.goodsReceipts = receipts.map(r => window.NocoMappers.toUIGoodsReceipt(r));
      if (Array.isArray(rDetails)) _state.receiptDetails = rDetails;
      if (Array.isArray(issues)) _state.goodsIssues = issues.map(i => window.NocoMappers.toUIGoodsIssue(i));
      if (Array.isArray(iDetails)) _state.issueDetails = iDetails;
      if (Array.isArray(qc)) _state.qcRequests = qc;
      if (Array.isArray(checks)) _state.inventoryChecks = checks;
      if (Array.isArray(checkDetails)) _state.checkDetails = checkDetails;
      if (Array.isArray(recalls)) _state.recalls = recalls;
      if (Array.isArray(recallDetails)) _state.recallDetails = recallDetails;
      if (Array.isArray(roles)) _state.roles = roles;
      if (Array.isArray(perms)) _state.permissions = perms;

      saveState(_state);
      this._emit('pharma:statechange', { source: 'nocodbSync' });
      console.log('NocoDB Sync Complete (Full Database).');
      
      const totalItems = (Array.isArray(batches) ? batches.length : 0);
      if (totalItems > 0) {
          alert(`Đã đồng bộ thành công ${totalItems} lô hàng từ NocoDB!`);
      } else {
          console.warn('Sync hoàn tất nhưng không tìm thấy dữ liệu nào trên NocoDB.');
      }
    } catch (error) {
      console.error('Failed to sync with NocoDB:', error);
      alert('Không thể đồng bộ dữ liệu với NocoDB. Vui lòng kiểm tra Console (F12) để xem chi tiết lỗi.');
    }
  }
};

window.MockData = MockData;

