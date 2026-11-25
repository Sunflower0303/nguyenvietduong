# nguyenvietduong.com

Website cá nhân tĩnh (HTML/CSS/JS), chạy miễn phí trên GitHub Pages.

## Cấu trúc

```
index.html          Trang chủ: nội dung các mục
assets/style.css    Màu sắc, bố cục (đổi --accent để đổi màu nhấn)
assets/main.js      Danh sách ảnh trong bộ sưu tập (mảng PHOTOS)
images/             Bỏ ảnh của bạn vào đây
files/cv.pdf        File CV để tải về
CNAME               Tên miền riêng
```

## Sửa nội dung

- Chữ: mở `index.html`, thay các chỗ trong ngoặc vuông `[...]`.
- Ảnh bộ sưu tập: chép ảnh vào `images/`, rồi điền `src: 'images/ten-anh.jpg'` trong `assets/main.js`.
  Nên nén ảnh còn chiều dài khoảng 2000px, dưới 500 KB (dùng squoosh.app).
- Ảnh đầu trang: trong `assets/style.css`, tìm mục `.hero` cuối file, làm theo ghi chú ở đó.
- CV: đặt file vào `files/cv.pdf`.

## Đưa lên GitHub Pages

1. Tạo tài khoản GitHub, tạo repo mới (Public), ví dụ tên `nguyenvietduong.com`.
2. Bấm **Add file → Upload files**, kéo toàn bộ thư mục này vào, bấm **Commit changes**.
3. Vào **Settings → Pages**: Source = *Deploy from a branch*, Branch = `main`, thư mục `/ (root)`, bấm Save.
4. Ở ô **Custom domain** nhập `nguyenvietduong.com`, Save.

## Trỏ tên miền (tại nơi mua tên miền, mục quản lý DNS)

| Loại  | Tên (Host) | Giá trị |
|-------|-----------|---------|
| A     | @         | 185.199.108.153 |
| A     | @         | 185.199.109.153 |
| A     | @         | 185.199.110.153 |
| A     | @         | 185.199.111.153 |
| CNAME | www       | `<tên-tài-khoản-github>.github.io` |

Xóa các bản ghi A/CNAME cũ cho `@` và `www` nếu có. DNS cần vài phút đến vài giờ để cập nhật.
Khi GitHub báo kiểm tra DNS thành công, tích **Enforce HTTPS**.
