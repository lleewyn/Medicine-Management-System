/**
 * PHARMA WMS - ROUTER
 * Điều hướng giữa các trang mà không reload browser
 */

const Router = {
  // Định nghĩa tất cả các trang trong hệ thống
  routes: {
    'dashboard': { title: 'Bảng điều khiển', file: 'pages/dashboard.html' },
    'inventory-management': { title: 'Quản lý kho hàng', file: 'pages/inventory-management.html' },
    'inbound': { title: 'Quản lý Nhập kho', file: 'pages/inbound.html' },
    'outbound': { title: 'Quản lý Xuất kho', file: 'pages/outbound.html' },
    'qa-dashboard': { title: 'QA/QC Dashboard', file: 'pages/qa-dashboard.html' },
    'qa-approval': { title: 'Duyệt lô hàng', file: 'pages/qa-approval.html' },
    'qa-pending': { title: 'Đang chờ kiểm định', file: 'pages/qa-pending.html' },
    'qa-recall': { title: 'Thu hồi / Tiêu hủy', file: 'pages/qa-recall.html' },
    'qa-reports': { title: 'Báo cáo QA/QC', file: 'pages/qa-reports.html' },
    'purchase-order': { title: 'Quản lý Nhập hàng', file: 'pages/purchase-order.html' },
    'sales-order': { title: 'Quản lý Xuất hàng', file: 'pages/sales-order.html' },
    'accounting': { title: 'Kế toán kho', file: 'pages/accounting.html' },
    'delivery': { title: 'Xác nhận Giao hàng', file: 'pages/delivery.html' },
    'user-management': { title: 'Phân quyền người dùng', file: 'pages/user-management.html' },
  },

  currentPage: null,

  /** Khởi động router — lắng nghe thay đổi hash URL */
  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    this.handleRoute(); // Xử lý trang hiện tại ngay khi load
  },

  /** Xử lý điều hướng */
  async handleRoute() {
    const user = window.Auth.getCurrentUser();
    if (!user) return;

    // Lấy pageId từ URL hash (ví dụ: #dashboard → 'dashboard')
    const hash = window.location.hash.replace('#', '') || 'dashboard';
    const route = this.routes[hash];

    if (!route) {
      this.renderError('Trang không tồn tại');
      return;
    }

    // Kiểm tra quyền truy cập
    if (!window.MockData.canAccessPage(user, hash)) {
      this.renderAccessDenied(route.title);
      return;
    }

    // Load và render nội dung trang
    await this.loadPage(hash, route);
  },

  /** Load HTML content từ file pages/ */
  async loadPage(pageId, route) {
    const contentEl = document.getElementById('page-content');
    if (!contentEl) return;

    // Hiện loading spinner
    contentEl.innerHTML = `
      <div class="flex items-center justify-center h-64">
        <div class="flex flex-col items-center gap-3 text-slate-400">
          <span class="material-symbols-outlined animate-spin text-4xl text-primary">refresh</span>
          <span class="text-sm">Đang tải...</span>
        </div>
      </div>
    `;

    try {
      const response = await fetch(route.file + '?v=' + Date.now());
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const html = await response.text();
      contentEl.innerHTML = html;

      // Cập nhật title trang
      document.title = `${route.title} — PharmaWMS`;

      // Cập nhật active state trên menu
      this.updateMenuActive(pageId);
      this.currentPage = pageId;

      // Kích hoạt bất kỳ script nào trong page content
      contentEl.querySelectorAll('script').forEach(oldScript => {
        const newScript = document.createElement('script');
        newScript.textContent = oldScript.textContent;
        document.body.appendChild(newScript);
        oldScript.remove();
      });

    } catch (err) {
      console.error('Router: Không thể load trang', route.file, err);
      contentEl.innerHTML = `
        <div class="flex items-center justify-center h-64">
          <div class="flex flex-col items-center gap-3 text-slate-400">
            <span class="material-symbols-outlined text-4xl text-red-400">error</span>
            <span class="text-sm font-medium text-red-500">Không thể tải trang "${route.title}"</span>
            <span class="text-xs text-slate-400">File: ${route.file}</span>
          </div>
        </div>
      `;
    }
  },

  /** Render trang "Không có quyền" */
  renderAccessDenied(pageName) {
    const user = window.Auth.getCurrentUser();
    const role = window.MockData.getUserRole(user);
    document.getElementById('page-content').innerHTML = `
      <div class="flex items-center justify-center h-full min-h-[400px]">
        <div class="text-center max-w-md p-8">
          <div class="size-20 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-6">
            <span class="material-symbols-outlined text-4xl text-red-500">lock</span>
          </div>
          <h2 class="text-2xl font-black text-slate-900 mb-2">Không có quyền truy cập</h2>
          <p class="text-slate-500 mb-1">Trang <strong>${pageName}</strong> không dành cho vai trò của bạn.</p>
          <p class="text-sm text-slate-400 mb-6">Vai trò hiện tại: <span class="font-bold" style="color: ${role?.color}">${role?.label}</span></p>
          <button onclick="window.location.hash='dashboard'" 
            class="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-primary/90 transition-colors">
            Về Trang Chủ
          </button>
        </div>
      </div>
    `;
    document.title = `Không có quyền — PharmaWMS`;
    this.updateMenuActive(null);
  },

  /** Render trang lỗi */
  renderError(message) {
    document.getElementById('page-content').innerHTML = `
      <div class="flex items-center justify-center h-64">
        <div class="text-center text-slate-400">
          <span class="material-symbols-outlined text-4xl mb-2">error</span>
          <p>${message}</p>
        </div>
      </div>
    `;
  },

  /** Cập nhật trạng thái active trên menu sidebar */
  updateMenuActive(activePageId) {
    document.querySelectorAll('[data-page]').forEach(link => {
      const pageId = link.getAttribute('data-page');
      if (pageId === activePageId) {
        link.classList.add('bg-primary/10', 'text-primary');
        link.classList.remove('text-slate-600', 'hover:bg-slate-50');
      } else {
        link.classList.remove('bg-primary/10', 'text-primary');
        link.classList.add('text-slate-600', 'hover:bg-slate-50');
      }
    });
  },

  /** Navigate đến trang (dùng từ bên ngoài) */
  navigate(pageId) {
    window.location.hash = pageId;
  }
};

window.Router = Router;
