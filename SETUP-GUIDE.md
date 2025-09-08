# Hướng dẫn Setup Cloudflare Worker + Google Sheets

## Bước 1: Tạo Google Sheets

1. Truy cập [Google Sheets](https://sheets.google.com)
2. Tạo một sheet mới
3. Đặt tên sheet là "Đơn hàng Túi Dâu Tằm" (hoặc tên bạn muốn)
4. Copy ID của sheet từ URL:
   ```
   https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit
   ```
   Ví dụ: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`

## Bước 2: Tạo Google Apps Script

1. Truy cập [Google Apps Script](https://script.google.com)
2. Tạo project mới
3. Xóa code mặc định và copy toàn bộ code từ file `google-script.js`
4. Thay `YOUR_GOOGLE_SHEET_ID_HERE` bằng ID sheet thực của bạn
5. Lưu project (Ctrl+S)
6. Deploy:
   - Click "Deploy" > "New deployment"
   - Type: "Web app"
   - Execute as: "Me"
   - Who has access: "Anyone"
   - Click "Deploy"
7. Copy URL được tạo ra (dạng: `https://script.google.com/macros/s/[SCRIPT_ID]/exec`)

## Bước 3: Setup Cloudflare Worker

1. Truy cập [Cloudflare Workers](https://workers.cloudflare.com)
2. Tạo Worker mới
3. Copy toàn bộ code từ file `worker.js`
4. Thay `YOUR_SCRIPT_ID` bằng Script ID thực từ bước 2
5. Deploy Worker
6. Copy URL của Worker (dạng: `https://your-worker.your-subdomain.workers.dev`)

## Bước 4: Cập nhật Frontend

1. Mở file `script.js`
2. Tìm dòng:
   ```javascript
   GOOGLE_APPS_SCRIPT_URL: 'https://holy-forest-b29c.yendev96.workers.dev',
   ```
3. Thay bằng URL Worker từ bước 3:
   ```javascript
   GOOGLE_APPS_SCRIPT_URL: 'https://your-worker.your-subdomain.workers.dev',
   ```

## Bước 5: Test

1. Mở website của bạn
2. Điền form đặt hàng và submit
3. Kiểm tra Google Sheets xem có dữ liệu mới không
4. Kiểm tra Console của browser và Worker logs nếu có lỗi

## Cấu trúc dữ liệu trong Google Sheets

| Thời gian | Mã đơn hàng | Tên khách hàng | Số điện thoại | Địa chỉ | Số lượng | Tổng tiền | Chữ trên túi | Ghi chú | Trạng thái |
|-----------|-------------|----------------|---------------|---------|----------|-----------|--------------|---------|------------|
| 08/09/2025 10:30:00 | TDT25090810301AB | Nguyễn Văn A | 0123456789 | Hà Nội | 2 | 78,000đ | Lộc | Giao sáng | Mới |

## Troubleshooting

### Lỗi CORS
- Đảm bảo Worker có CORS headers đúng
- Kiểm tra URL Worker trong script.js

### Lỗi Google Script
- Kiểm tra SHEET_ID có đúng không
- Đảm bảo Google Script được deploy với quyền "Anyone"
- Kiểm tra logs trong Google Apps Script Editor

### Lỗi không ghi được vào Sheet
- Kiểm tra quyền truy cập Google Sheets
- Đảm bảo sheet name đúng (mặc định là "Orders")

## Bảo mật

- Worker URL sẽ public, nhưng chỉ nhận POST request
- Google Script URL cũng public nhưng chỉ ghi dữ liệu vào sheet
- Không có thông tin nhạy cảm trong code

## Chi phí

- Cloudflare Workers: Free tier 100,000 requests/day
- Google Apps Script: Free
- Google Sheets: Free

Hoàn toàn miễn phí cho website nhỏ!
