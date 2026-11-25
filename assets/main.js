/* ============================================================
   Website nguyenvietduong.com
   Nội dung nằm trong thư mục data/ và được sửa qua Pages CMS:
     data/site.json    ảnh nền đầu trang, hồ sơ, chuyên môn, liên hệ
     data/photos.json  bộ sưu tập ảnh (mỗi mục là một bộ, nhiều ảnh)
     data/places.json  hành trình & văn hóa (mỗi nơi nhiều ảnh)
     data/posts.json   bài viết blog (ảnh trong bài + bộ ảnh cuối bài)
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
  const src = (p) => String(p || '').replace(/^\//, '');
  // Một ô ảnh có thể là 1 ảnh (chuỗi) hoặc nhiều ảnh (mảng) — luôn trả về mảng
  const toList = (v) => (Array.isArray(v) ? v : v ? [v] : [])
    .map((x) => (typeof x === 'string' ? x : x && (x.image || x.src)) || '')
    .filter(Boolean);
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

  /* ---------- Khung xem ảnh lớn (dùng chung mọi trang) ---------- */
  document.body.insertAdjacentHTML('beforeend',
    '<div class="lightbox" id="lightbox" hidden role="dialog" aria-modal="true" aria-label="Xem ảnh">' +
      '<button type="button" class="lb-close" aria-label="Đóng"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
      '<button type="button" class="lb-nav lb-prev" aria-label="Ảnh trước"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button>' +
      '<button type="button" class="lb-nav lb-next" aria-label="Ảnh sau"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button>' +
      '<figure><div class="lb-img" id="lb-img"></div>' +
      '<figcaption><strong id="lb-title"></strong><span id="lb-exif"></span><span id="lb-count"></span></figcaption></figure>' +
    '</div>');
  const lightbox = $('lightbox');
  let lbItems = [], lbIndex = 0, lastFocus = null;
  function lbShow() {
    const it = lbItems[lbIndex] || {};
    $('lb-img').innerHTML = imgOr(it.image, '[Ảnh]', it.title);
    $('lb-title').textContent = it.title || '';
    $('lb-exif').textContent = it.exif || '';
    $('lb-count').textContent = lbItems.length > 1 ? (lbIndex + 1) + ' / ' + lbItems.length : '';
    lightbox.querySelectorAll('.lb-nav').forEach((b) => { b.hidden = lbItems.length < 2; });
  }
  function openLightbox(items, index) {
    if (!items || !items.length) return;
    lbItems = items; lbIndex = index || 0; lastFocus = document.activeElement;
    lbShow();
    lightbox.hidden = false;
    lightbox.querySelector('.lb-close').focus();
  }
  function closeLightbox() { lightbox.hidden = true; if (lastFocus) lastFocus.focus(); }
  const step = (d) => { lbIndex = (lbIndex + d + lbItems.length) % lbItems.length; lbShow(); };
  lightbox.querySelector('.lb-close').addEventListener('click', closeLightbox);
  lightbox.querySelector('.lb-prev').addEventListener('click', () => step(-1));
  lightbox.querySelector('.lb-next').addEventListener('click', () => step(1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  lightbox.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
  // Vuốt trên điện thoại
  let tx = null;
  lightbox.addEventListener('touchstart', (e) => { tx = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    if (tx == null) return;
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
    tx = null;
  });

  /* ---------- Menu, chân trang ---------- */
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

  function setupFilter(chipSel, chipKey, itemSel, itemKey, after) {
    const chips = document.querySelectorAll(chipSel);
    chips.forEach((chip) => chip.addEventListener('click', () => {
      chips.forEach((c) => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      const f = chip.dataset[chipKey];
      document.querySelectorAll(itemSel).forEach((el) => {
        el.hidden = !(f === 'all' || el.dataset[itemKey] === f);
      });
      if (after) after(f);
    }));
  }

  /* ---------- Trang chủ ---------- */
  function renderHome(site, photos, places, posts) {
    site = site || {};
    const h = site.hero || {};
    if (h.eyebrow) $('hero-eyebrow').textContent = h.eyebrow;
    if (h.title) {
      let title = esc(h.title);
      if (h.highlight) title = title.replace(esc(h.highlight), '<em>' + esc(h.highlight) + '</em>');
      $('hero-title').innerHTML = title;
    }
    if (h.subtitle) $('hero-sub').textContent = h.subtitle;
    const heroImg = toList(h.image)[0];
    if (heroImg) {
      document.querySelector('.hero').style.backgroundImage =
        'linear-gradient(to top, rgba(0,0,0,.65), rgba(0,0,0,.05) 60%), url("' + src(heroImg).replace(/"/g, '%22') + '")';
    }

    // Bộ sưu tập: mỗi bộ có nhiều ảnh, trải ra thành từng ô
    const tiles = [];
    (photos || []).forEach((set) => {
      const imgs = toList(set.images || set.image);
      (imgs.length ? imgs : ['']).forEach((img, k) => tiles.push({
        image: img, title: set.title || '', exif: set.exif || '', cat: set.category || '',
        tall: k === 0 && !!set.tall
      }));
    });
    const gallery = $('gallery');
    gallery.innerHTML = tiles.map((t, i) =>
      '<button type="button" class="photo' + (t.tall ? ' tall' : '') + '" data-cat="' + esc(t.cat) + '" data-i="' + i + '" aria-label="Xem ảnh ' + esc(t.title) + '">' +
        imgOr(t.image, '[Ảnh] · ' + (CAT[t.cat] || ''), t.title) +
        '<span class="cap">' + esc(t.title) + '</span>' +
      '</button>').join('');
    let filtered = tiles;
    gallery.addEventListener('click', (e) => {
      const b = e.target.closest('.photo');
      if (!b) return;
      const t = tiles[+b.dataset.i];
      openLightbox(filtered, Math.max(0, filtered.indexOf(t)));
    });
    setupFilter('.chip[data-filter]', 'filter', '#gallery .photo', 'cat', (f) => {
      filtered = f === 'all' ? tiles : tiles.filter((t) => t.cat === f);
    });

    // Hành trình: mỗi nơi nhiều ảnh, bấm để xem cả bộ
    $('places').innerHTML = (places || []).map((p, i) => {
      const imgs = toList(p.images || p.image);
      return '<article class="place">' +
        '<button type="button" class="thumb place-open" data-i="' + i + '" aria-label="Xem ảnh ' + esc(p.name) + '"' + (imgs.length ? '' : ' disabled') + '>' +
          imgOr(imgs[0], '[Ảnh]', p.name) +
          (imgs.length > 1 ? '<span class="badge">' + imgs.length + ' ảnh</span>' : '') +
        '</button>' +
        '<p class="kind">' + esc(KIND[p.kind] || p.kind || '') + '</p>' +
        '<h3>' + esc(p.name) + '</h3>' +
        '<p>' + esc(p.description) + '</p>' +
      '</article>';
    }).join('');
    $('places').addEventListener('click', (e) => {
      const b = e.target.closest('.place-open');
      if (!b) return;
      const p = places[+b.dataset.i];
      openLightbox(toList(p.images || p.image).map((img) => ({ image: img, title: p.name })), 0);
    });

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

    const list = visiblePosts(posts).slice(0, 3);
    $('latest-posts').innerHTML = list.length ? list.map(postCard).join('') : '<p class="lead">Chưa có bài viết.</p>';
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
  function bodyHtml(body) {
    body = body || '';
    if (/<[a-z][\s\S]*>/i.test(body)) return body;                 // HTML từ trình soạn thảo
    if (window.marked) return window.marked.parse(body);             // Markdown
    return body.split(/\n{2,}/).map((p) => '<p>' + esc(p).replace(/\n/g, '<br>') + '</p>').join('');
  }
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
        $('post-gallery').innerHTML = '';
        return;
      }
      document.title = p.title + ' — Nguyễn Viết Dương';
      $('post-title').textContent = p.title || '';
      $('post-meta').textContent = fmtDate(p.date) + (p.topic ? ' · ' + p.topic : '');
      const cover = toList(p.cover)[0];
      $('post-cover').innerHTML = cover ? '<img class="cover" src="' + esc(src(cover)) + '" alt="">' : '';
      const bodyEl = $('post-body');
      bodyEl.innerHTML = bodyHtml(p.body);
      // Ảnh chèn trong bài: sửa đường dẫn và bấm để xem lớn
      const inline = [...bodyEl.querySelectorAll('img')];
      inline.forEach((img) => { const s = img.getAttribute('src'); if (s) img.setAttribute('src', src(s)); });
      const inlineItems = inline.map((img) => ({ image: img.getAttribute('src'), title: img.getAttribute('alt') || '' }));
      inline.forEach((img, i) => { img.style.cursor = 'zoom-in'; img.addEventListener('click', () => openLightbox(inlineItems, i)); });
      // Bộ ảnh cuối bài
      const g = toList(p.gallery).map((img) => ({ image: img, title: p.title }));
      $('post-gallery').innerHTML = g.length
        ? '<h2>Bộ ảnh</h2><div class="post-gallery">' + g.map((it, i) =>
            '<button type="button" class="pg-item" data-i="' + i + '" aria-label="Xem ảnh ' + (i + 1) + '">' + imgOr(it.image, '', p.title) + '</button>').join('') + '</div>'
        : '';
      $('post-gallery').onclick = (e) => {
        const b = e.target.closest('.pg-item');
        if (b) openLightbox(g, +b.dataset.i);
      };
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
