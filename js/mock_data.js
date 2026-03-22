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
    permissions: ['read_inventory', 'read_po', 'read_so', 'write_inventory', 'write_inbound', 'write_outbound',
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
    permissions: ['read_inventory', 'read_po', 'read_so', 'write_accounting', 'export_report']
  },

  // ── Ban giám đốc ───────────────────────────────────────────
  DIRECTOR: {
    label: 'Ban giám đốc',
    color: '#DC2626',
    icon: 'supervisor_account',
    pages: ['dashboard', 'qa-reports', 'accounting', 'purchase-order'],
    permissions: ['read_inventory', 'read_po', 'read_so', 'approve_director', 'approve_po', 'export_report']
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
  { username: 'admin', password: '123456', role: 'SYSTEM_ADMIN', FullName: 'Quản trị hệ thống', UserID: 'U001', avatar: 'https://ui-avatars.com/api/?name=Admin&background=7C3AED&color=fff' },
  { username: 'thukho', password: '123456', role: 'WAREHOUSE_MANAGER', FullName: 'Trần Văn Kho', UserID: 'U002', avatar: 'https://ui-avatars.com/api/?name=Thu+Kho&background=1D4ED8&color=fff' },
  { username: 'nvkho', password: '123456', role: 'WAREHOUSE_STAFF', FullName: 'Lê Nhân Viên', UserID: 'U003', avatar: 'https://ui-avatars.com/api/?name=NV+Kho&background=EA580C&color=fff' },
  { username: 'qcvien', password: '123456', role: 'QC_SPECIALIST', FullName: 'Nguyễn QC', UserID: 'U004', avatar: 'https://ui-avatars.com/api/?name=QC&background=0D9488&color=fff' },
  { username: 'qaduoc', password: '123456', role: 'QA_PHARMACIST', FullName: 'Phạm QA', UserID: 'U005', avatar: 'https://ui-avatars.com/api/?name=QA&background=0891B2&color=fff' },
  { username: 'sales', password: '123456', role: 'SALES_STAFF', FullName: 'Hoàng Sales', UserID: 'U006', avatar: 'https://ui-avatars.com/api/?name=Sales&background=D97706&color=fff' },
  { username: 'mua', password: '123456', role: 'PROCUREMENT_STAFF', FullName: 'Đặng Thu Mua', UserID: 'U007', avatar: 'https://ui-avatars.com/api/?name=Procurement&background=B45309&color=fff' },
  { username: 'ketoan', password: '123456', role: 'ACCOUNTANT', FullName: 'Lý Kế Toán', UserID: 'U008', avatar: 'https://ui-avatars.com/api/?name=Accountant&background=CA8A04&color=fff' },
  { username: 'giamdoc', password: '123456', role: 'DIRECTOR', FullName: 'Vũ Giám Đốc', UserID: 'U009', avatar: 'https://ui-avatars.com/api/?name=Director&background=DC2626&color=fff' },
  { username: 'taixe', password: '123456', role: 'DRIVER', FullName: 'Ngô Tài Xế', UserID: 'U010', avatar: 'https://ui-avatars.com/api/?name=Driver&background=64748B&color=fff' }
];
const WAREHOUSES = [];
const PRODUCTS = [];
const BATCHES = [];

const QA_HISTORY = [];

// ============================================================
// 4. PURCHASE ORDERS
// ============================================================

const PURCHASE_ORDERS = [];

// ============================================================
// 5. SALES ORDERS
// ============================================================

const COMPLAINTS = [];
const SALES_ORDERS = [];

// ============================================================
// 6. DELIVERY (Tài xế)
// ============================================================

const DELIVERIES = [];

// ============================================================
// 7. DASHBOARD STATS
// ============================================================

const DASHBOARD_STATS = {
  totalInventoryValue: '0 VNĐ',
  quarantineBatches: 0,
  nearExpiryBatches: 0,
  pendingPO: 0,
  todayInbound: 0,
  todayOutbound: 0,
  temperatureAlerts: []
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
  const initial = {
    batches: [],
    users: [],
    qaHistory: [],
    purchaseOrders: [],
    salesOrders: [],
    deliveries: [],
    complaints: [],
    auditLogs: [
      { id: 1, time: new Date().toLocaleTimeString('vi-VN'), user: 'system', action: 'Khởi động hệ thống', detail: 'Hệ thống đang sẵn sàng kết nối dữ liệu thời gian thực (NocoDB).', lvl: 'info' }
    ],
    notifications: [],
    systemConfig: {
        expiryWarningThreshold: 12, // months
        strictFEFO: true,
        requireCOA: true,
        lockOutboundOnRecall: true
    },
    partners: [],
    approvals: [],
    inventoryChecks: [],
    products: [],
    suppliers: [],
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
    permissions: []
  };
  saveState(initial);
  return initial;
}

// Live mutable state — always read from here
let _state = loadState() || initState();

// ============================================================
// 9. API HELPER METHODS
// ============================================================

const MockData = {
  // Static reference data (read-only)
  ROLES, USERS, WAREHOUSES, 

  // --- FR-NK-04: AQL Calculation (ISO 2859-1 Simplified) ---
  calculateAQL(qty) {
    if (qty <= 8) return qty;
    if (qty <= 15) return 3;
    if (qty <= 25) return 5;
    if (qty <= 50) return 8;
    if (qty <= 90) return 13;
    if (qty <= 150) return 20;
    if (qty <= 280) return 32;
    if (qty <= 500) return 50;
    if (qty <= 1200) return 80;
    if (qty <= 3200) return 125;
    return 200; // Cap for mock
  },

  // --- FR-NK-02 & FR-NK-13: Inbound Validation ---
  validateInbound(poId, batchData, exceptionApproved = false) {
    const po = _state.purchaseOrders.find(p => p.PO_ID === poId);
    if (!po) return { valid: false, message: 'PO không tồn tại.' };
    
    // FR-NK-01: Chặn nếu PO đã đóng hoặc hủy
    if (['COMPLETED', 'CANCELLED', 'ĐÃ HOÀN THÀNH', 'HỦY'].includes(po.Status.toUpperCase())) {
      return { valid: false, message: `PO ${poId} đã ở trạng thái ${po.Status}. Không thể nhập thêm.` };
    }

    // FR-NK-02: Kiểm tra Hạn dùng < 12 tháng
    if (batchData.ExpDate) {
      const exp = new Date(batchData.ExpDate);
      const today = new Date();
      const monthDiff = (exp.getFullYear() - today.getFullYear()) * 12 + (exp.getMonth() - today.getMonth());
      if (monthDiff < 12 && !exceptionApproved) {
        return { valid: false, message: 'Hạn dùng < 12 tháng. Bị chặn theo quy định GSP. Cần "Phê duyệt ngoại lệ" từ QA để tiếp tục.' };
      }
      if (monthDiff < 12 && exceptionApproved) {
          this.addAuditLog('Ngoại lệ', `Chấp nhận nhập lô cận hạn cho PO ${poId}`, 'warn');
      }
    }

    // FR-NK-13: Kiểm tra hồ sơ pháp lý (Simulated)
    if (!batchData.hasCOA) {
      return { valid: false, message: 'Bắt buộc đính kèm COA cho lô hàng dược phẩm.' };
    }

    return { valid: true };
  },

  // --- FR-NK-03: Label Generation Simulation ---
  generateLabelData(batchId) {
    const b = _state.batches.find(x => x.BatchID === batchId);
    if (!b) return null;
    const p = this.PRODUCTS.find(x => x.ProductID === b.ProductID) || { ProductName: 'Unknown' };
    return {
      title: 'TEM NHÃN NHẬP KHO GSP',
      productName: p.ProductName,
      sku: b.ProductID,
      batch: b.Batchcode,
      expiry: b.ExpDate,
      qty: b.Quantity + ' ' + (p.BaseUnit || ''),
      location: b.LocationID,
      status: b.BatchStatus === 'QUARANTINE' ? 'BIỆT TRỮ (QUARANTINE)' : 'SẴN SÀNG',
      qrValue: `PHARMA-WMS|${b.BatchID}|${b.Batchcode}|${b.LocationID}`
    };
  },
  
  get DASHBOARD_STATS() {
    const batches = _state.batches || [];
    const pos = _state.purchaseOrders || [];
    const val = batches.reduce((acc, b) => acc + ((b.qty || 0) * (b.ImportPrice || 0)), 0);
    return {
      totalInventoryValue: val.toLocaleString('vi-VN') + ' VNĐ',
      quarantineBatches: batches.filter(b => {
          const st = String(b.BatchStatus || '').toUpperCase();
          return ['QUARANTINE', 'BIỆT TRỮ', 'CHỜ DUYỆT', 'AWAITING_APPROVAL', 'QC_PENDING'].includes(st);
      }).length,
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
  async addUser(userData) {
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

    // NocoDB Sync
    if (window.NocoBridge && window.NocoBridge.API_TOKEN !== 'YOUR_API_TOKEN_HERE') {
      try {
        const roleNameToId = {
            'SYSTEM_ADMIN': 'ROLE-01', 'WAREHOUSE_MANAGER': 'ROLE-02', 'WAREHOUSE_STAFF': 'ROLE-03',
            'DIRECTOR': 'ROLE-04', 'DRIVER': 'ROLE-05', 'SALES_STAFF': 'ROLE-06',
            'PROCUREMENT_STAFF': 'ROLE-07', 'QA_PHARMACIST': 'ROLE-08', 'QC_SPECIALIST': 'ROLE-09',
            'ACCOUNTANT': 'ROLE-10'
        };
        await window.NocoBridge.createRow('Users', {
            UserID: newUser.UserID,
            FullName: newUser.FullName,
            Email: newUser.username + '@pharmawms.com', // Fake email for NocoDB compatibility
            RoleID: roleNameToId[newUser.role] || 'ROLE-03'
        });
      } catch (e) { console.error('NocoDB user sync failed:', e); }
    }

    return newUser;
  },
  async updateUserRole(userId, newRole) {
    if (!_state.users) _state.users = JSON.parse(JSON.stringify(USERS));
    const user = _state.users.find(u => u.UserID === userId);
    if (!user) return false;
    const oldRole = user.role;
    user.role = newRole;
    saveState(_state);
    this.addAuditLog('Thay đổi quyền', `Người dùng ${user.username}: ${oldRole} → ${newRole}`, 'warn');
    this._emit('user:updated', { userId, newRole });

    // NocoDB Sync
    if (window.NocoBridge && window.NocoBridge.API_TOKEN !== 'YOUR_API_TOKEN_HERE') {
      try {
        const roleNameToId = {
            'SYSTEM_ADMIN': 'ROLE-01', 'WAREHOUSE_MANAGER': 'ROLE-02', 'WAREHOUSE_STAFF': 'ROLE-03',
            'DIRECTOR': 'ROLE-04', 'DRIVER': 'ROLE-05', 'SALES_STAFF': 'ROLE-06',
            'PROCUREMENT_STAFF': 'ROLE-07', 'QA_PHARMACIST': 'ROLE-08', 'QC_SPECIALIST': 'ROLE-09',
            'ACCOUNTANT': 'ROLE-10'
        };
        await window.NocoBridge.updateRow('Users', user.id || user.Id || userId, {
            RoleID: roleNameToId[newRole] || 'ROLE-03'
        });
      } catch (e) { console.error('NocoDB user update failed:', e); }
    }

    return true;
  },
  async deleteUser(userId) {
    if (!_state.users) _state.users = JSON.parse(JSON.stringify(USERS));
    const user = _state.users.find(u => u.UserID === userId);
    _state.users = _state.users.filter(u => u.UserID !== userId);
    saveState(_state);
    this.addAuditLog('Xóa người dùng', `Đã xóa ID ${userId}`, 'error');
    this._emit('user:deleted', { userId });

    // NocoDB Delete Sync (not implemented in Bridge yet, but using updateRow as placeholder if needed or skipping)
    // For now, users are usually just deactivated or we could add deleteRow to Bridge
    return true;
  },

  // ── Batch mutations ──────────────────────────────────────
  /** Cập nhật trạng thái lô hàng: QUARANTINE → RELEASED | LOCKED | DESTROYED */
  async updateBatchStatus(batchId, newStatus) {
    const b = _state.batches.find(x => x.BatchID === batchId);
    if (!b) return false;
    const oldStatus = b.BatchStatus;
    b.BatchStatus = newStatus;

    // FR-NK-09: Tự động tạo Phiếu xuất trả khi hàng bị gán nhãn lỗi (REJECT)
    if (newStatus === 'REJECT' || newStatus === 'LOCKED_FOR_RETURN') {
        const prod = this.PRODUCTS.find(p => p.ProductID === b.ProductID);
        await this.addComplaint({
            PO_ID: 'PO-AD-HOC',
            type: 'Lỗi chất lượng / Xuất trả',
            item: b.ProductID,
            qty: b.Quantity,
            desc: `Hàng lỗi phát hiện khi kiểm định lô ${b.Batchcode}. Chuyển luồng xuất trả NCC.`,
            request: 'Xuất trả và cấn trừ thanh toán'
        });
        this.addNotification(`Lô ${b.Batchcode} bị từ chối. Đã tự động lập Hồ sơ xuất trả NCC (FR-NK-09).`, 'error');
    }

    // Xóa tồn kho nếu tiêu hủy
    if (newStatus === 'DESTROYED') {
      b.Quantity = 0;
      this.addAuditLog('Tiêu hủy', `Đã xóa sổ tồn kho lô ${batchId} (FR-TH-12)`, 'error');
    }

    saveState(_state);
    this.addAuditLog('Kiểm định QA', `Lô ${batchId} → ${newStatus}`, 'success');
    this._emit('batch:updated', { batchId, newStatus });
    this._emit('pharma:statechange');

    // NocoDB Sync
    if (window.NocoBridge && window.NocoBridge.API_TOKEN !== 'YOUR_API_TOKEN_HERE') {
      try {
        const dbStatus = window.NocoMappers ? window.NocoMappers.fromUIStatus(newStatus) : newStatus;
        await window.NocoBridge.updateRow('Batches', b.nocoId || b.id || batchId, { BatchStatus: dbStatus, Quantity: b.Quantity });
      } catch (e) { console.error('NocoDB sync failed:', e); }
    }
    return true;
  },

  async confirmPutaway(batchId, newLocation) {
    const b = _state.batches.find(x => x.BatchID === batchId);
    if (!b) return false;
    
    const oldLoc = b.LocationID;
    b.LocationID = newLocation;
    b.BatchStatus = 'RELEASED';

    saveState(_state);
    this.addAuditLog('Nhân viên kho', `Cất hàng: Lô ${batchId} -> ${newLocation}`, 'success');
    this._emit('batch:updated', { batchId, newStatus: 'RELEASED' });
    this._emit('pharma:statechange');

    // NocoDB Sync
    if (window.NocoBridge && window.NocoBridge.API_TOKEN !== 'YOUR_API_TOKEN_HERE') {
      try {
        const dbStatus = window.NocoMappers ? window.NocoMappers.fromUIStatus('RELEASED') : 'RELEASED';
        await window.NocoBridge.updateRow('Batches', b.nocoId || b.id || batchId, { BatchStatus: dbStatus, LocationID: newLocation });
        await window.NocoBridge.updateRow('Inventory', b.nocoId || b.id || batchId, { LocationID: newLocation, BatchStatus: dbStatus }).catch(() => {});
      } catch (e) { console.error('NocoDB sync failed:', e); }
    }
    return true;
  },

  /** Thêm lô hàng mới vào kho (sau khi Nhân viên kho xác nhận nhập) */
  async addBatch({ ProductID, Batchcode, Quantity, ExpDate, LocationID, WarehouseID, COA_File, TempLog, flows }) {
    const BatchID = 'BATCH-' + (Date.now() % 10000).toString().padStart(3, '0');
    const newBatch = { 
        BatchID, 
        ProductID, 
        Batchcode, 
        Quantity: parseInt(Quantity), 
        ExpDate, 
        BatchStatus: 'QUARANTINE', 
        LocationID, 
        WarehouseID: WarehouseID || 'WH-HCM',
        // FR-NK-02 & 05 Additions
        COA_Attachment: COA_File || null,
        TemperatureLog: TempLog || [],
        FlowType: flows || 'REGULAR', // REGULAR, COLD, CONTROLLED
        InboundDate: new Date().toISOString()
    };
    
    _state.batches.push(newBatch);
    saveState(_state);
    this._emit('batch:added', { batch: newBatch });
    this.addAuditLog('Nhập kho', `Đã nhập lô ${Batchcode} vào vị trí ${LocationID}`, 'info');
    this.addNotification(`Lô ${Batchcode} đã nhập kho — đang chờ QA phê duyệt`, 'warning');

    // NocoDB Sync
    if (window.NocoBridge && window.NocoBridge.API_TOKEN !== 'YOUR_API_TOKEN_HERE') {
      try {
        const payload = { ...newBatch };
        if (window.NocoMappers) {
            payload.BatchStatus = window.NocoMappers.fromUIStatus('QUARANTINE');
        }
        const created = await window.NocoBridge.createRow('Batches', payload);
        if (created && (created.id || created.Id)) newBatch.nocoId = created.id || created.Id; 
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
        await window.NocoBridge.updateRow('Batches', b.nocoId || b.id || batchId, { LocationID: location });
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
            ProductID: item.ProductID,
            BatchID: item.BatchID
        };
        _state.issueDetails.push(detail);

        // Update Inventory/Batch Quantity locally (decrease Quantity and ReservedQty)
        const batch = _state.batches.find(b => b.BatchID === item.BatchID || b.id === item.batchInternalId);
        if (batch) {
            batch.Quantity = (batch.Quantity || 0) - item.ActualQty;
            batch.ReservedQty = Math.max(0, (batch.ReservedQty || 0) - item.ActualQty);
            batch.qty = batch.Quantity;
            
            // Sync to NocoDB
            if (window.NocoBridge && window.NocoBridge.API_TOKEN !== 'YOUR_API_TOKEN_HERE') {
                try {
                    await window.NocoBridge.updateRow('Batches', batch.id || batch.BatchID, { 
                        Quantity: batch.Quantity,
                        ReservedQty: batch.ReservedQty
                    });
                } catch (e) { console.error('NocoDB Update failed for batch:', batch.BatchID, e); }
            }
        }

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
            } catch (e) { console.error('NocoDB Create failed for item:', item.ProductID, e); }
        }
    }

    // 3. Update SO Status
    await this.updateSOStatus(soId, 'COMPLETED');
    
    saveState(_state);
    this.addAuditLog('Xuất kho', `Đã xuất kho cho đơn hàng ${soId}. IssueID: ${IssueID}`, 'success');
    this._emit('pharma:statechange');
    return newIssue;
  },

  /** Cập nhật SO */
  async updateSO(soId, data) {
    const so = _state.salesOrders.find(x => x.SO_ID === soId);
    if (!so) return false;
    if (data.CustomerID) so.CustomerID = data.CustomerID;
    if (data.deadline) so.deadline = data.deadline;
    if (data.priority) so.priority = data.priority;
    // FR-XK-02: Manage Reserved Stock on SO update
    if (data.itemsDetails) {
      // 1. Release old reservations
      (so.itemsDetails || []).forEach(item => {
          this._unreserveProduct(item.ProductID, item.OrderedQty);
      });
      // 2. Set new items and reserve
      so.itemsDetails = data.itemsDetails;
      so.itemsDetails.forEach(item => {
          this._reserveProduct(item.ProductID, item.OrderedQty);
      });
      so.progress = `0/${data.itemsDetails.length} SKU`;
    }
    saveState(_state);
    this.addAuditLog('Cập nhật SO', `Đã cập nhật đơn hàng ${soId}`, 'info');
    this.addNotification(`Đã cập nhật thông tin đơn hàng ${soId}`, 'info');
    this._emit('so:updated', { soId });
    this._emit('pharma:statechange');

    // NocoDB Sync
    if (window.NocoBridge && window.NocoBridge.API_TOKEN !== 'YOUR_API_TOKEN_HERE') {
      try {
        await window.NocoBridge.updateRow('Sales_Orders', so.id || soId, { 
            Priority: so.priority,
            DeliveryAddress: so.DeliveryAddress || ''
        });
      } catch (e) { console.error('NocoDB SO update failed:', e); }
    }

    return so;
  },

  /** FR-XK-02: Private helpers for reservation */
  _reserveProduct(productId, qty) {
      // Logic: Pick batches by FEFO (ExpDate asc) and reserve till qty met
      let remaining = qty;
      const batches = _state.batches
          .filter(b => b.ProductID === productId && b.BatchStatus === 'RELEASED')
          .sort((a, b) => new Date(a.ExpDate) - new Date(b.ExpDate));
      
      for (const b of batches) {
          if (remaining <= 0) break;
          const availableToReserve = b.Quantity - (b.ReservedQty || 0);
          const toReserve = Math.min(remaining, availableToReserve);
          b.ReservedQty = (b.ReservedQty || 0) + toReserve;
          remaining -= toReserve;
      }
  },

  _unreserveProduct(productId, qty) {
      let remaining = qty;
      const batches = _state.batches
          .filter(b => b.ProductID === productId)
          .sort((a, b) => new Date(b.ExpDate) - new Date(a.ExpDate)); // Release from furthest expiry first? Or doesn't matter much.
      
      for (const b of batches) {
          if (remaining <= 0) break;
          const toRelease = Math.min(remaining, b.ReservedQty || 0);
          b.ReservedQty = (b.ReservedQty || 0) - toRelease;
          remaining -= toRelease;
      }
  },

  async cancelSO(soId) {
    const so = _state.salesOrders.find(x => x.SO_ID === soId);
    if (!so || so.Status !== 'PICKING') return false;
    so.Status = 'CANCELLED';
    saveState(_state);
    this.addAuditLog('Hủy SO', `Đã hủy đơn hàng ${soId}`, 'warn');
    this.addNotification(`Đã hủy đơn hàng ${soId}`, 'warning');
    this._emit('so:updated', { soId });
    this._emit('pharma:statechange');
    
    // Remote NocoDB sync
    if (window.NocoBridge && window.NocoBridge.API_TOKEN !== 'YOUR_API_TOKEN_HERE') {
      try {
        window.NocoBridge.updateRow('Sales_Orders', so.id || soId, { Status: 'CANCELLED' });
      } catch (e) { console.error(e); }
    }
    
    return true;
  },

  async addSO({ CustomerID, region, priority, deadline, itemsDetails }) {
    const startNum = 100 + _state.salesOrders.length;
    const SO_ID = `SO-24-${String(startNum).padStart(3, '0')}`;
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

    // FR-XK-02: Reserve stock when SO is created
    (itemsDetails || []).forEach(item => {
        this._reserveProduct(item.ProductID, item.OrderedQty);
    });

    _state.salesOrders.unshift(so);
    saveState(_state);
    this._emit('so:added', { so });
    this._emit('pharma:statechange');
    this.addAuditLog('Lập SO', `Đã tạo đơn hàng ${SO_ID} cho khách ${CustomerID}`, 'info');
    this.addNotification(`Đơn hàng ${SO_ID} đã được tạo — chờ kho soạn hàng`, 'info');

    // NocoDB Sync with proper relations
    if (window.NocoBridge && window.NocoBridge.API_TOKEN !== 'YOUR_API_TOKEN_HERE') {
      try {
        let nocoCustId = null;
        let cName = (CustomerID || '').trim();
        
        // Find existing customer id
        const matchedCust = this.CUSTOMERS.find(c => (c.name || c.CustomerName || '').toLowerCase() === cName.toLowerCase());
        
        if (matchedCust && (matchedCust.id || matchedCust.Id)) {
            nocoCustId = matchedCust.id || matchedCust.Id;
        } else {
            // Create new customer if not exists
            const rngId = `CUST-${Math.floor(Math.random() * 900) + 100}`;
            const newCust = await window.NocoBridge.createRow('Customers', {
                CustomerName: cName,
                CustomerID: rngId,
                Status: 'Active'
            });
            if (newCust && newCust.Id) {
                nocoCustId = newCust.Id;
                this.CUSTOMERS.push({ id: newCust.Id, name: cName, CustomerID: rngId }); // update local cache
            }
        }

        // 1. Create SO Header
        const payloadSO = {
            SO_ID,
            OrderDate: new Date().toISOString().split('T')[0],
            DeliveryAddress: region || '',
            Priority: priority || 'NORMAL',
            Status: 'Mới',
            Customers_id: nocoCustId
        };
        
        // Default to IT User ID 9 or find Admin User
        const adminUser = this.USERS.find(u => u.role === 'SYSTEM_ADMIN' || u.role === 'SALES_STAFF');
        if (adminUser) payloadSO.Users_id = adminUser.id || adminUser.Id;

        const createdSO = await window.NocoBridge.createRow('Sales_Orders', payloadSO);
        if (createdSO && createdSO.Id) {
            so.id = createdSO.Id;
            
            // 2. Create SO Details (Items)
            for (const item of itemsDetails) {
                const prod = this.PRODUCTS.find(p => p.ProductID === item.ProductID);
                if (prod && (prod.id || prod.Id)) {
                    await window.NocoBridge.createRow('Sales_Order_Details', {
                        Sales_Orders_id: so.id,
                        Products_id: prod.id || prod.Id,
                        OrderedQty: item.OrderedQty || item.qty,
                        UnitPrice: item.UnitPrice || item.price || 0
                    });
                }
            }
        }
      } catch (e) { console.error('NocoDB SO sync failed:', e); }
    }
    return so;
  },

  // ── PO mutations ─────────────────────────────────────────
  async updatePOStatus(poId, newStatus) {
    const po = _state.purchaseOrders.find(x => x.PO_ID === poId);
    if (!po) return false;
    po.Status = newStatus;
    saveState(_state);

    // NocoDB Sync
    if (window.NocoBridge && window.NocoBridge.API_TOKEN !== 'YOUR_API_TOKEN_HERE') {
      try {
        await window.NocoBridge.updateRow('Purchase_Orders', po.id || poId, { Status: newStatus });
      } catch (e) { console.error('NocoDB PO status sync failed:', e); }
    }

    return true;
  },

  async updatePO(poId, data) {
    const po = _state.purchaseOrders.find(x => x.PO_ID === poId);
    if (!po) return false;
    if (data.expectedDate) po.expectedDate = data.expectedDate;
    if (data.note !== undefined) po.note = data.note;
    if (data.SupplierID) po.SupplierID = data.SupplierID;
    saveState(_state);
    this.addAuditLog('Cập nhật PO', `Đã cập nhật đơn mua hàng ${poId}`, 'info');
    this.addNotification(`Đã cập nhật thông tin đơn mua ${poId}`, 'info');
    this._emit('po:updated', { poId });

    // NocoDB Sync
    if (window.NocoBridge && window.NocoBridge.API_TOKEN !== 'YOUR_API_TOKEN_HERE') {
      try {
        await window.NocoBridge.updateRow('Purchase_Orders', po.id || poId, { 
            Note: po.note,
            SupplierID: po.SupplierID
        });
      } catch (e) { console.error('NocoDB PO update failed:', e); }
    }

    return po;
  },

  async cancelPO(poId) {
    const po = _state.purchaseOrders.find(x => x.PO_ID === poId);
    if (!po || po.Status !== 'PENDING') return false;
    po.Status = 'CANCELLED';
    saveState(_state);
    this.addAuditLog('Hủy PO', `Đã hủy đơn mua hàng ${poId}`, 'warn');
    this.addNotification(`Đã hủy đơn mua hàng ${poId}`, 'warning');
    this._emit('po:updated', { poId });

    // NocoDB Sync
    if (window.NocoBridge && window.NocoBridge.API_TOKEN !== 'YOUR_API_TOKEN_HERE') {
      try {
        await window.NocoBridge.updateRow('Purchase_Orders', po.id || poId, { Status: 'Đã hủy' });
      } catch (e) { console.error('NocoDB PO cancel failed:', e); }
    }

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

  async updatePOReceived(poId, receivedQty, productId, batchId) {
    const po = _state.purchaseOrders.find(x => x.PO_ID === poId);
    if (!po) return false;
    
    // 1. Cập nhật chi tiết từng sản phẩm trong PO
    if (productId && po.itemsDetails) {
      const item = po.itemsDetails.find(it => it.ProductID === productId);
      if (item) {
        const prevItemRec = item.ReceivedQty || 0;
        item.ReceivedQty = Math.min(item.OrderedQty || 0, prevItemRec + parseInt(receivedQty));
      }
    }

    // 2. Tính lại tổng số lượng đã nhận của PO
    if (po.itemsDetails && po.itemsDetails.length > 0) {
      po.received = po.itemsDetails.reduce((sum, it) => sum + (it.ReceivedQty || 0), 0);
      po.total = po.itemsDetails.reduce((sum, it) => sum + (it.OrderedQty || 0), 0);
    } else {
      const prevReceived = po.received || 0;
      po.received = Math.min(po.total, prevReceived + parseInt(receivedQty));
    }
    
    // 3. Cập nhật trạng thái PO
    if (po.received < po.total) {
        po.Status = 'PARTIAL';
        this.addNotification(`Đơn ${poId} nhập thiếu. Đã ghi nhận trạng thái PARTIAL (FR-NK-08).`, 'warning');
        this.addAuditLog('Nhập kho', `PO ${poId} nhập một phần: ${po.received}/${po.total}`, 'warn');
    } else {
        po.Status = 'COMPLETED'; // Sửa từ QUARANTINE sang COMPLETED
    }

    // 4. Tạo bản ghi Phiếu nhập (Goods Receipt) để đồng bộ dữ liệu
    const receiptId = 'GRN-' + (Date.now() % 10000).toString().padStart(4, '0');
    const newReceipt = {
        ReceiptID: receiptId,
        PO_ID: poId,
        ReceiptDate: new Date().toISOString().split('T')[0],
        Status: 'COMPLETED'
    };
    if (!_state.goodsReceipts) _state.goodsReceipts = [];
    _state.goodsReceipts.push(newReceipt);

    const newDetail = {
        DetailID: 'GRD-' + (Date.now() % 100000).toString().padStart(5, '0'),
        ReceiptID: receiptId,
        ProductID: productId || '',
        BatchID: batchId || '',
        ActualQty: parseInt(receivedQty)
    };
    if (!_state.receiptDetails) _state.receiptDetails = [];
    _state.receiptDetails.push(newDetail);
    
    saveState(_state);
    this._emit('po:updated', { poId });

    // NocoDB Sync
    if (window.NocoBridge && window.NocoBridge.API_TOKEN !== 'YOUR_API_TOKEN_HERE') {
      try {
        const dbStatus = window.NocoMappers ? window.NocoMappers.fromUIStatus(po.Status) : po.Status;
        await window.NocoBridge.updateRow('Purchase_Orders', po.id || poId, { 
          received: po.received, 
          Status: dbStatus 
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
      Status: 'AWAITING_APPROVAL',
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
  async addComplaint({ PO_ID, type, item, qty, desc, request }) {
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

    // NocoDB Sync
    if (window.NocoBridge && window.NocoBridge.API_TOKEN !== 'YOUR_API_TOKEN_HERE') {
      try {
        const payload = {
            PO_ID: PO_ID,
            ProductID: item,
            Quantity: parseInt(qty) || 0,
            Description: desc,
            ResolutionRequest: request,
            Status: 'Mới gửi'
        };
        // Link with internal PO ID if possible
        if (po && (po.id || po.Id)) payload.Purchase_Orders_id = po.id || po.Id;
        
        await window.NocoBridge.createRow('QC_Requests', payload);
      } catch (e) { console.error('NocoDB complaint sync failed:', e); }
    }

    return complaint;
  },

  // ── Approval mutations ───────────────────────────────────
  async updateApproval(apvId, decision, comment) {
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

    // NocoDB Sync
    if (window.NocoBridge && window.NocoBridge.API_TOKEN !== 'YOUR_API_TOKEN_HERE') {
      try {
        // Find which table to update based on type
        // This is a generic approval, but often it's a PO or QC result
        if (a.isPO) {
            await window.MockData.approvePO(apvId);
        } else {
            // Update the record in NocoDB directly if it has an internal ID
            const nInternalId = a.id || a.Id || apvId;
            // Assuming approvals are mapped to 'QC_Requests' or similar for generic ones
            // For now, most dashboard approvals are POs which are handled above
        }
      } catch (e) { console.error('NocoDB approval sync failed:', e); }
    }

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
  async addStockCheck(checkData) {
    if (!_state.stockChecks) _state.stockChecks = [];
    const CheckID = `SC-${new Date().getFullYear()}${(Date.now() % 10000).toString().padStart(4, '0')}`;
    const newCheck = {
      CheckID,
      CheckDate: new Date().toISOString().split('T')[0],
      Status: 'PENDING',
      Filters: checkData.Filters || {}, // FR-KK-01: Store filters
      ...checkData
    };

    // FR-KK-02: Lock batches included in the check
    if (newCheck.items) {
        newCheck.items.forEach(item => {
            const batch = _state.batches.find(b => b.ProductID === item.ProductID && b.Batchcode === item.Batchcode);
            if (batch) {
                batch._prevStatus = batch.BatchStatus; // Store old status
                batch.BatchStatus = 'LOCKED';
            }
        });
    }

    _state.stockChecks.unshift(newCheck);
    saveState(_state);
    this._emit('stockCheck:added', { check: newCheck });
    this.addAuditLog('Kiểm kê', `Tạo phiếu kiểm kê mới ${CheckID}`, 'info');

    // NocoDB Sync
    if (window.NocoBridge && window.NocoBridge.API_TOKEN !== 'YOUR_API_TOKEN_HERE') {
      try {
        const created = await window.NocoBridge.createRow('Inventory_Checks', {
            CheckID: newCheck.CheckID,
            CheckDate: newCheck.CheckDate,
            Status: 'PENDING'
        });
        if (created && created.Id) {
            newCheck.id = created.Id;
            // Sync details
            if (newCheck.items) {
                for (const item of newCheck.items) {
                    await window.NocoBridge.createRow('Check_Details', {
                        Inventory_Checks_id: created.Id,
                        ProductID: item.ProductID,
                        Batchcode: item.Batchcode,
                        BookQuantity: item.BookQuantity,
                        ActualQuantity: item.ActualQuantity || 0
                    });
                }
            }
        }
      } catch (e) { console.error('NocoDB stock check sync failed:', e); }
    }

    return newCheck;
  },

  async updateStockCheckStatus(CheckID, status) {
    const check = _state.stockChecks.find(c => c.CheckID === CheckID);
    if (!check) return false;
    check.Status = status;

    if (status === 'COMPLETED') {
      let changed = false;
      const updates = [];
      const drugsToAlert = ['SKU-PFIZ-01', 'SKU-INSU-05']; // Control drugs

      for (const item of check.items) {
        if (item.ActualQuantity !== item.BookQuantity) {
          const batch = _state.batches.find(b => b.ProductID === item.ProductID && b.Batchcode === item.Batchcode);
          if (batch) {
            batch.Quantity = item.ActualQuantity;
            changed = true;
            updates.push({ id: batch.id || batch.BatchID, qty: item.ActualQuantity });

            // FR-KK-12: Kích hoạt báo động đỏ nếu lệch kho thuốc kiểm soát đặc biệt
            if (drugsToAlert.includes(item.ProductID)) {
                this.addNotification(`🚨 BÁO ĐỘNG ĐỎ: Sai lệch kho thuốc kiểm soát đặc biệt (${item.ProductID}). Yêu cầu báo cáo điều tra trong 24h!`, 'error');
                this.addAuditLog('BÁO ĐỘNG', `Sai lệch thuốc kiểm soát ${item.ProductID} tại phiếu ${CheckID}`, 'error');
            }
          }
        }
      }
      
      if (changed) {
        this.addAuditLog('Điều chỉnh tồn kho', `Đã điều chỉnh tồn kho theo phiếu kiểm kê ${CheckID}`, 'warn');
        this._emit('pharma:statechange');
        
        // Sync Batch updates to NocoDB
        if (window.NocoBridge && window.NocoBridge.API_TOKEN !== 'YOUR_API_TOKEN_HERE') {
            for (const up of updates) {
                await window.NocoBridge.updateRow('Batches', up.id, { Quantity: up.qty }).catch(() => {});
            }
        }
      }

      // FR-KK-02: Unlock batches
      check.items.forEach(item => {
          const batch = _state.batches.find(b => b.ProductID === item.ProductID && b.Batchcode === item.Batchcode);
          if (batch && batch.BatchStatus === 'LOCKED') {
              batch.BatchStatus = batch._prevStatus || 'RELEASED';
              delete batch._prevStatus;
          }
      });
    } else if (status === 'CANCELLED') {
        // Unlock batches on cancellation
        (check.items || []).forEach(item => {
            const batch = _state.batches.find(b => b.ProductID === item.ProductID && b.Batchcode === item.Batchcode);
            if (batch && batch.BatchStatus === 'LOCKED') {
                batch.BatchStatus = batch._prevStatus || 'RELEASED';
                delete batch._prevStatus;
            }
        });
    }

    saveState(_state);
    this._emit('stockCheck:updated', { CheckID, status });

    // Sync Status to NocoDB
    if (window.NocoBridge && window.NocoBridge.API_TOKEN !== 'YOUR_API_TOKEN_HERE') {
      try {
        await window.NocoBridge.updateRow('Inventory_Checks', check.id || CheckID, { Status: status });
      } catch (e) { console.error('NocoDB status update failed:', e); }
    }

    return true;
  },

  // --- FR-QC-10: Emergency Lockdown ---
  async activateEmergencyLockdown(targetId, reason) {
      this.addAuditLog('PHONG TỎA KHẨN CẤP', `Kích hoạt lệnh phong tỏa cho ${targetId}. Lý do: ${reason}`, 'error');
      
      // Lock all transactions in 30 seconds (simulated)
      this._systemLocked = true;
      setTimeout(() => { this._systemLocked = false; }, 30000);

      const targetBatches = _state.batches.filter(b => b.Batchcode === targetId || b.ProductID === targetId);
      targetBatches.forEach(b => {
          b.BatchStatus = 'LOCKED';
      });

      saveState(_state);
      this._emit('pharma:statechange');
      this.addNotification(`🚨 LỆNH PHONG TỎA KHẨN CẤP (30S): Đã khóa toàn bộ giao dịch cho ${targetId}.`, 'error');
      return true;
  },

  // --- FR-XK-05: Barcode Scanning with Lockout ---
  validateBarcode(scanned, expected) {
      if (this._scanLocked) return { valid: false, message: 'Thao tác bị khóa 10 giây do quét sai liên tục.' };
      
      if (scanned === expected) return { valid: true };

      // Fail logic
      this._scanFails = (this._scanFails || 0) + 1;
      if (this._scanFails >= 3) {
          this._scanLocked = true;
          setTimeout(() => { this._scanLocked = false; this._scanFails = 0; }, 10000);
          return { valid: false, message: 'Sai mã vạch 3 lần. Khóa thao tác 10 giây (FR-XK-05).' };
      }
      return { valid: false, message: 'Sai mã vạch. Vui lòng kiểm tra lại.' };
  },

  // --- FR-SYS-02: Unit Conversion ---
  convertUnit(qty, fromUnit, toUnit, productId) {
      // Simplified rules: Thùng = 10 Hộp, Hộp = 30 Viên
      const rules = {
          'THÙNG-HỘP': 10,
          'HỘP-VIÊN': 30,
          'THÙNG-VIÊN': 300
      };
      const key = `${fromUnit.toUpperCase()}-${toUnit.toUpperCase()}`;
      if (rules[key]) return qty * rules[key];
      
      const revKey = `${toUnit.toUpperCase()}-${fromUnit.toUpperCase()}`;
      if (rules[revKey]) return qty / rules[revKey];

      return qty;
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
    try {
      console.log('Syncing with NocoDB...');
      
      // FR-XK-14: Implement Sales Return
      this.addSalesReturn = async function(soId, items) {
          const id = `RET-${Date.now().toString().slice(-6)}`;
          for (const item of items) {
              const BatchID = `BATCH-RET-${Date.now().toString().slice(-4)}`;
              const newBatch = {
                  BatchID,
                  ProductID: item.ProductID,
                  Batchcode: item.Batchcode || 'RETURNED',
                  Quantity: item.Quantity,
                  ReservedQty: 0,
                  ExpDate: item.ExpDate || '2099-12-31',
                  BatchStatus: 'LOCKED', // Returns go to Locked first
                  LocationID: 'RETURN-ZONE',
                  warehouseId: 'WH-HCM'
              };
              _state.batches.push(newBatch);
          }
          saveState(_state);
          this.addAuditLog('Nhập trả hàng', `Đã xử lý nhập trả hàng cho đơn ${soId}`, 'warn');
          this._emit('pharma:statechange');
          return id;
      };

      // FR-XK-08: Export SO Documents
      this.exportSODocument = function(soId, docType) {
          const so = _state.salesOrders.find(s => s.SO_ID === soId);
          if (!so) return;
          const content = `PHARMA WMS - ${docType.toUpperCase()}\nOrder ID: ${so.SO_ID}\nCustomer: ${so.CustomerID}\nDate: ${so.OrderDate}\nItems: ${so.itemsDetails.length}\n${'-'.repeat(40)}\n` +
              so.itemsDetails.map(i => `${i.ProductID}: ${i.OrderedQty} @ ${i.UnitPrice}`).join('\n');
          const blob = new Blob([content], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${docType}_${soId}.txt`;
          link.click();
          this.addAuditLog('Xuất chứng từ', `Đã xuất ${docType} cho đơn ${soId}`, 'info');
      };
      
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
              
              base.total = poDetailsForThisPO.reduce((acc, d) => acc + parseFloat(d.OrderedQty || 0), 0);
              base.totalItems = poDetailsForThisPO.length;
              base.totalValue = poDetailsForThisPO.reduce((acc, d) => acc + (parseFloat(d.OrderedQty || 0) * parseFloat(d.UnitPrice || 0)), 0);

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
                      .reduce((acc, rd) => acc + parseFloat(rd.ActualQty || rd.qty || 0), 0);

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

              // 4. Robust Received Logic: Fallback to PO's own column if no receipts found
              const nocoReceived = parseFloat(p.ReceivedQty || p.received || p.received_qty || 0);
              base.received = (totalRealReceived > 0) ? totalRealReceived : nocoReceived;

              // 5. Status Sync: Use a very broad check for 'Completed'
              const rawStat = String(window.NocoMappers._flatten(p.Status || p.status) || '').toUpperCase().trim();
              const isCompleted = ['HOÀN TẤT', 'DONE', 'COMPLETED', 'ĐÃ HOÀN THÀNH', 'HOÀN THÀNH'].includes(rawStat) || base.Status === 'COMPLETED';
              
              if (fullyReceivedCount === base.totalItems && base.totalItems > 0) {
                  base.Status = 'COMPLETED';
                  base.received = base.total; 
              } else if (isCompleted) {
                  base.Status = 'COMPLETED';
                  // Force received = total for completed orders to fix UI logic mismatch
                  if (base.received < base.total) {
                      base.received = base.total;
                  }
              } else if (base.received > 0 && base.received < base.total) {
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
              
              base.total = soDetailsForThisSO.reduce((acc, d) => acc + parseFloat(d.OrderedQty || d.qty || 0), 0);
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
                .reduce((acc, id) => acc + parseFloat(id.ActualQty || id.qty || 0), 0);

              base.issued = issuedFromDetails;
              base.progressPct = base.total > 0 ? Math.round((base.issued / base.total) * 100) : 0;
              base.progress = `${base.issued.toLocaleString()}/${base.total.toLocaleString()} đơn vị`;

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
          console.log(`Đã đồng bộ thành công ${totalItems} lô hàng từ NocoDB!`);
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

