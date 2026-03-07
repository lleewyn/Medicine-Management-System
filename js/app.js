/**
 * PHARMA WMS - APP ENTRY POINT
 * Khởi chạy toàn bộ ứng dụng sau khi DOM sẵn sàng
 */

const App = {
    async init() {
        const user = window.Auth.requireLogin();
        if (!user) return;

        // Thử đồng bộ với NocoDB trước khi render
        if (window.MockData && window.MockData.syncWithNoco) {
            await window.MockData.syncWithNoco();
        }

        const role = window.MockData.getUserRole(user);
        if (!role) { window.Auth.logout(); return; }

        // Render thông tin user lên header/sidebar
        this.renderUserInfo(user, role);

        // Build menu theo role
        this.buildMenu(user, role);

        // Khởi động router
        window.Router.init();
    },

    renderUserInfo(user, role) {
        // Avatar
        document.querySelectorAll('[data-user="avatar"]').forEach(el => {
            if (el.tagName === 'IMG') el.src = user.avatar;
            else el.style.backgroundImage = `url('${user.avatar}')`;
        });
        // Tên
        document.querySelectorAll('[data-user="name"]').forEach(el => el.textContent = user.FullName);
        // Chức danh
        document.querySelectorAll('[data-user="title"]').forEach(el => el.textContent = user.title);
        // Role badge
        document.querySelectorAll('[data-user="role"]').forEach(el => {
            el.textContent = role.label;
            el.style.color = role.color;
        });
    },

    buildMenu(user, role) {
        const menuEl = document.getElementById('sidebar-menu');
        if (!menuEl) return;

        // Định nghĩa toàn bộ menu items theo thứ tự
        const menuItems = [
            { page: 'dashboard', icon: 'dashboard', label: 'Bảng điều khiển' },
            { separator: 'Kho hàng' },
            { page: 'inventory-management', icon: 'inventory_2', label: 'Tổng hợp kho' },
            { page: 'inbound', icon: 'login', label: 'Nhập kho' },
            { page: 'outbound', icon: 'logout', label: 'Xuất kho' },
            { separator: 'Kiểm soát chất lượng' },
            { page: 'qa-dashboard', icon: 'verified_user', label: 'QA/QC Dashboard' },
            { page: 'qa-approval', icon: 'task_alt', label: 'Duyệt lô hàng' },
            { page: 'qa-pending', icon: 'pending_actions', label: 'Chờ kiểm định' },
            { page: 'qa-recall', icon: 'remove_shopping_cart', label: 'Thu hồi / Tiêu hủy' },
            { page: 'qa-reports', icon: 'description', label: 'Báo cáo QA' },
            { separator: 'Đơn hàng & Mua hàng' },
            { page: 'purchase-order', icon: 'receipt_long', label: 'Nhập hàng (PO)' },
            { page: 'sales-order', icon: 'shopping_cart', label: 'Xuất hàng (SO)' },
            { separator: 'Vận chuyển' },
            { page: 'delivery', icon: 'local_shipping', label: 'Xác nhận giao hàng' },
            { separator: 'Tài chính' },
            { page: 'accounting', icon: 'account_balance', label: 'Kế toán kho' },
            { separator: 'Hệ thống' },
            { page: 'user-management', icon: 'manage_accounts', label: 'Phân quyền người dùng' },
        ];

        let html = '';

        menuItems.forEach(item => {
            if (item.separator) {
                html += `<div class="px-3 pt-5 pb-1">
          <p class="text-[9px] font-bold uppercase tracking-widest text-slate-400">${item.separator}</p>
        </div>`;
                return;
            }

            const hasAccess = window.MockData.canAccessPage(user, item.page);
            if (!hasAccess) {
                // Hiển thị mờ (disabled) — không ẩn hoàn toàn, để user biết chức năng tồn tại
                html += `
          <a class="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 cursor-not-allowed select-none"
             title="Bạn không có quyền truy cập" data-disabled="true">
            <span class="material-symbols-outlined text-[20px]">${item.icon}</span>
            <span class="text-sm font-medium flex-1">${item.label}</span>
            <span class="material-symbols-outlined text-xs text-slate-300">lock</span>
          </a>`;
                return;
            }

            html += `
        <a href="#${item.page}" data-page="${item.page}"
           class="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
          <span class="material-symbols-outlined text-[20px]">${item.icon}</span>
          <span class="text-sm font-medium flex-1">${item.label}</span>
        </a>`;
        });

        menuEl.innerHTML = html;
    }
};

// Khởi chạy khi DOM ready
document.addEventListener('DOMContentLoaded', () => App.init());
window.App = App;
