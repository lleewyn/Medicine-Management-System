<div align="center">
  <h1>💊 PharmaWMS</h1>
  <p><b>Hệ Thống Quản Lý Kho Dược Chuẩn GSP - Hiện Đại, Chuyên Nghiệp, Chính Xác</b></p>

  [![Vercel Deployment](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://pharma-wms.vercel.app/)
  [![Technology](https://img.shields.io/badge/Stack-Vanilla%20JS%20|%20Tailwind-blue?style=for-the-badge)](https://github.com/)
  [![Database](https://img.shields.io/badge/Backend-NocoDB-green?style=for-the-badge)](https://nocodb.com/)
</div>

---

## 🌟 Giới Thiệu
**PharmaWMS** (Pharmaceutical Warehouse Management System) là nền tảng quản trị kho dược phẩm được thiết kế nhằm tối ưu hóa quy trình vận hành từ khâu nhập kho, kiểm định (QA/QC) đến xuất kho và phân phối. Hệ thống tuân thủ nghiêm ngặt các tiêu chuẩn **GSP (Good Storage Practice)** trong ngành dược.

## 🚀 Tính Năng Cốt Lõi

### 📊 1. Quản Trị Hệ Thống (Dashboard)
- Theo dõi chỉ số tồn kho, đơn hàng đang xử lý và biểu đồ biến động theo thời gian thực.
- Cảnh báo các lô hàng sắp hết hạn hoặc tồn kho thấp.

### 🧪 2. Kiểm Định Chất Lượng (QA/QC)
- Quy trình duyệt lô hàng nghiêm ngặt (Pending → Released / Rejected).
- Quản lý lịch sử kiểm định, thu hồi và tiêu hủy thuốc không đạt chuẩn.

### 📦 3. Quản Lý Kho & Vị Trí
- Quản lý tồn kho chi tiết theo từng số Lô (Batch) và Hạn sử dụng (Exp Date).
- Sơ đồ vị trí kệ hàng (Bin/Location) giúp tối ưu hóa việc lấy hàng (Picking).

### 📝 4. Chuỗi Cung Ứng (PO & SO)
- **Purchase Orders (PO):** Quản lý đơn nhập từ nhà cung cấp, đối soát hàng thực nhận.
- **Sales Orders (SO):** Quản lý đơn xuất cho nhà thuốc, bệnh viện.

### 🔐 5. Phân Quyền Người Dùng
- Phân quyền chi tiết: **Thủ kho, Nhân viên QA, Kế toán, Quản lý.**
- Giao diện tùy chỉnh phù hợp với từng vai trò.

## 🛠️ Công Nghệ Sử Dụng

| Thành phần | Công nghệ |
| :--- | :--- |
| **Frontend** | HTML5, Tailwind CSS, Vanilla JavaScript |
| **Backend/DB** | [NocoDB](https://nocodb.com/) (Open-source Airtable alternative) |
| **Icons** | Material Symbols, Icons8 |
| **Deployment** | Vercel |

## 📐 Kiến Trúc Hệ Thống

Hệ thống được thiết kế theo mô hình **Single Page Application (SPA)** tối giản nhưng hiệu quả:
- **Router:** Điều hướng trang không tải lại (Client-side routing).
- **NocoBridge:** Module kết nối trực tiếp với API của NocoDB, đảm bảo đồng bộ dữ liệu thời gian thực.
- **MockData Engine:** Cho phép thử nghiệm quy trình mà không cần database thật (trong chế độ test).

## 📂 Cấu Trúc Thư Mục
```text
├── assets/          # Hình ảnh, icon, font
├── auth/            # Xử lý đăng nhập, phân quyền
├── js/
│   ├── app.js       # Logic khởi tạo toàn cục
│   ├── noco_bridge.js # Bridge kết nối NocoDB
│   ├── router.js    # Hệ thống điều hướng SPA
│   └── mock_data.js  # Dữ liệu mẫu & cấu hình quyền
├── pages/           # Template nội dung các trang nội bộ
└── index.html       # File entry chính
```

## 💻 Cài Đặt & Phát Triển

1. **Clone project:**
   ```bash
   git clone https://github.com/your-username/PharmaWMS.git
   ```
2. **Cấu hình NocoDB:**
   - Tạo Project trên NocoDB.
   - Sao chép API Token và Base ID vào file `js/noco_bridge.js`.
3. **Chạy local:**
   - Sử dụng **Live Server** (VScode Extension) hoặc chạy `npx serve`.

---

<div align="center">
  <p>Phát triển bởi <b>Team 3</b></p>
  <p><i>"Chính xác trong từng viên thuốc - Chuyên nghiệp trong từng quy trình"</i></p>
</div>
