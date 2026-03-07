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
  { lot: 'HP-231015', product: 'Hapacol 650mg', date: '01/10/2023', inspector: 'DS. Nguyễn Thị Lan', result: 'ĐẠT', status: 'RELEASED' },
  { lot: 'VT-231201', product: 'Vitamin C 1000mg', date: '05/10/2023', inspector: 'Lê Thị Bích Ngọc', result: 'ĐẠT', status: 'RELEASED' },
  { lot: 'PX-230901', product: 'Paracetamol 500mg', date: '08/09/2023', inspector: 'DS. Nguyễn Thị Lan', result: 'KHÔNG ĐẠT', status: 'REJECT' },
];

// ============================================================
// 4. PURCHASE ORDERS
// ============================================================

const PURCHASE_ORDERS = [
  {
    PO_ID: 'PO-2023-0891', SupplierID: 'Pfizer Vietnam Ltd.', supplierCode: 'PF', supplierColor: 'blue',
    expectedDate: '25/10/2023', items: 2, received: 7, total: 12, status: 'PARTIAL', urgency: 'NORMAL',
    itemsDetails: [
      { ProductID: 'SKU-PFIZ-01', OrderedQty: 10 },
      { ProductID: 'SKU-INSU-05', OrderedQty: 2 }
    ]
  },
  {
    PO_ID: 'PO-2023-0892', SupplierID: 'Dược Hậu Giang (DHG)', supplierCode: 'DH', supplierColor: 'green',
    expectedDate: '26/10/2023', items: 1, received: 0, total: 5, status: 'PENDING', urgency: 'NORMAL',
    itemsDetails: [
      { ProductID: 'SKU-HAPA-02', OrderedQty: 5 }
    ]
  },
  {
    PO_ID: 'PO-2023-0885', SupplierID: 'AstraZeneca VN', supplierCode: 'AZ', supplierColor: 'purple',
    expectedDate: '22/10/2023', items: 1, received: 8, total: 8, status: 'COMPLETED', urgency: 'NORMAL',
    itemsDetails: [
      { ProductID: 'SKU-AZIT-03', OrderedQty: 8 }
    ]
  },
  {
    PO_ID: 'PO-2023-0880', SupplierID: 'Sanofi-Aventis', supplierCode: 'SN', supplierColor: 'red',
    expectedDate: '20/10/2023', items: 1, received: 0, total: 2, status: 'CANCELLED', urgency: 'NORMAL',
    itemsDetails: [
      { ProductID: 'SKU-VITA-04', OrderedQty: 2 }
    ]
  },
  {
    PO_ID: 'PO-2023-0901', SupplierID: 'Merck Sharp & Dohme', supplierCode: 'MS', supplierColor: 'teal',
    expectedDate: '01/11/2023', items: 2, received: 0, total: 50, status: 'PENDING', urgency: 'URGENT',
    itemsDetails: [{ ProductID: 'SKU-INSU-05', OrderedQty: 50 }]
  },
  {
    PO_ID: 'PO-2023-0905', SupplierID: 'GSK Vietnam', supplierCode: 'GS', supplierColor: 'orange',
    expectedDate: '05/11/2023', items: 1, received: 0, total: 200, status: 'PENDING', urgency: 'NORMAL',
    itemsDetails: [{ ProductID: 'SKU-AZIT-03', OrderedQty: 200 }]
  },
];

// ============================================================
// 5. SALES ORDERS
// ============================================================

const COMPLAINTS = [
  { id: 'CPL-001', poId: 'PO-2023-0882', supplier: 'Pfizer Vietnam Ltd.', type: 'Thiếu hàng (Quantity Shortage)', item: 'Hapacol 650mg', qty: 12, desc: 'Giao thiếu 12 hộp so với hóa đơn', request: 'Đổi hàng mới', date: '15/09/2023', status: 'Đã xử lý', color: 'green' },
  { id: 'CPL-002', poId: 'PO-2023-0876', supplier: 'Dược Hậu Giang (DHG)', type: 'Lỗi chất lượng / CoA không đạt', item: 'Azithromycin 250mg', qty: 50, desc: 'CoA không khớp với lô hàng nhận', request: 'Hoàn tiền', date: '02/10/2023', status: 'Đang xử lý', color: 'amber' },
];

const SALES_ORDERS = [
  {
    SO_ID: 'SO-20231024-001', CustomerID: 'Hệ thống Nhà thuốc Pharmacity', region: 'TP.HCM',
    OrderDate: '24/10/2023', deadline: '25/10/2023 08:00', priority: 'URGENT', status: 'PICKING', progress: '0/2 SKU', progressPct: 0,
    itemsDetails: [
      { ProductID: 'SKU-PFIZ-01', OrderedQty: 100, UnitPrice: 320000 },
      { ProductID: 'SKU-HAPA-02', OrderedQty: 200, UnitPrice: 45000 }
    ]
  },
  {
    SO_ID: 'SO-20231025-002', CustomerID: 'Bệnh viện Đa khoa Tâm Anh', region: 'Hà Nội',
    OrderDate: '25/10/2023', deadline: '26/10/2023 10:00', priority: 'URGENT', status: 'PICKING', progress: '0/3 SKU', progressPct: 0,
    itemsDetails: [
      { ProductID: 'SKU-PFIZ-01', OrderedQty: 50, UnitPrice: 320000 },
      { ProductID: 'SKU-INSU-05', OrderedQty: 30, UnitPrice: 750000 },
      { ProductID: 'SKU-AZIT-03', OrderedQty: 100, UnitPrice: 85000 }
    ]
  },
  {
    SO_ID: 'SO-20231025-003', CustomerID: 'Chuỗi Nhà thuốc An Khang', region: 'Cần Thơ',
    OrderDate: '25/10/2023', deadline: '27/10/2023 14:00', priority: 'NORMAL', status: 'PICKING', progress: '0/2 SKU', progressPct: 0,
    itemsDetails: [
      { ProductID: 'SKU-HAPA-02', OrderedQty: 500, UnitPrice: 45000 },
      { ProductID: 'SKU-VITA-04', OrderedQty: 300, UnitPrice: 120000 }
    ]
  },
  {
    SO_ID: 'SO-20231024-005', CustomerID: 'Nhà thuốc Long Châu #12', region: 'Bình Dương',
    OrderDate: '24/10/2023', deadline: '25/10/2023 15:00', priority: 'NORMAL', status: 'IN_PROGRESS', progress: '1/2 SKU', progressPct: 50,
    itemsDetails: [
      { ProductID: 'SKU-AZIT-03', OrderedQty: 50, UnitPrice: 85000 },
      { ProductID: 'SKU-VITA-04', OrderedQty: 100, UnitPrice: 120000 }
    ]
  },
  {
    SO_ID: 'SO-20231023-098', CustomerID: 'Bệnh viện Chợ Rẫy', region: 'TP.HCM',
    OrderDate: '23/10/2023', deadline: '24/10/2023 10:00', priority: 'URGENT', status: 'PACKING', progress: 'Lấy hàng hoàn tất', progressPct: 90,
    itemsDetails: [
      { ProductID: 'SKU-INSU-05', OrderedQty: 20, UnitPrice: 750000 }
    ]
  },
  {
    SO_ID: 'SO-20231023-085', CustomerID: 'Nhà thuốc An Khang Hà Nội', region: 'Hà Nội',
    OrderDate: '23/10/2023', deadline: '26/10/2023 10:00', priority: 'NORMAL', status: 'COMPLETED', progress: 'Hoàn thành', progressPct: 100,
    itemsDetails: [
      { ProductID: 'SKU-VITA-04', OrderedQty: 50, UnitPrice: 120000 }
    ]
  },
  {
    SO_ID: 'SO-20231026-001', CustomerID: 'Phòng khám Đa khoa Thu Cúc', region: 'Hà Nội',
    OrderDate: '26/10/2023', deadline: '27/10/2023 09:00', priority: 'NORMAL', status: 'PICKING', progress: '0/1 SKU', progressPct: 0,
    itemsDetails: [{ ProductID: 'SKU-HAPA-02', OrderedQty: 100, UnitPrice: 45000 }]
  },
  {
    SO_ID: 'SO-20231026-002', CustomerID: 'Hệ thống Pharmacity Miền Bắc', region: 'Bắc Ninh',
    OrderDate: '26/10/2023', deadline: '28/10/2023 15:00', priority: 'NORMAL', status: 'PICKING', progress: '0/2 SKU', progressPct: 0,
    itemsDetails: [
      { ProductID: 'SKU-PFIZ-01', OrderedQty: 500, UnitPrice: 320000 },
      { ProductID: 'SKU-AZIT-03', OrderedQty: 300, UnitPrice: 85000 }
    ]
  },
];

// ============================================================
// 6. DELIVERY (Tài xế)
// ============================================================

const DELIVERIES = [
  {
    id: 'DEL-001', soId: 'SO-20231023-085', customer: 'Nhà thuốc An Khang Hà Nội',
    driver: 'Võ Công Danh', address: '12 Lê Lợi, Hà Đông, Hà Nội', status: 'DELIVERING',
    estimatedTime: '16:00 hôm nay'
  },
  {
    id: 'DEL-002', soId: 'SO-20231023-098', customer: 'Bệnh viện Chợ Rẫy',
    driver: 'Võ Công Danh', address: '201B Nguyễn Chí Thanh, Q5, TP.HCM', status: 'PENDING',
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
  pendingPO: PURCHASE_ORDERS.filter(p => p.status === 'PENDING').length,
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
        id: 'APV-001', type: 'Xuất kho đặc biệt', status: 'PENDING', dept: 'Kho + Kinh doanh', urgent: true,
        desc: 'SO-2023-1488 — Xuất 1,200 liều Vaccine Pfizer cho BV Chợ Rẫy. Trị giá: 384,000,000 VNĐ.'
      },
      {
        id: 'APV-002', type: 'Thu hồi lô hàng', status: 'PENDING', dept: 'QA/QC', urgent: true,
        desc: 'Thu hồi lô AZ-230901 theo Quyết định 45/QĐ-BYT. 200 hộp, đang biệt trữ Q-01.'
      },
      {
        id: 'APV-003', type: 'Điều chỉnh tồn kho', status: 'PENDING', dept: 'Kho + Kế toán', urgent: false,
        desc: 'Điều chỉnh chênh lệch kiểm kê T10/2023: +3 hộp Hapacol (nhầm lẫn nhập liệu).'
      },
    ],
    stockChecks: [
      {
        id: 'SC-202310-01',
        date: '2023-10-15',
        warehouse: 'HN',
        status: 'COMPLETED',
        items: [
          { productId: 'SKU-PFIZ-01', lot: 'PF-230401', bookQty: 500, actualQty: 500 },
          { productId: 'SKU-HAPA-02', lot: 'HP-231015', bookQty: 1200, actualQty: 1210 }
        ]
      }
    ],
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
  ROLES, USERS, WAREHOUSES, PRODUCTS, DASHBOARD_STATS,

  // ── Reactive getters ─────────────────────────────────────
  get BATCHES() { return _state.batches; },
  get QA_HISTORY() { return _state.qaHistory || []; },
  get PURCHASE_ORDERS() { return _state.purchaseOrders; },
  get SALES_ORDERS() { return _state.salesOrders; },
  get DELIVERIES() { return _state.deliveries; },
  get COMPLAINTS() { return _state.complaints || []; },
  get APPROVALS() { return _state.approvals; },
  get AUDIT_LOGS() { return _state.auditLogs || []; },
  get NOTIFICATIONS() { return _state.notifications; },
  get STOCK_CHECKS() { return _state.stockChecks || []; },

  // ── Auth helpers ─────────────────────────────────────────
  authenticateUser(username, password) {
    return USERS.find(u => u.username === username && u.password === password) || null;
  },
  getUserRole(user) { return ROLES[user?.role] || null; },
  canAccessPage(user, pageId) {
    const role = ROLES[user?.role];
    return role ? role.pages.includes(pageId) : false;
  },
  hasPermission(user, permission) {
    const role = ROLES[user?.role];
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
    so.status = newStatus;
    saveState(_state);
    this._emit('so:updated', { soId, newStatus });

    // NocoDB Sync
    if (window.NocoBridge && window.NocoBridge.API_TOKEN !== 'YOUR_API_TOKEN_HERE') {
      try {
        await window.NocoBridge.updateRow('Sales_Orders', so.id || soId, { status: newStatus });
      } catch (e) { console.error('NocoDB sync failed:', e); }
    }
    return true;
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
    if (!so || so.status !== 'PICKING') return false;
    so.status = 'CANCELLED';
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
      status: 'PICKING',
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
    po.status = newStatus;
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
    if (!po || po.status !== 'PENDING') return false;
    po.status = 'CANCELLED';
    saveState(_state);
    this.addAuditLog('Hủy PO', `Đã hủy đơn mua hàng ${poId}`, 'warn');
    this.addNotification(`Đã hủy đơn mua hàng ${poId}`, 'warning');
    this._emit('po:updated', { poId });
    return true;
  },

  async updatePOReceived(poId, receivedQty) {
    const po = _state.purchaseOrders.find(x => x.PO_ID === poId);
    if (!po) return false;
    po.received = Math.min(po.total, (po.received || 0) + parseInt(receivedQty));
    if (po.received >= po.total) po.status = 'COMPLETED';
    else po.status = 'PARTIAL';
    saveState(_state);
    this._emit('po:updated', { poId });

    // NocoDB Sync
    if (window.NocoBridge && window.NocoBridge.API_TOKEN !== 'YOUR_API_TOKEN_HERE') {
      try {
        await window.NocoBridge.updateRow('Purchase_Orders', po.id || poId, { 
          received: po.received, 
          status: po.status 
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
      status: 'PENDING',
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
      status: 'Mới gửi',
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
    a.status = decision; // 'APPROVED' | 'REJECTED'
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
      d.status = 'DELIVERED';
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
          status: 'DELIVERED', 
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
      status: 'PENDING',
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
    check.status = status;

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
      
      // Fetch core tables in parallel
      const [products, batches, pos, sos, users] = await Promise.all([
        window.NocoBridge.fetchTable('Products'),
        window.NocoBridge.fetchTable('Batches'),
        window.NocoBridge.fetchTable('Purchase_Orders'),
        window.NocoBridge.fetchTable('Sales_Orders'),
        window.NocoBridge.fetchTable('Users')
      ]);

      // Update state
      if (products) _state.products = products;
      if (batches) _state.batches = batches;
      if (pos) _state.purchaseOrders = pos;
      if (sos) _state.salesOrders = sos;
      if (users) _state.users = users;

      saveState(_state);
      this._emit('pharma:statechange', { source: 'nocodbSync' });
      console.log('NocoDB Sync Complete.');
    } catch (error) {
      console.error('Failed to sync with NocoDB:', error);
      // Fallback is already handled by initial _state values
    }
  }
};

window.MockData = MockData;

