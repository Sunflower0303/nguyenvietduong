/* ============================================================
   Website nguyenvietduong.com
   Nội dung KHÔNG nằm ở đây mà nằm trong thư mục data/:
     data/site.json    ảnh nền đầu trang, hồ sơ, chuyên môn, liên hệ
     data/photos.json  bộ sưu tập ảnh
     data/places.json  hành trình & văn hóa
     data/posts.json   bài viết blog
   Sửa các file này qua trang quản trị Pages CMS (xem README.md).
   ============================================================ */
{
  const CAT = { 'phong-canh': 'Phong cảnh', 'duong-pho': 'Đường phố', 'chan-dung': 'Chân dung' };
  const KIND = { 'dia-diem': 'ĐỊA ĐIỂM', 'van-hoa': 'VĂN HÓA', 'am-thuc': 'ẨM THỰC' };
  const TYPE = { 'chuyen-mon': 'DỰ ÁN CHUYÊN MÔN', 'thuc-te': 'DỰ ÁN THỰC TẾ' };
  const page = document.body.dataset.page;

  const esc = (v) => String(v == null ? '' : v)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  // Pages CMS lưu ảnh dạng "/images/x.jpg"; bỏ dấu / đầu để chạy được ở mọi nơi
  const src = (p) => (p || '').replace(/^\//, '');
  const $ = (id) => document.getElementById(id);
  const load = (name) => fetch('data/' + name + '.json', { cache: 'no-cache' })
    .then((r) => (r.ok ? r.json() : null)).catch(() => null);
  const fmtDate = (d) => {
    if (!d) return '';
    const t = new Date(d);
    return isNaN(t) ? String(d) : t.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };
  const imgOr = (path, label, alt) => path
    ? '<img src="' + esc(src(path)) + '" alt="' + esc(alt || '') + '" loading="lazy">'
    : '<div class="placeholder">' + esc(label) + '</div>';
  const visiblePosts = (posts) => (posts || [])
    .filter((p) => p && p.published !== false)
    .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
  const postCard = (p) =>
    '<a class="post" href="post.html#' + encodeURIComponent(p.slug || '') + '">' +
      '<div class="thumb">' + imgOr(p.cover, '[Ảnh bìa]', p.title) + '</div>' +
      '<p class="meta">' + esc(fmtDate(p.date)) + (p.topic ? ' · ' + esc(p.topic) : '') + '</p>' +
      '<h3>' + esc(p.title) + '</h3>' +
      (p.excerpt ? '<p class="excerpt">' + esc(p.excerpt) + '</p>' : '') +
    '</a>';

  /* ---------- Phần dùng chung: menu, chân trang ---------- */
  const menuBtn = document.querySelector('.menu-btn');
  const nav = $('nav');
  menuBtn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
    nav.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }));
  document.querySelectorAll('.year').forEach((el) => { el.textContent = new Date().getFullYear(); });

  const renderContact = (site) => {
    const c = (site && site.contact) || {};
    const links = [];
    if (c.email) links.push('<a href="mailto:' + esc(c.email) + '">' + esc(c.email) + '</a>');
    if (c.facebook) links.push('<a href="' + esc(c.facebook) + '" target="_blank" rel="noopener">Facebook</a>');
    if (c.instagram) links.push('<a href="' + esc(c.instagram) + '" target="_blank" rel="noopener">Instagram</a>');
    if (c.linkedin) links.push('<a href="' + esc(c.linkedin) + '" target="_blank" rel="noopener">LinkedIn</a>');
    document.querySelectorAll('.contact-links').forEach((el) => { el.innerHTML = links.join(' · '); });
  };

  /* ---------- Trang chủ ---------- */
  function renderHome(site, photos, places, posts) {
    site = site || {};
    const h = site.hero || {};
    // Chỉ thay chữ khi trong data có nội dung; nếu không, giữ chữ mặc định trong index.html
    if (h.eyebrow) $('hero-eyebrow').textContent = h.eyebrow;
    if (h.title) {
      let title = esc(h.title);
      if (h.highlight) title = title.replace(esc(h.highlight), '<em>' + esc(h.highlight) + '</em>');
      $('hero-title').innerHTML = title;
    }
    if (h.subtitle) $('hero-sub').textContent = h.subtitle;
    if (h.image) {
      document.querySelector('.hero').style.backgroundImage =
        'linear-gradient(to top, rgba(0,0,0,.65), rgba(0,0,0,.05) 60%), url("' + src(h.image).replace(/"/g, '%22') + '")';
    }

    // Bộ sưu tập ảnh
    const gallery = $('gallery');
    gallery.innerHTML = (photos || []).map((p, i) =>
      '<button type="button" class="photo' + (p.tall ? ' tall' : '') + '" data-cat="' + esc(p.category) + '" data-i="' + i + '" aria-label="Xem ảnh ' + esc(p.title) + '">' +
        imgOr(p.image, '[Ảnh] · ' + (CAT[p.category] || ''), p.title) +
        '<span class="cap">' + esc(p.title) + '</span>' +
      '</button>').join('');
    gallery.addEventListener('click', (e) => {
      const b = e.target.closest('.photo');
      if (b) openLightbox(photos[+b.dataset.i]);
    });
    setupFilter('.chip[data-filter]', 'filter', '#gallery .photo', 'cat');

    // Hành trình
    $('places').innerHTML = (places || []).map((p) =>
      '<article class="place">' +
        '<div class="thumb">' + imgOr(p.image, '[Ảnh]', p.name) + '</div>' +
        '<p class="kind">' + esc(KIND[p.kind] || p.kind || '') + '</p>' +
        '<h3>' + esc(p.name) + '</h3>' +
        '<p>' + esc(p.description) + '</p>' +
      '</article>').join('');

    // Hồ sơ
    const pr = site.profile || {};
    $('profile-intro').textContent = pr.intro || '';
    const cv = $('cv-link');
    if (pr.cv) { cv.href = src(pr.cv); cv.setAttribute('download', ''); } else { cv.hidden = true; }
    ['work', 'education', 'research', 'awards'].forEach((k) => {
      $('tl-' + k).innerHTML = (pr[k] || []).map((it) =>
        '<li><strong>' + esc(it.title) + '</strong><span>' + esc(it.time) + '</span></li>').join('');
    });

    // Chuyên môn
    const ex = site.expertise || {};
    $('expertise-summary').textContent = ex.summary || '';
    $('skills').innerHTML = (ex.skills || []).map((g) =>
      '<div class="skill-group"><h4>' + esc(g.group) + '</h4><ul class="tags">' +
        (g.items || []).map((s) => '<li>' + esc(s) + '</li>').join('') +
      '</ul></div>').join('');
    $('projects').innerHTML = (ex.projects || []).map((p) => {
      const place = p.type === 'thuc-te';
      return '<article class="project" data-type="' + esc(p.type) + '">' +
        '<p class="kind">' + esc(TYPE[p.type] || '') + (p.year ? ' · ' + esc(p.year) : '') + '</p>' +
        '<h3>' + esc(p.title) + '</h3>' +
        '<dl>' +
          (p.context ? '<dt>' + (place ? 'Địa điểm' : 'Bối cảnh') + '</dt><dd>' + esc(p.context) + '</dd>' : '') +
          (p.role ? '<dt>Vai trò</dt><dd>' + esc(p.role) + '</dd>' : '') +
          (p.result ? '<dt>Kết quả</dt><dd>' + esc(p.result) + '</dd>' : '') +
        '</dl>' +
        '<ul class="tags small">' + (p.tags || []).map((t) => '<li>' + esc(t) + '</li>').join('') + '</ul>' +
      '</article>';
    }).join('');
    setupFilter('.pchip', 'pfilter', '#projects .project', 'type');

    // Blog mới nhất
    const list = visiblePosts(posts).slice(0, 3);
    $('latest-posts').innerHTML = list.length ? list.map(postCard).join('') : '<p class="lead">Chưa có bài viết.</p>';
  }

  function setupFilter(chipSel, chipKey, itemSel, itemKey) {
    const chips = document.querySelectorAll(chipSel);
    chips.forEach((chip) => chip.addEventListener('click', () => {
      chips.forEach((c) => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      const f = chip.dataset[chipKey];
      document.querySelectorAll(itemSel).forEach((el) => {
        el.hidden = !(f === 'all' || el.dataset[itemKey] === f);
      });
    }));
  }

  // Xem ảnh lớn
  const lightbox = $('lightbox');
  let lastFocus = null;
  function openLightbox(p) {
    if (!p) return;
    lastFocus = document.activeElement;
    $('lb-img').innerHTML = imgOr(p.image, '[Ảnh]', p.title);
    $('lb-title').textContent = p.title || '';
    $('lb-exif').textContent = p.exif || '';
    lightbox.hidden = false;
    lightbox.querySelector('.lb-close').focus();
  }
  function closeLightbox() {
    lightbox.hidden = true;
    if (lastFocus) lastFocus.focus();
  }
  if (lightbox) {
    lightbox.querySelector('.lb-close').addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    lightbox.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
  }

  /* ---------- Trang Blog ---------- */
  function renderBlog(posts) {
    const all = visiblePosts(posts);
    const topics = [...new Set(all.map((p) => p.topic).filter(Boolean))];
    const filters = $('topic-filters');
    filters.innerHTML = topics.length > 1
      ? ['<button type="button" class="chip tchip is-active" data-t="">Tất cả</button>']
          .concat(topics.map((t) => '<button type="button" class="chip tchip" data-t="' + esc(t) + '">' + esc(t) + '</button>')).join('')
      : '';
    const draw = (t) => {
      const list = t ? all.filter((p) => p.topic === t) : all;
      $('post-list').innerHTML = list.length ? list.map(postCard).join('') : '<p class="lead">Chưa có bài viết.</p>';
    };
    filters.addEventListener('click', (e) => {
      const b = e.target.closest('.tchip');
      if (!b) return;
      filters.querySelectorAll('.tchip').forEach((c) => c.classList.remove('is-active'));
      b.classList.add('is-active');
      draw(b.dataset.t);
    });
    draw('');
  }

  /* ---------- Trang đọc bài ---------- */
  function renderPost(posts) {
    const all = visiblePosts(posts);
    const show = () => {
      const slug = decodeURIComponent(location.hash.slice(1));
      const p = all.find((x) => x.slug === slug) || (!slug && all[0]);
      if (!p) {
        $('post-title').textContent = 'Không tìm thấy bài viết';
        $('post-meta').textContent = '';
        $('post-cover').innerHTML = '';
        $('post-body').innerHTML = '<p><a href="blog.html">Quay lại danh sách bài viết</a></p>';
        return;
      }
      document.title = p.title + ' — Nguyễn Viết Dương';
      $('post-title').textContent = p.title || '';
      $('post-meta').textContent = fmtDate(p.date) + (p.topic ? ' · ' + p.topic : '');
      $('post-cover').innerHTML = p.cover ? '<img class="cover" src="' + esc(src(p.cover)) + '" alt="">' : '';
      const body = p.body || '';
      // Nội dung do chính bạn soạn trong trang quản trị (HTML từ trình soạn thảo)
      $('post-body').innerHTML = /<[a-z][\s\S]*>/i.test(body)
        ? body
        : body.split(/\n{2,}/).map((para) => '<p>' + esc(para).replace(/\n/g, '<br>') + '</p>').join('');
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', show);
    show();
  }

  /* ---------- Khởi chạy ---------- */
  Promise.all([load('site'), load('photos'), load('places'), load('posts')]).then(([site, photos, places, posts]) => {
    renderContact(site);
    if (page === 'home') renderHome(site, photos, places, posts);
    if (page === 'blog') renderBlog(posts);
    if (page === 'post') renderPost(posts);
  });
}
