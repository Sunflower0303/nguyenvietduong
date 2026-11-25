# nguyenvietduong.com

Website cá nhân tĩnh, chạy trên Cloudflare Pages (nối với GitHub), sửa nội dung qua trang quản trị **Pages CMS**.

## Cấu trúc

```
index.html, blog.html, post.html   Khung các trang (ít khi phải sửa)
assets/style.css                   Màu sắc, font, bố cục
assets/main.js                     Đọc dữ liệu và hiển thị
data/site.json                     Ảnh nền đầu trang, hồ sơ, chuyên môn, liên hệ
data/photos.json                   Bộ sưu tập ảnh
data/places.json                   Hành trình & văn hóa
data/posts.json                    Bài viết blog
images/                            Ảnh và file tải lên
.pages.yml                         Cấu hình trang quản trị
```

## Sửa nội dung bằng trang quản trị (Pages CMS)

Lần đầu:
1. Vào https://app.pagescms.org, bấm **Sign in with GitHub**.
2. Cho phép Pages CMS truy cập repo `nguyenvietduong.com` (chọn *Only select repositories*).
3. Chọn repo, nhánh `main`. Menu trái hiện: Bài viết blog, Bộ sưu tập ảnh, Hành trình & văn hóa, Trang chủ/hồ sơ/chuyên môn.

Mỗi lần sửa:
- Vào mục muốn sửa, chỉnh nội dung hoặc tải ảnh lên, bấm **Save**.
- Pages CMS lưu thẳng vào GitHub, Cloudflare tự cập nhật website sau khoảng 1 phút.

Viết bài mới: **Bài viết blog** → **Add an entry** → điền tiêu đề, đường dẫn (không dấu, vd. `chuyen-di-ha-giang`), ngày, nội dung → Save.
Ẩn bài tạm thời: bỏ tích **Hiển thị trên website**.

Đổi ảnh nền đầu trang: **Trang chủ, hồ sơ & chuyên môn** → **Phần đầu trang** → **Ảnh nền đầu trang**.

Mẹo ảnh: nén ảnh trước khi tải lên (squoosh.app), cạnh dài ~2000–2400px, dưới 500 KB.

## Đổi màu

Đầu file `assets/style.css`: sửa `--accent` (màu nhấn) và `--bg` (màu nền).
