# Hướng Dẫn Sử Dụng Form Khảo Sát (AppSheet Integration)

Dự án này là một web form đơn giản để thu thập thông tin người dùng và gửi trực tiếp vào Google AppSheet thông qua API.

## 1. Cấu Trúc Thư Mục
- `index.html`: Giao diện chính của form (HTML).
- `style.css`: Các đoạn mã trang trí giao diện (CSS) - thiết kế Premium.
- `script.js`: Xử lý logic lấy dữ liệu và gửi API (JavaScript).

## 2. Cách Cài Đặt & Chạy
Dự án thuần HTML/CSS/JS nên không cần cài đặt phức tạp.

**Cách 1: Chạy trực tiếp (Chỉ để xem giao diện)**
- Nhấn đúp chuột vào file `index.html` để mở trên trình duyệt.

**Cách 2: Chạy để test Submit (Khuyên dùng)**
Do chính sách bảo mật của trình duyệt (CORS), bạn có thể gặp lỗi khi gửi dữ liệu nếu mở file trực tiếp.
Để khắc phục, hãy cài tiện ích mở rộng **"Allow CORS: Access-Control-Allow-Origin"** trên Chrome/Edge.
1. Tìm và cài đặt extension trên Web Store.
2. Bật extension lên (Icon sáng màu).
3. Refresh lại trang form và thử gửi dữ liệu.

## 3. Cấu Hình API
Thông tin cấu hình nằm trong file `script.js` (dòng 1-3).
```javascript
const YOUR_APPSHEET_ACCESS_KEY = "V2-8izS9-Tkt2d-nc66n-0k1Td..."; // Access Key của bạn
const YOUR_APP_ID = "56806620-c839-4b9f..."; // App ID của bạn
const table = "data"; // Tên bảng trong AppSheet
```
Nếu bạn thay đổi AppSheet, hãy cập nhật lại các thông số này.

## 4. Xử Lý Lỗi Thường Gặp
- **Lỗi "Failed to fetch" hoặc CORS**:
  - Nguyên nhân: Trình duyệt chặn kết nối đến server lạ từ file nội bộ.
  - Khắc phục: Dùng Extension CORS như hướng dẫn ở trên hoặc setup Local Server (Node.js/Python).
- **Lỗi 404 Not Found**:
  - Kiểm tra lại AppID và Tên Bảng (Table Name) có đúng không.
- **Lỗi 400 Bad Request**:
  - Kiểm tra lại tên các cột trong code JS (`ten_nguoi_khao_sat`, `so_dien_thoai`...) có khớp chính xác với cột trong AppSheet/Google Sheet không.

## 5. Lưu Ý AppSheet
- Đảm bảo bảng `data` trong AppSheet cho phép quyền **Updates** (Adds).
- Nếu bảng có cột bắt buộc (Required), phải đảm bảo trong form đã gửi đủ thông tin đó.
