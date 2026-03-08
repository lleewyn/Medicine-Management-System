
//* Công cụ đồng bộ dữ liệu đơn hàng(Sales Orders) lên NocoDB.
//* Cách dùng: node sync_so_to_nocodb.js


const https = require('https');

// 1. CẤU HÌNH KẾT NỐI
const NOCO_CONFIG = {
  BASE_URL: 'https://nocodb.data4life.top',
  API_TOKEN: 'CbFCU2G7OdsOVCHr4k315N0J7dQ5MzjJSOVSSU7x' // Token API đã sửa
};

// 2. ID CỦA BẢNG TRÊN NOCODB (Mã 'm...')
const TABLE_IDS = {
  'Sales_Orders': 'm8gnl88wrij90wp'
};

/**
 * Hàm hỗ trợ gọi API NocoDB (v2)
 */
async function nocoRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: new URL(NOCO_CONFIG.BASE_URL).hostname,
      path: path,
      method: method,
      headers: {
        'xc-token': NOCO_CONFIG.API_TOKEN,
        'Content-Type': 'application/json'
      }
    };

    let postData = '';
    if (data) {
      postData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = https.request(options, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        if (d && d.length > 0) {
          try {
            resolve(JSON.parse(d));
          } catch (e) {
            resolve(d);
          }
        } else {
          resolve();
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(postData);
    req.end();
  });
}

// 3. DỮ LIỆU CẦN ĐẨY LÊN (Dựa trên thiết kế tháng 03/2026)
const SALES_ORDERS = [
  { SO_ID: 'SO-24-001', CustomerID: 'Hệ thống Nhà thuốc Pharmacity', OrderDate: '2026-03-08', Status: 'Đang lấy hàng', Priority: 'URGENT', DeliveryAddress: 'TP.HCM', ContactPhone: '0987654321' },
  { SO_ID: 'SO-24-002', CustomerID: 'Bệnh viện Đa khoa Tâm Anh', OrderDate: '2026-03-07', Status: 'Đang đóng gói', Priority: 'URGENT', DeliveryAddress: 'Hà Nội', ContactPhone: '0912345678' },
  { SO_ID: 'SO-24-003', CustomerID: 'Chuỗi Nhà thuốc An Khang', OrderDate: '2026-03-07', Status: 'Đang lấy hàng', Priority: 'NORMAL', DeliveryAddress: 'Cần Thơ', ContactPhone: '0981122334' },
  { SO_ID: 'SO-24-004', CustomerID: 'Nhà thuốc Long Châu #12', OrderDate: '2026-03-06', Status: 'Đang giao hàng', Priority: 'NORMAL', DeliveryAddress: 'Bình Dương', ContactPhone: '0909090909' },
  { SO_ID: 'SO-24-005', CustomerID: 'Bệnh viện Chợ Rẫy', OrderDate: '2026-03-05', Status: 'Đang giao hàng', Priority: 'URGENT', DeliveryAddress: 'TP.HCM', ContactPhone: '0988776655' },
  { SO_ID: 'SO-24-006', CustomerID: 'Nhà thuốc An Khang Hà Nội', OrderDate: '2026-03-04', Status: 'Đã hoàn thành', Priority: 'NORMAL', DeliveryAddress: 'Hà Nội', ContactPhone: '0966554433' },
  { SO_ID: 'SO-24-007', CustomerID: 'Phòng khám Đa khoa Thu Cúc', OrderDate: '2026-03-02', Status: 'Đã hoàn thành', Priority: 'NORMAL', DeliveryAddress: 'Hà Nội', ContactPhone: '0977889900' },
  { SO_ID: 'SO-24-008', CustomerID: 'Hệ thống Pharmacity Miền Bắc', OrderDate: '2026-03-08', Status: 'Đang lấy hàng', Priority: 'NORMAL', DeliveryAddress: 'Bắc Ninh', ContactPhone: '0933445566' },
  { SO_ID: 'SO-24-009', CustomerID: 'Bệnh viện Vinmec', OrderDate: '2026-03-05', Status: 'Đã hủy', Priority: 'URGENT', DeliveryAddress: 'TP.HCM', ContactPhone: '0911223344' },
  { SO_ID: 'SO-24-010', CustomerID: 'Nhà thuốc Minh Châu', OrderDate: '2026-03-09', Status: 'Đang chờ xử lý', Priority: 'NORMAL', DeliveryAddress: 'Đà Nẵng', ContactPhone: '0944556677' }
];

const TABLES = {
  Sales_Orders: 'm8gnl88wrij90wp',
  CUSTOMERS: 'm34ugizvp0l1ple',
  USERS: 'mm1izhsiixh0ix2'
};

/**
 * QUY TRÌNH ĐỒNG BỘ:
 * 1. Lấy danh sách hiện có trên NocoDB
 * 2. Xoá hết dữ liệu cũ để tránh trùng lặp
 * 3. Lấy danh sách Khách hàng và Người dùng để map các ID liên kết.
 * 4. Đẩy 10 đơn hàng mới lên bằng phương thức Bulk Insert
 */
async function syncSO() {
  const tableId = TABLES.Sales_Orders;

  try {
    console.log('--- BẮT ĐẦU ĐỒNG BỘ SO ---');

    // Bước 1: Lấy dữ liệu cũ
    console.log('1. Đang kiểm tra dữ liệu hiện có...');
    const existing = await nocoRequest(`/api/v2/tables/${tableId}/records?limit=100`);
    const list = existing.list || existing;

    // Bước 2: Xoá dữ liệu cũ
    if (list && list.length > 0) {
      console.log(`2. Phát hiện ${list.length} bản ghi cũ. Đang tiến hành xoá...`);
      const deletePayload = list.map(item => ({ Id: item.Id }));
      await nocoRequest(`/api/v2/tables/${tableId}/records`, 'DELETE', deletePayload);
      console.log('   -> Đã xoá sạch bảng.');
    } else {
      console.log('2. Bảng hiện đang trống.');
    }

    // Bước 3: Đang lấy dữ liệu tham chiếu (Khách hàng & Người dùng)
    console.log('3. Đang đồng bộ thông tin tham chiếu (Customers, Users)...');
    const customersData = await nocoRequest(`/api/v2/tables/${TABLES.CUSTOMERS}/records?limit=100`);
    const customersList = customersData.list || [];
    const usersData = await nocoRequest(`/api/v2/tables/${TABLES.USERS}/records?limit=100`);
    const usersList = usersData.list || [];

    const finalSalesOrders = SALES_ORDERS.map(so => {
      // Tìm Khách hàng
      const custStr = String(so.CustomerID).toLowerCase().trim();
      let matchedCust = customersList.find(c => String(c.CustomerName).toLowerCase().trim() === custStr);
      if (!matchedCust) {
        matchedCust = customersList.find(c => String(c.CustomerName).toLowerCase().includes(custStr) || custStr.includes(String(c.CustomerName).toLowerCase()));
      }
      
      // Chọn ngẫu nhiên 1 Nhân viên
      const randomUser = usersList.length > 0 ? usersList[Math.floor(Math.random() * usersList.length)] : null;

      // Xoá CustomerID gốc để tránh NocoDB báo lỗi cột không chính xác
      const { CustomerID, UserID, ...otherProps } = so;

      return {
        ...otherProps,
        Customers_id: matchedCust ? matchedCust.Id : null,
        Users_id: randomUser ? randomUser.Id : null
      };
    });

    // Bước 4: Đẩy dữ liệu mới
    console.log(`4. Đang đẩy ${finalSalesOrders.length} đơn hàng mới lên NocoDB...`);
    await nocoRequest(`/api/v2/tables/${tableId}/records`, 'POST', finalSalesOrders);

    console.log('--- HOÀN TẤT ĐỒNG BỘ! ---');
    console.log('Bạn có thể vào trang Quản lý đơn hàng trên Web để kiểm tra kết quả.');

  } catch (error) {
    console.error('!!! LỖI ĐỒNG BỘ:', error.message);
  }
}

// Chạy script
syncSO();
