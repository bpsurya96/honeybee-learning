/* ═══════════════════════════════════════════════
   HoneyBee Learning — Product Page JS
   ═══════════════════════════════════════════════
   Product data loaded from data/products.json
   Reviews loaded from data/reviews.json
   ═══════════════════════════════════════════════ */

let products = [];
let reviews = { text: [], photos: [], videos: [] };
let currentImgIdx = 0;
let p = null;

document.addEventListener('DOMContentLoaded', async () => {
    await Promise.all([loadProducts(), loadReviews()]);
    initProduct();
    initReviews();
    initKeyboardNav();
});

async function loadProducts() {
    try {
        const res = await fetch('data/products.json');
        products = await res.json();
    } catch (e) { console.error('Failed to load products:', e); }
}

async function loadReviews() {
    try {
        const res = await fetch('data/reviews.json');
        reviews = await res.json();
    } catch (e) { console.error('Failed to load reviews:', e); }
}

function initProduct() {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id')) || 0;
    p = products[id] || products[0];
    if (!p) return;

    document.title = p.title + ' — HoneyBee Learning';
    document.getElementById('productBadge').textContent = p.badge;
    document.getElementById('productTitle').textContent = p.title;
    document.getElementById('priceSell').textContent = '₹' + p.price;
    document.getElementById('priceMrp').textContent = 'M.R.P.: ₹' + p.mrp;
    document.getElementById('priceOff').textContent = Math.round((1 - p.price / p.mrp) * 100) + '% Off';
    document.getElementById('productDesc').textContent = p.fullDesc;
    document.getElementById('productTags').innerHTML = p.tags.map(t => `<span class="product-tag">${t}</span>`).join('');

    const msg = encodeURIComponent(`🍯 *HoneyBee Learning — Order Enquiry* 📚\n\n*Product:* ${p.title}\n*Price:* ₹${p.price} (MRP: ₹${p.mrp})\n\nI'd like to order this product. Please share personalisation details and payment info.\n\n_Sent from HoneyBee Learning website_`);
    document.getElementById('orderBtn').href = `https://wa.me/918883624873?text=${msg}`;

    // Build gallery thumbs
    const tc = document.getElementById('thumbsContainer');
    p.images.forEach((src, i) => {
        const div = document.createElement('div');
        div.className = 'gallery-thumb' + (i === 0 ? ' active' : '');
        div.innerHTML = `<img src="${src}" alt="View ${i + 1}" loading="lazy">`;
        div.onclick = () => setMainImg(i);
        tc.appendChild(div);
    });
    setMainImg(0);

    // Click main image to open lightbox
    document.getElementById('mainImg').addEventListener('click', () => {
        document.getElementById('lightboxImg').src = p.images[currentImgIdx];
        document.getElementById('lightbox').classList.add('open');
    });
}

function setMainImg(idx) {
    currentImgIdx = idx;
    document.getElementById('mainImg').src = p.images[idx];
    document.querySelectorAll('.gallery-thumb').forEach((t, i) => t.classList.toggle('active', i === idx));
}
function nextImg() { setMainImg((currentImgIdx + 1) % p.images.length); }
function prevImg() { setMainImg((currentImgIdx - 1 + p.images.length) % p.images.length); }
function closeLightbox() { document.getElementById('lightbox').classList.remove('open'); }

function renderStars(n) { return '★'.repeat(n) + '☆'.repeat(5 - n); }

function switchReview(type, btn) {
    document.querySelectorAll('.review-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.review-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('review-' + type).classList.add('active');
}

function initReviews() {
    // ── Text reviews ──
    const trg = document.getElementById('textReviewGrid');
    if (reviews.text && reviews.text.length) {
        trg.innerHTML = reviews.text.map(r => `
        <div class="review-card">
            <div class="review-stars">${renderStars(r.stars)}</div>
            <div class="review-text">${r.text}</div>
            <div class="review-author">
                <div class="review-avatar">${r.avatar}</div>
                <div>
                    <div class="review-name">${r.name}</div>
                    <div class="review-loc">${r.loc}</div>
                </div>
            </div>
        </div>`).join('');
    } else {
        trg.innerHTML = '<div class="empty-state"><span class="empty-icon">💬</span><p>No text reviews yet. Be the first to share!</p></div>';
    }

    // ── Photo reviews ──
    const prg = document.getElementById('photoReviewGrid');
    if (reviews.photos && reviews.photos.length) {
        prg.innerHTML = reviews.photos.map(r => `
        <div class="photo-review" onclick="document.getElementById('lightboxImg').src='${r.img}';document.getElementById('lightbox').classList.add('open');">
            <img src="${r.img}" alt="Review by ${r.name}" loading="lazy">
            <div class="photo-caption">
                <div class="review-stars">${renderStars(r.stars)}</div>
                <p>${r.text}</p>
                <div class="pname">— ${r.name}</div>
            </div>
        </div>`).join('');
    } else {
        prg.innerHTML = '<div class="empty-state"><span class="empty-icon">📸</span><p>No photo reviews yet. Share your child\'s experience!</p></div>';
    }

    // ── Video reviews — YouTube Shorts embed ──
    // Uses YouTube's thumbnail as preview. Video loads only when user taps play.
    // Works on all devices, no storage/bandwidth issues.
    const vrg = document.getElementById('videoReviewGrid');
    if (reviews.videos && reviews.videos.length) {
        vrg.innerHTML = reviews.videos.map(r => {
            const ytId = r.youtube;
            const thumbUrl = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
            const embedUrl = `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&playsinline=1`;
            return `
            <div class="video-review">
                <div class="video-lazy-wrap" data-embed="${embedUrl}">
                    <!-- YouTube thumbnail used as poster — loads only a small image, not the video -->
                    <div class="video-play-overlay" onclick="loadYouTubeEmbed(this.parentElement)"
                         style="background-image:url('${thumbUrl}');">
                        <div class="video-thumb-gradient"></div>
                        <div class="video-play-circle">&#9654;</div>
                        <div class="video-play-meta">
                            <div class="video-play-name">${r.name}</div>
                            <div class="video-play-loc">${r.loc}</div>
                        </div>
                    </div>
                </div>
                <div class="video-caption">
                    <div class="review-stars">${renderStars(r.stars)}</div>
                    <p>${r.text}</p>
                    <div class="pname">— ${r.name}, <span>${r.loc}</span></div>
                </div>
            </div>`;
        }).join('');
    } else {
        vrg.innerHTML = '<div class="empty-state"><span class="empty-icon">🎥</span><p>No video reviews yet. Record your child\'s reaction!</p></div>';
    }
}

// Replaces the thumbnail overlay with the actual YouTube iframe on tap
function loadYouTubeEmbed(wrap) {
    const embedUrl = wrap.dataset.embed;
    if (!embedUrl) return;
    wrap.innerHTML = `<iframe
        src="${embedUrl}"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        style="width:100%;aspect-ratio:9/16;display:block;border-radius:var(--radius) var(--radius) 0 0;background:#000;">
    </iframe>`;
    delete wrap.dataset.embed;
}

function initKeyboardNav() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') nextImg();
        if (e.key === 'ArrowLeft') prevImg();
        if (e.key === 'Escape') closeLightbox();
    });
}

// ─── CAROUSEL SCROLL (shared with home page) ───
function scrollCarousel(trackId, dir) {
    const track = document.getElementById(trackId);
    if (!track) return;
    const card = track.firstElementChild;
    const step = card ? card.offsetWidth + 20 : 300;
    track.scrollBy({ left: dir * step, behavior: 'smooth' });
}
