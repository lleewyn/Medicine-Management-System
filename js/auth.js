/**
 * PHARMA WMS - AUTH MODULE
 * Xử lý đăng nhập, session, và bảo vệ trang
 */

const Auth = {
    SESSION_KEY: 'pharmaWMS_currentUser',

    /** Lưu user vào session sau khi đăng nhập thành công */
    login(user) {
        // Không lưu password vào session
        const safeUser = { ...user };
        delete safeUser.password;
        sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(safeUser));
    },

    /** Đăng xuất */
    logout() {
        sessionStorage.removeItem(this.SESSION_KEY);
        window.location.href = '/auth/login.html';
    },

    /** Lấy thông tin user đang đăng nhập */
    getCurrentUser() {
        const raw = sessionStorage.getItem(this.SESSION_KEY);
        return raw ? JSON.parse(raw) : null;
    },

    /** Kiểm tra đã đăng nhập chưa — nếu chưa thì redirect về login */
    requireLogin() {
        const user = this.getCurrentUser();
        if (!user) {
            window.location.href = '/auth/login.html';
            return null;
        }
        return user;
    },

    /** Kiểm tra user có quyền vào trang không */
    requirePage(pageId) {
        const user = this.requireLogin();
        if (!user) return null;

        if (!window.MockData.canAccessPage(user, pageId)) {
            return null; // Caller sẽ hiển thị trang "Không có quyền"
        }
        return user;
    }
};

window.Auth = Auth;
