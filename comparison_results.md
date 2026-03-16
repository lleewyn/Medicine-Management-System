# Báo cáo Đối soát Yêu cầu Chức năng (Functional Requirements Comparison)

Báo cáo này liệt kê các yêu cầu chức năng (FR) chưa được triển khai hoặc chỉ được triển khai một phần trong hệ thống hiện tại, dựa trên phân tích mã nguồn (`mock_data.js` và các trang trong thư mục `pages/`).

## 1. Quản lý nhập kho (FR-NK)

| Mã số            | Yêu cầu                                | Trạng thái        | Chi tiết thiếu sót                                                                                                                      |
| :----------------- | :--------------------------------------- | :------------------ | :----------------------------------------------------------------------------------------------------------------------------------------- |
| **FR-NK-01** | Tra cứu và đối soát chứng từ gốc | Một phần          | Chưa có logic tự động phân loại luồng hàng; chưa chặn nhập nếu chứng từ đã đóng (chúng ta mới chỉ có UI chọn PO).  |
| **FR-NK-02** | Ghi nhận dữ liệu nhập kho chi tiết  | Một phần          | Thiếu chức năng đính kèm file COA; chưa có logic chặn nhập nếu Hạn dùng < 12 tháng (hiện tại chỉ nhập liệu thủ công). |
| **FR-NK-03** | Quản lý in tem nhãn nhập kho         | **Chưa có** | Hoàn toàn chưa triển khai tích hợp máy in tem nhãn (Barcode/QR).                                                                   |
| **FR-NK-04** | Tính toán quy tắc kiểm đếm         | **Chưa có** | Chưa có logic tự động tính mẫu kiểm theo AQL; chưa phân biệt quy tắc kiểm 100% cho hàng lẻ/thuốc đặc biệt.              |
| **FR-NK-05** | Giám sát chuỗi cung ứng lạnh        | **Chưa có** | Chưa tích hợp đối soát dữ liệu Data Logger; chưa có báo cáo đồ thị nhiệt độ.                                             |
| **FR-NK-08** | Lưu trữ chứng từ GSP số             | **Chưa có** | Chưa tích hợp quét (scanning) hoặc lưu trữ file tài liệu pháp lý đi kèm phiếu.                                               |

## 2. Quản lý xuất kho (FR-XK)

| Mã số            | Yêu cầu                               | Trạng thái        | Chi tiết thiếu sót                                                                                                                              |
| :----------------- | :-------------------------------------- | :------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------- |
| **FR-XK-02** | Cam kết tồn kho khả dụng (Reserved) | **Chưa có** | Chưa có cơ chế tạm giữ (Reservation) số lượng ngay khi lập SO để tránh bán chồng lấn.                                              |
| **FR-XK-03** | Chỉ định lô xuất theo FEFO         | Một phần          | Hiện tại code lấy lô đầu tiên có sẵn, chưa triển khai thuật toán FEFO (Hạn dùng gần nhất xuất trước) một cách nghiêm ngặt. |
| **FR-XK-05** | Soạn hàng và kiểm soát mã vạch   | Một phần          | Có danh sách soạn (Picking list) nhưng thiếu bước quét mã vạch xác nhận từng kiện hàng và cơ chế phạt (penalty) khi quét sai.  |
| **FR-XK-06** | Xác nhận đóng gói                  | Một phần          | Chỉ có checklist tự nguyện, chưa bắt buộc xác nhận chéo (Double-check) giữa QC và Thủ kho theo quy trình.                            |
| **FR-XK-08** | Kết xuất bộ chứng từ               | **Chưa có** | Chưa có chức năng in Phiếu xuất kho, Invoice, Phiếu đóng gói theo mẫu.                                                                  |
| **FR-XK-13** | Xử lý phong tỏa lô khẩn cấp       | **Chưa có** | Chưa có logic tự động dừng mọi đơn hàng liên quan đến một lô vừa bị QA phong tỏa giữa chừng.                                   |
| **FR-XK-14** | Nhập trả kho (Return Flow)            | **Chưa có** | Chưa có luồng xử lý hàng khách trả (Sales Return) trở lại kho biệt trữ.                                                                |

## 3. Kiểm kê kho (FR-KK)

| Mã số            | Yêu cầu                          | Trạng thái        | Chi tiết thiếu sót                                                                                                     |
| :----------------- | :--------------------------------- | :------------------ | :------------------------------------------------------------------------------------------------------------------------ |
| **FR-KK-01** | Lập kế hoạch kiểm kê          | Một phần          | Chưa cho phép chọn phạm vi linh hoạt (Nhóm thuốc, Vị trí, NCC).                                                  |
| **FR-KK-02** | Khóa dữ liệu kiểm kê          | **Chưa có** | Chưa có cơ chế khóa giao dịch (Transaction lock) đối với các vị trí đang kiểm kê.                          |
| **FR-KK-07** | Quản lý kiểm đếm xác nhận   | **Chưa có** | Thiếu cơ chế kiểm đếm lần 2 (Re-count) bởi người thứ 2 để đối chiếu chéo.                                |
| **FR-KK-09** | Phê duyệt điều chỉnh đa cấp | **Chưa có** | Hiện tại hệ thống tự động điều chỉnh mà không qua quy trình phê duyệt của Kế toán trưởng/Giám đốc. |
| **FR-KK-11** | Quản lý sai lệch hàng ký gửi | **Chưa có** | Chưa có phân hệ quản lý hàng ký gửi (Consignment) riêng biệt.                                                  |

## 4. Thu hồi và Tiêu hủy (FR-TH)

| Mã số            | Yêu cầu                        | Trạng thái        | Chi tiết thiếu sót                                                                                                              |
| :----------------- | :------------------------------- | :------------------ | :--------------------------------------------------------------------------------------------------------------------------------- |
| **FR-TH-02** | Thu hồi theo nhiều kịch bản  | Một phần          | Thiếu logic truy vết (Traceability) danh sách khách hàng đã nhận lô hàng bị lỗi để thông báo.                      |
| **FR-TH-03** | Đối soát số lượng thu hồi | **Chưa có** | Chưa có báo cáo đối soát: Số lượng đã xuất vs Số lượng đã thu hồi vs Số lượng còn kẹt trên thị trường. |
| **FR-TH-05** | Quy trình tiêu hủy            | Một phần          | Thiếu chức năng đính kèm bằng chứng ảnh/video tại hiện trường tiêu hủy.                                             |
| **FR-TH-07** | Lưu trữ bằng chứng số       | **Chưa có** | Hệ thống chưa hỗ trợ lưu trữ blob/file cho các hồ sơ tiêu hủy.                                                         |

## 5. Đảm bảo chất lượng (FR-QC)

| Mã số            | Yêu cầu                         | Trạng thái        | Chi tiết thiếu sót                                                                                                   |
| :----------------- | :-------------------------------- | :------------------ | :---------------------------------------------------------------------------------------------------------------------- |
| **FR-QC-03** | Giám sát chuỗi cung ứng lạnh | **Chưa có** | Thiếu hệ thống cảnh báo khẩn cấp khi nhiệt độ vượt ngưỡng trong quá trình lưu kho/vận chuyển.        |
| **FR-QC-04** | Tính toán lấy mẫu theo ISO    | **Chưa có** | Chưa tích hợp thư viện tính toán cỡ mẫu theo tiêu chuẩn ISO 2859-1.                                          |
| **FR-QC-09** | Chặn xuất hàng cận hạn       | **Chưa có** | Chưa có logic tự động ngăn chặn xuất các hàng có hạn dùng < 6 tháng (hoặc theo cấu hình khách hàng). |

## 6. Yêu cầu hệ thống (FR-SYS)

| Mã số             | Yêu cầu                | Trạng thái        | Chi tiết thiếu sót                                                                      |
| :------------------ | :----------------------- | :------------------ | :----------------------------------------------------------------------------------------- |
| **FR-SYS-03** | Bảo mật nâng cao      | **Chưa có** | Chưa có tính năng tự động khóa tài khoản sau 3 lần nhập sai.                   |
| **FR-SYS-04** | Quản lý thiết bị PDA | **Chưa có** | Chưa có module quản lý danh sách thiết bị PDA được phép truy cập.              |
| **FR-SYS-05** | Tích hợp ngoại vi     | **Chưa có** | Thiếu driver/logic giao tiếp trực tiếp với máy in tem và máy in báo cáo.         |
| **FR-SYS-07** | Thông báo đa kênh    | Một phần          | Chỉ có thông báo nội bộ (internal), chưa tích hợp Email/Telegram/App Push.        |
| **FR-SYS-08** | Hoạt động Offline     | **Chưa có** | Hệ thống hiện tại phụ thuộc hoàn toàn vào kết nối mạng để đồng bộ NocoDB. |

---

**Kết luận:** Hệ thống hiện tại đã hoàn thiện các luồng CRUD cơ bản và quản lý trạng thái, nhưng còn thiếu nhiều tính năng **tự động hóa**, **kiểm soát tuân thủ (GSP/ISO)** và **tích hợp phần cứng**.
