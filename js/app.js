/* ═══════════════════════════════════════════════
   HoneyBee Learning — Main Application JS
   ═══════════════════════════════════════════════
   
   All product data is loaded from JSON files in data/
   Edit those files to change products, prices, images etc.
   ═══════════════════════════════════════════════ */

// ─── GLOBAL STATE ───
let learningProducts = [];
let returnGifts = [];
let reviewsData = { text: [], photos: [], videos: [] };
let selectedCandy = 'chocolate';
let currentLearningType = 'activity';
let currentCombo = '';
let currentPrice = '';

// ─── INIT ───
document.addEventListener('DOMContentLoaded', async () => {
    await Promise.all([
        loadProducts(),
        loadReturnGifts(),
        loadReviews()
    ]);
    initFilters();
    initReveal();
    initNavScroll();
});

// ─── DATA LOADERS ───
async function loadProducts() {
    try {
        const res = await fetch('data/products.json');
        learningProducts = await res.json();
        renderLearningProducts();
    } catch (e) { console.error('Failed to load products:', e); }
}

async function loadReturnGifts() {
    try {
        const res = await fetch('data/return-gifts.json');
        returnGifts = await res.json();
        renderReturnGifts();
    } catch (e) { console.error('Failed to load return gifts:', e); }
}

async function loadReviews() {
    try {
        const res = await fetch('data/reviews.json');
        reviewsData = await res.json();
        renderTestimonials();
        renderHomeVideoReviews();
    } catch (e) { console.error('Failed to load reviews:', e); }
}

// ─── RENDER LEARNING PRODUCTS ───
function renderLearningProducts(typeFilter) {
    const grid = document.getElementById('learningGrid');
    if (!grid) return;
    const type = typeFilter || currentLearningType;
    const filtered = learningProducts.filter(p => (p.productType || 'activity') === type);

    if (!filtered.length) {
        grid.innerHTML = '<div class="empty-state" style="margin:40px auto;"><span class="empty-icon">📦</span><p>No products in this category yet. Check back soon!</p></div>';
        return;
    }

    grid.innerHTML = filtered.map((p, i) => {
        const off = Math.round((1 - p.price / p.mrp) * 100);
        const badgeClass = p.badgeType === 'hot' ? 'badge-hot' : p.badgeType === 'new' ? 'badge-new' : 'badge-hot';
        return `
    <div class="learning-card reveal">
      <div class="lcard-img-wrap">
        <img src="${p.image}" alt="${p.title}" loading="lazy" onerror="this.parentElement.innerHTML='<span>${p.fallbackEmoji}</span>'">
        <div class="lcard-badges">
          <span class="${badgeClass}">${p.badge}</span>
          <div class="lcard-price"><span class="lcard-mrp">₹${p.mrp}</span>₹${p.price}</div>
        </div>
      </div>
      <div class="lcard-body">
        <div class="lcard-title">${p.title}</div>
        <div class="lcard-desc">${p.shortDesc}</div>
        <div class="lcard-tags">${p.tags.map(t => `<span class="lcard-tag">${t}</span>`).join('')}</div>
        <div class="lcard-footer">
          <span class="lcard-off">${off}% Off</span>
          <a href="product.html?id=${p.id}" class="lcard-btn">View &amp; Order 📚</a>
        </div>
      </div>
    </div>`;
    }).join('');
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => revealObs.observe(el));
}

// ─── LEARNING SUB-TAB SWITCHER ───
function switchLearning(type, btn) {
    currentLearningType = type;
    document.querySelectorAll('.learning-subtab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    renderLearningProducts(type);
}

// ─── RENDER RETURN GIFTS ───
function renderReturnGifts() {
    const grid = document.getElementById('giftsGrid');
    if (!grid) return;
    grid.innerHTML = returnGifts.map(g => {
        const isPremium = g.isPremium;
        const headerStyle = isPremium ? ' style="background:linear-gradient(135deg,#fff8e1,#ffe082);"' : '';
        const nameStyle = isPremium ? ' style="color:var(--brown);"' : '';
        const badgeStyle = isPremium ? ' style="background:var(--orange);"' : '';
        const btnStyle = isPremium ? ' style="background:var(--brown);"' : '';
        const btnEmoji = isPremium ? '👑' : '🎁';
        return `
    <div class="product-card reveal" data-category="${g.category}">
      <div class="card-header"${headerStyle}>
        <span class="card-emoji">${g.emoji}</span>
        <div class="card-name"${nameStyle}>${g.name}</div>
        <div class="price-badge"${badgeStyle}><span class="price-mrp">${g.mrpLabel}</span><span class="price-actual">₹${g.price}</span></div>
      </div>
      <div class="card-body">
        <ul class="card-items">
          ${g.items.map(item => `<li><span class="check">✓</span>${item}</li>`).join('')}
        </ul>
        <button class="card-btn"${btnStyle} onclick="openOrderModal('${g.name}','₹${g.price}',${g.hasCandy})">Customise & Order ${btnEmoji}</button>
      </div>
    </div>`;
    }).join('');
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => revealObs.observe(el));
}

// ─── RENDER TESTIMONIALS (text reviews) ───
function renderTestimonials() {
    const grid = document.getElementById('testiTrack');
    if (!grid || !reviewsData.text || !reviewsData.text.length) return;
    grid.innerHTML = reviewsData.text.map(r => `
    <div class="testi-card reveal">
      <div class="testi-quote">"</div>
      <div class="stars">${'★'.repeat(r.stars)}${'☆'.repeat(5 - r.stars)}</div>
      <div class="testi-text">${r.text}</div>
      <div class="testi-author">
        <div class="testi-avatar">${r.avatar}</div>
        <div><div class="testi-name">${r.name}</div><div class="testi-loc">${r.loc}</div></div>
      </div>
    </div>`).join('');
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => revealObs.observe(el));
}

// ─── RENDER HOME VIDEO REVIEWS (YouTube Shorts) ───
function renderHomeVideoReviews() {
    const grid = document.getElementById('videoTrack');
    if (!grid || !reviewsData.videos || !reviewsData.videos.length) return;

    grid.innerHTML = reviewsData.videos.map(r => {
        const ytId = r.youtube;
        const thumbUrl = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
        const embedUrl = `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&playsinline=1`;
        return `
        <div class="home-video-card">
            <div class="video-lazy-wrap" data-embed="${embedUrl}">
                <div class="video-play-overlay" onclick="loadYouTubeHome(this.parentElement)"
                     style="background-image:url('${thumbUrl}');">
                    <div class="video-thumb-gradient"></div>
                    <div class="video-play-circle">&#9654;</div>
                    <div class="video-play-meta">
                        <div class="video-play-name">${r.name}</div>
                        <div class="video-play-loc">${r.loc}</div>
                    </div>
                </div>
            </div>
            <div class="home-video-caption">
                <div class="stars">${'★'.repeat(r.stars)}${'☆'.repeat(5 - r.stars)}</div>
                <p class="testi-text" style="margin:8px 0 6px;">${r.text}</p>
                <div class="testi-name">${r.name} <span class="testi-loc" style="font-weight:600;">· ${r.loc}</span></div>
            </div>
        </div>`;
    }).join('');
}

function loadYouTubeHome(wrap) {
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

// ─── REVIEW TAB SWITCHER (home page) ───
function switchHomeReview(type, btn) {
    document.querySelectorAll('#homeReviewTabs .review-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('#testimonials .review-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('home-review-' + type).classList.add('active');
}

// ─── STREAM TABS ───
function switchStream(stream, btn) {
    document.querySelectorAll('.stream-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.stream-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('stream-' + stream).classList.add('active');
    setTimeout(() => {
        document.querySelectorAll('.reveal:not(.visible)').forEach(el => revealObs.observe(el));
    }, 100);
}

// ─── FILTERS ───
function initFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const f = btn.dataset.filter;
            document.querySelectorAll('.product-card').forEach(c => c.classList.toggle('hidden', f !== 'all' && c.dataset.category !== f));
        });
    });
}

// ─── DETAIL MODAL ───
function openDetailModal(idx) {
    const p = learningProducts[idx];
    document.getElementById('dmImg').src = p.image;
    document.getElementById('dmTitle').textContent = p.title;
    document.getElementById('dmPrice').textContent = '₹' + p.price;
    document.getElementById('dmMrp').textContent = 'M.R.P.: ₹' + p.mrp;
    document.getElementById('dmOff').textContent = Math.round((1 - p.price / p.mrp) * 100) + '% Off';
    document.getElementById('dmDesc').textContent = p.fullDesc;
    document.getElementById('dmTags').innerHTML = p.tags.map(t => `<span class="dmodal-tag">${t}</span>`).join('');
    document.getElementById('dmBtn').onclick = () => {
        const msg = encodeURIComponent(`🍯 *HoneyBee Learning — Order Enquiry* 📚\n\n*Product:* ${p.title}\n*Price:* ₹${p.price} (MRP: ₹${p.mrp})\n\nI'd like to order this product. Please share personalisation details and payment info.\n\n_Sent from HoneyBee Learning website_`);
        window.open(`https://wa.me/918883624873?text=${msg}`, '_blank');
    };
    document.getElementById('dmodalOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closeDetailModal() { document.getElementById('dmodalOverlay').classList.remove('open'); document.body.style.overflow = ''; }
function closeDetailOnBg(e) { if (e.target === document.getElementById('dmodalOverlay')) closeDetailModal(); }

// ─── ORDER MODAL ───
function openOrderModal(name, price, hasCandy) {
    currentCombo = name; currentPrice = price;
    document.getElementById('modalCombo').textContent = name;
    document.getElementById('modalPrice').textContent = price;
    document.getElementById('candyGroup').style.display = hasCandy ? 'block' : 'none';
    document.getElementById('orderForm').style.display = 'block';
    document.getElementById('successScreen').classList.remove('show');
    document.getElementById('formError').style.display = 'none';
    const minDate = new Date(); minDate.setDate(minDate.getDate() + 3);
    document.getElementById('deliveryDate').min = minDate.toISOString().split('T')[0];
    document.getElementById('modalOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closeOrderModal() {
    document.getElementById('modalOverlay').classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => {
        document.getElementById('orderForm').style.display = 'block';
        document.getElementById('successScreen').classList.remove('show');
        ['buyerName', 'buyerPhone', 'childName', 'address', 'notes'].forEach(id => document.getElementById(id).value = '');
        document.getElementById('quantity').value = 10;
        document.getElementById('ageGroup').value = '';
        document.getElementById('deliveryDate').value = '';
        selectCandy('chocolate');
    }, 300);
}
function closeModalOnBg(e) { if (e.target === document.getElementById('modalOverlay')) closeOrderModal(); }
function selectCandy(type) {
    selectedCandy = type;
    document.getElementById('candy1').classList.toggle('selected', type === 'chocolate');
    document.getElementById('candy2').classList.toggle('selected', type === 'kadala');
    document.getElementById('candy3').classList.toggle('selected', type === 'chikki');
}
function submitOrder() {
    const name = document.getElementById('buyerName').value.trim();
    const phone = document.getElementById('buyerPhone').value.trim();
    const child = document.getElementById('childName').value.trim();
    const qty = document.getElementById('quantity').value;
    const ddate = document.getElementById('deliveryDate').value;
    const addr = document.getElementById('address').value.trim();
    const age = document.getElementById('ageGroup').value;
    const notes = document.getElementById('notes').value.trim();
    const errEl = document.getElementById('formError');
    const showCandy = document.getElementById('candyGroup').style.display !== 'none';
    const candyMap = { chocolate: '🍫 Chocolate', kadala: '🥜 Kadala Mittai', chikki: '🍬 Chikki' };
    if (!name || !phone || !child || !qty || !ddate || !addr) { errEl.textContent = '⚠️ Please fill in all required fields marked with *'; errEl.style.display = 'block'; return; }
    if (!/^\d{10}$/.test(phone.replace(/\s/g, ''))) { errEl.textContent = '⚠️ Please enter a valid 10-digit phone number.'; errEl.style.display = 'block'; return; }
    errEl.style.display = 'none';
    const orderId = 'HBC' + Date.now().toString().slice(-6);
    const deliveryFmt = new Date(ddate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    const msg = encodeURIComponent(`🍯 *New HoneyBee Order* 🎁\n\n*Order ID:* ${orderId}\n*Combo:* ${currentCombo} (${currentPrice} x ${qty} sets)\n\n*👤 Buyer:* ${name}\n*📞 Phone:* ${phone}\n*🧒 Child's Name:* ${child}${age ? '\n*🎂 Age Group:* ' + age : ''}${showCandy ? '\n*🍬 Candy:* ' + candyMap[selectedCandy] : ''}\n\n*📅 Needed By:* ${deliveryFmt}\n*📍 Delivery Address:* ${addr}${notes ? '\n*📝 Notes:* ' + notes : ''}\n\n_Sent from HoneyBee Learning website_`);
    const waLink = `https://wa.me/918883624873?text=${msg}`;
    document.getElementById('orderIdBox').textContent = `ORDER #${orderId}`;
    document.getElementById('whatsappLink').href = waLink;
    document.getElementById('orderForm').style.display = 'none';
    document.getElementById('successScreen').classList.add('show');
    setTimeout(() => window.open(waLink, '_blank'), 600);
}

// ─── SCROLL REVEAL ───
const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            entry.target.style.transitionDelay = (i % 4) * 0.1 + 's';
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

function initReveal() {
    document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));
}

// ─── NAV ACTIVE SCROLL ───
function initNavScroll() {
    window.addEventListener('scroll', () => {
        let current = '';
        document.querySelectorAll('section[id]').forEach(s => {
            if (window.scrollY >= s.offsetTop - 120) current = s.id;
        });
        document.querySelectorAll('.nav-links a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
    });
}

// ─── CAROUSEL SCROLL ───
function scrollCarousel(trackId, dir) {
    const track = document.getElementById(trackId);
    if (!track) return;
    // Scroll by one card width
    const card = track.firstElementChild;
    const step = card ? card.offsetWidth + 20 : 300;
    track.scrollBy({ left: dir * step, behavior: 'smooth' });
}
