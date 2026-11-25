/* ============================================================
   DANH SÁCH ẢNH — thêm/sửa ảnh ở đây.
   - src:   đường dẫn ảnh, ví dụ 'images/hoi-an.jpg' (để trống = khung giữ chỗ)
   - title: tên ảnh
   - cat:   'phong-canh' | 'duong-pho' | 'chan-dung'
   - exif:  thông số chụp
   - tall:  true nếu là ảnh dọc (chiếm 2 hàng)
   ============================================================ */
const PHOTOS = [
  { src: '', title: '[Tên ảnh 1]', cat: 'phong-canh', exif: '[Máy ảnh] · [Ống kính] · f/8 · 1/250s · ISO 100', tall: true },
  { src: '', title: '[Tên ảnh 2]', cat: 'duong-pho',  exif: '[Máy ảnh] · [Ống kính] · f/2.8 · 1/500s · ISO 200' },
  { src: '', title: '[Tên ảnh 3]', cat: 'chan-dung',  exif: '[Máy ảnh] · [Ống kính] · f/1.8 · 1/200s · ISO 400', tall: true },
  { src: '', title: '[Tên ảnh 4]', cat: 'phong-canh', exif: '[Máy ảnh] · [Ống kính] · f/11 · 1/125s · ISO 100' },
  { src: '', title: '[Tên ảnh 5]', cat: 'duong-pho',  exif: '[Máy ảnh] · [Ống kính] · f/4 · 1/1000s · ISO 200' },
  { src: '', title: '[Tên ảnh 6]', cat: 'phong-canh', exif: '[Máy ảnh] · [Ống kính] · f/5.6 · 1/320s · ISO 100' },
  { src: '', title: '[Tên ảnh 7]', cat: 'chan-dung',  exif: '[Máy ảnh] · [Ống kính] · f/2 · 1/250s · ISO 320' },
  { src: '', title: '[Tên ảnh 8]', cat: 'duong-pho',  exif: '[Máy ảnh] · [Ống kính] · f/2.8 · 1/60s · ISO 800', tall: true }
];

const CAT_NAMES = { 'phong-canh': 'Phong cảnh', 'duong-pho': 'Đường phố', 'chan-dung': 'Chân dung' };

(function () {
  const gallery = document.getElementById('gallery');
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  const lbTitle = document.getElementById('lb-title');
  const lbExif = document.getElementById('lb-exif');

  function media(p) {
    if (p.src) {
      const img = document.createElement('img');
      img.src = p.src; img.alt = p.title; img.loading = 'lazy';
      return img;
    }
    const ph = document.createElement('div');
    ph.className = 'placeholder';
    ph.textContent = '[Ảnh] · ' + (CAT_NAMES[p.cat] || '');
    return ph;
  }

  // Dựng lưới ảnh
  PHOTOS.forEach(function (p) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'photo' + (p.tall ? ' tall' : '');
    btn.dataset.cat = p.cat;
    btn.setAttribute('aria-label', 'Xem ảnh ' + p.title);
    btn.appendChild(media(p));
    const cap = document.createElement('span');
    cap.className = 'cap';
    cap.textContent = p.title;
    btn.appendChild(cap);
    btn.addEventListener('click', function () { openLightbox(p); });
    gallery.appendChild(btn);
  });

  // Lọc dự án: chuyên môn / thực tế
  const pchips = document.querySelectorAll('.pchip');
  pchips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      pchips.forEach(function (c) { c.classList.remove('is-active'); });
      chip.classList.add('is-active');
      const f = chip.dataset.pfilter;
      document.querySelectorAll('#projects .project').forEach(function (el) {
        el.hidden = !(f === 'all' || el.dataset.type === f);
      });
    });
  });

  // Lọc ảnh theo thể loại
  const chips = document.querySelectorAll('.chip[data-filter]');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chips.forEach(function (c) { c.classList.remove('is-active'); });
      chip.classList.add('is-active');
      const f = chip.dataset.filter;
      gallery.querySelectorAll('.photo').forEach(function (el) {
        el.hidden = !(f === 'all' || el.dataset.cat === f);
      });
    });
  });

  // Xem ảnh lớn
  let lastFocus = null;
  function openLightbox(p) {
    lastFocus = document.activeElement;
    lbImg.innerHTML = '';
    lbImg.appendChild(media(p));
    lbTitle.textContent = p.title;
    lbExif.textContent = p.exif || '';
    lightbox.hidden = false;
    lightbox.querySelector('.lb-close').focus();
  }
  function closeLightbox() {
    lightbox.hidden = true;
    if (lastFocus) lastFocus.focus();
  }
  lightbox.querySelector('.lb-close').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLightbox(); });
  lightbox.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLightbox(); });

  // Menu điện thoại
  const menuBtn = document.querySelector('.menu-btn');
  const nav = document.getElementById('nav');
  menuBtn.addEventListener('click', function () {
    const open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      nav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
