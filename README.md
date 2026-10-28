# Northline – Ecommerce

Đồ án Ecommerce (Thuận Thiên).

- `backend/` – Express 5 API (sản phẩm, đăng ký / đăng nhập JWT, yêu thích, giỏ hàng, đơn hàng), cổng 5000. Dữ liệu chỉ lưu trong bộ nhớ: khởi động lại server là quay về dữ liệu mẫu trong `server.js`.
- `frontend/` – Next.js (App Router) storefront: trang chủ, danh sách sản phẩm (tìm kiếm, lọc, sắp xếp, phân trang), chi tiết sản phẩm, đăng ký / đăng nhập, giỏ hàng, thanh toán, xác nhận đơn hàng, tài khoản và lịch sử đơn hàng.

## Chạy backend

```bash
cd backend
npm install
npm start
```

## Chạy frontend

Backend phải chạy trước (frontend lấy dữ liệu từ `http://localhost:5000`).

```bash
cd frontend
npm install
npm run dev
```

Mở http://localhost:3000.
