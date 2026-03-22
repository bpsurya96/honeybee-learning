/* ═══════════════════════════════════════════════
   HoneyBee Learning — Main Application JS
   ═══════════════════════════════════════════════

   Products are loaded from 3 split files:
     • data/products_activity.json  — Activity books
     • data/products_reusable.json  — Reusable wipe & learn
     • data/products_other.json     — Flashcards & charts
   Edit the relevant file to update that type.
   ═══════════════════════════════════════════════ */

// ─── GLOBAL STATE ───
let learningProducts = [];
let returnGifts = [];
let reviewsData = { text: [], photos: [], videos: [] };
let selectedCandy = 'chocolate';
let currentLearningType = 'activity';
let currentCombo = '';
let currentPrice = '';
let searchQuery = '';
const PRODUCTS_PER_PAGE = 6;
let currentProductPage = 1;

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

    initFAQ();

    // ─── Auto-switch tab from URL param (e.g. ?tab=learning) ───
    const tabParam = new URLSearchParams(window.location.search).get('tab');
    if (tabParam) {
        const tabBtn = document.getElementById('tab-' + tabParam);
        if (tabBtn) {
            switchStream(tabParam, tabBtn);
            // Scroll to the section after a short delay to let layout settle
            setTimeout(() => {
                const el = document.getElementById('streams');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 150);
        }
    }
});

// ─── INIT FAQ ───
function initFAQ() {
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const answer = btn.nextElementSibling;
            const isActive = item.classList.contains('active');

            // Close all
            document.querySelectorAll('.faq-item').forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-answer').style.maxHeight = null;
            });

            // Open clicked if it wasn't active
            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });
}

// ─── DATA LOADERS ───
async function loadProducts() {
    try {
        // Load all 3 split files in parallel and merge into one array
        const [activityRes, reusableRes, otherRes] = await Promise.all([
            fetch('data/products_activity.json'),
            fetch('data/products_reusable.json'),
            fetch('data/products_other.json')
        ]);
        const [activity, reusable, other] = await Promise.all([
            activityRes.json(),
            reusableRes.json(),
            otherRes.json()
        ]);
        learningProducts = [...activity, ...reusable, ...other];
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
        renderHomePhotoReviews();
        renderHomeVideoReviews();
    } catch (e) { console.error('Failed to load reviews:', e); }
}

// ─── RENDER LEARNING PRODUCTS (with pagination) ───
function renderLearningProducts(typeFilter, resetPage) {
    const grid = document.getElementById('learningGrid');
    if (!grid) return;
    const type = typeFilter || currentLearningType;

    if (resetPage !== false) currentProductPage = 1;

    // When a search query is active, search across ALL product types.
    // Otherwise, filter to only the active tab's type.
    const filtered = learningProducts.filter(p => {
        const matchesSearch = !searchQuery ||
            p.title.toLowerCase().includes(searchQuery) ||
            (p.shortDesc && p.shortDesc.toLowerCase().includes(searchQuery)) ||
            (p.tags && p.tags.some(t => t.toLowerCase().includes(searchQuery))) ||
            (p.keywords && p.keywords.some(k => k.toLowerCase().includes(searchQuery)));

        if (searchQuery) {
            // Search mode: ignore type tab, show from all types
            return matchesSearch;
        } else {
            // Browse mode: filter by active tab type
            return (p.productType || 'activity') === type;
        }
    });

    // Show a hint banner when search is returning cross-type results
    const searchBanner = searchQuery
        ? `<div style="grid-column:1/-1;background:var(--honey-pale,#fff8e1);border:1.5px solid var(--honey,#f4a227);border-radius:10px;padding:10px 16px;font-size:0.85rem;font-weight:600;color:var(--brown,#6b3a1f);margin-bottom:4px;">🔍 Showing results across <strong>all categories</strong> for "${searchQuery}"</div>`
        : '';

    if (!filtered.length) {
        if (searchQuery) {
            grid.innerHTML = renderSearchNotFound(searchQuery);
        } else {
            grid.innerHTML = '<div class="empty-state" style="margin:40px auto; text-align: center; grid-column: 1/-1;"><span class="empty-icon">📦</span><p>No products in this category yet. Check back soon!</p></div>';
        }
        return;
    }

    // Pagination slice
    const totalToShow = currentProductPage * PRODUCTS_PER_PAGE;
    const visible = filtered.slice(0, totalToShow);
    const hasMore = filtered.length > totalToShow;

    const cardsHTML = visible.map((p) => {
        const badgeClass = p.badgeType === 'hot' ? 'badge-hot' : p.badgeType === 'new' ? 'badge-new' : 'badge-hot';
        return `
    <div class="learning-card reveal">
      <div class="lcard-img-wrap">
        <img src="${p.image}" alt="${p.title} — personalised activity book for kids, HoneyBee Learning" loading="lazy" onerror="this.parentElement.innerHTML='<span>${p.fallbackEmoji}</span>'">
        <div class="lcard-badges">
          <span class="${badgeClass}">${p.badge}</span>
          <div class="lcard-price">₹${p.price}</div>
        </div>
      </div>
      <div class="lcard-body">
        <div class="lcard-title">${p.title}</div>
        <div class="lcard-desc">${p.shortDesc}</div>
        <div class="lcard-tags">${p.tags.map(t => `<span class="lcard-tag">${t}</span>`).join('')}</div>
        <div class="lcard-footer">
          <a href="product.html?id=${p.id}" class="lcard-btn">View &amp; Order 📚</a>
        </div>
      </div>
    </div>`;
    }).join('');

    const loadMoreHTML = hasMore ? `
    <div class="load-more-wrap" style="grid-column: 1/-1; text-align: center; margin-top: 12px;">
        <div class="load-more-info">Showing ${visible.length} of ${filtered.length} products</div>
        <button class="load-more-btn" onclick="loadMoreProducts()">
            Load More Products ↓
        </button>
    </div>` : `
    <div class="load-more-wrap" style="grid-column: 1/-1; text-align: center; margin-top: 12px;">
        <div class="load-more-info all-loaded">✅ Showing all ${filtered.length} product${filtered.length !== 1 ? 's' : ''}</div>
    </div>`;

    grid.innerHTML = searchBanner + cardsHTML + loadMoreHTML;
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => revealObs.observe(el));
}

// ─── LOAD MORE ───
function loadMoreProducts() {
    currentProductPage++;
    renderLearningProducts(currentLearningType, false);
    // Smooth scroll to newly loaded items
    setTimeout(() => {
        const loadMoreBtn = document.querySelector('.load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, 100);
}

// ─── SEARCH NOT FOUND — WhatsApp Enquiry Form ───
function renderSearchNotFound(query) {
    return `
    <div class="search-notfound-wrap" style="grid-column: 1/-1;">
        <div class="snf-card">
            <div class="snf-icon">🔍</div>
            <h3 class="snf-title">We couldn't find "${query}"</h3>
            <p class="snf-sub">But don't worry! We can create <strong>custom personalised books & products</strong> for any theme. Tell us what you're looking for and we'll get back to you on WhatsApp! 💬</p>

            <div class="snf-form" id="snfForm">
                <div class="snf-form-row">
                    <div class="snf-form-group">
                        <label class="snf-label">What theme are you looking for? *</label>
                        <input type="text" id="snfTheme" class="snf-input" placeholder="e.g. Minions, Superhero, Tamil festival..." value="${query}">
                    </div>
                    <div class="snf-form-group">
                        <label class="snf-label">Product type you need?</label>
                        <select id="snfType" class="snf-input">
                            <option value="">Select type (optional)</option>
                            <option value="Activity Book">📚 Activity Book</option>
                            <option value="Reusable Book">♻️ Reusable Wipe &amp; Learn Book</option>
                            <option value="Flashcards">🃏 Flashcards</option>
                            <option value="Return Gift Set">🎁 Birthday Return Gift Set</option>
                            <option value="Custom">🎨 Custom / Not sure</option>
                        </select>
                    </div>
                </div>
                <div class="snf-form-row">
                    <div class="snf-form-group">
                        <label class="snf-label">Child's age group?</label>
                        <select id="snfAge" class="snf-input">
                            <option value="">Select age (optional)</option>
                            <option value="1-2 years">1–2 years (Toddler)</option>
                            <option value="3-5 years">3–5 years (Preschool/LKG)</option>
                            <option value="6-8 years">6–8 years (Class 1–3)</option>
                            <option value="9-12 years">9–12 years (Class 4–7)</option>
                        </select>
                    </div>
                    <div class="snf-form-group">
                        <label class="snf-label">Your WhatsApp number *</label>
                        <input type="tel" id="snfPhone" class="snf-input" placeholder="10-digit number">
                    </div>
                </div>
                <div class="snf-form-group">
                    <label class="snf-label">Anything else you'd like? (optional)</label>
                    <textarea id="snfNotes" class="snf-input snf-textarea" placeholder="e.g. personalised with child's name, quantity needed, budget range..."></textarea>
                </div>
                <p id="snfError" style="color:#c0392b;font-size:0.85rem;font-weight:700;display:none;margin-bottom:8px;"></p>
                <button class="snf-submit-btn" onclick="submitSnfForm()">
                    <span>Send Enquiry via WhatsApp 💬</span>
                </button>
                <p class="snf-note">We'll reply within a few hours to help you find exactly what you need!</p>
            </div>

            <div class="snf-or-divider"><span>or</span></div>
            <button class="snf-clear-btn" onclick="clearSearch()">← Clear Search &amp; Browse All Products</button>
        </div>
    </div>`;
}

// ─── SUBMIT SEARCH NOT FOUND FORM ───
function submitSnfForm() {
    const theme = (document.getElementById('snfTheme').value || '').trim();
    const phone = (document.getElementById('snfPhone').value || '').trim();
    const type = document.getElementById('snfType').value;
    const age = document.getElementById('snfAge').value;
    const notes = (document.getElementById('snfNotes').value || '').trim();
    const errEl = document.getElementById('snfError');

    if (!theme) { errEl.textContent = '⚠️ Please enter the theme you are looking for.'; errEl.style.display = 'block'; return; }
    if (!phone || !/^\d{10}$/.test(phone.replace(/\s/g, ''))) { errEl.textContent = '⚠️ Please enter a valid 10-digit WhatsApp number.'; errEl.style.display = 'block'; return; }
    errEl.style.display = 'none';

    let msg = `🍯 *HoneyBee Learning — Custom Theme Enquiry* 🎨\n\n*Looking for:* ${theme}`;
    if (type) msg += `\n*Product Type:* ${type}`;
    if (age) msg += `\n*Age Group:* ${age}`;
    if (notes) msg += `\n*Additional Details:* ${notes}`;
    msg += `\n*WhatsApp:* ${phone}\n\n_Sent from HoneyBee Learning search_`;

    window.open(`https://wa.me/918883624873?text=${encodeURIComponent(msg)}`, '_blank');
}

// ─── LEARNING SUB-TAB SWITCHER ───
function switchLearning(type, btn) {
    currentLearningType = type;
    currentProductPage = 1;
    document.querySelectorAll('.learning-subtab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    renderLearningProducts(type);
}

// ─── SEARCH HANDLER ───
function handleSearch(val) {
    searchQuery = val.toLowerCase().trim();
    renderLearningProducts();
    renderReturnGifts();
}

function clearSearch() {
    searchQuery = '';
    const searchInput = document.getElementById('productSearch');
    if (searchInput) searchInput.value = '';
    renderLearningProducts();
    renderReturnGifts();
}

// ─── RENDER RETURN GIFTS ───
function renderReturnGifts() {
    const grid = document.getElementById('giftsGrid');
    if (!grid) return;

    const activeFilterBtn = document.querySelector('.filter-btn.active');
    const f = activeFilterBtn ? activeFilterBtn.dataset.filter : 'all';

    const filtered = returnGifts.filter(g => {
        const matchesCategory = f === 'all' || g.category === f;
        const matchesSearch = !searchQuery ||
            g.name.toLowerCase().includes(searchQuery) ||
            g.items.some(item => item.toLowerCase().includes(searchQuery));
        return matchesCategory && matchesSearch;
    });

    if (!filtered.length) {
        if (searchQuery) {
            grid.innerHTML = `<div class="empty-state" style="margin:40px auto; grid-column: 1/-1; text-align: center;">
                <span class="empty-icon" style="font-size:3rem;display:block;margin-bottom:10px;">🔍</span>
                <p style="font-weight:700;color:var(--text-soft);">No gift combos found for "${searchQuery}" in this filter.</p>
                <button onclick="clearSearch()" style="margin-top:15px;background:var(--green-pale);color:var(--green);border:none;padding:8px 20px;border-radius:50px;font-weight:800;cursor:pointer;">Clear Search</button>
            </div>`;
        } else {
            grid.innerHTML = '<div class="empty-state" style="margin:40px auto; text-align: center;"><span class="empty-icon">🎁</span><p>No items found in this category.</p></div>';
        }
        return;
    }

    grid.innerHTML = filtered.map(g => {
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

// ─── AVATAR HELPERS ───
function getInitials(name) {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}
const AVATAR_COLORS = ['#3d6b24', '#f4a227', '#6b3a1f', '#5a9435', '#d35400', '#1a6b5a', '#8b5a3a', '#c0392b'];
function avatarColor(name) {
    let h = 0; for (const c of name) h = c.charCodeAt(0) + ((h << 5) - h);
    return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
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
        <div class="testi-avatar testi-avatar-initials" style="background:${avatarColor(r.name)}">${getInitials(r.name)}</div>
        <div>
          <div class="testi-name">${r.name}</div>
          <div class="testi-loc">${r.loc}${r.date ? ` &nbsp;&middot;&nbsp; <span class="review-date">${r.date}</span>` : ''}</div>
        </div>
      </div>
    </div>`).join('');
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => revealObs.observe(el));
}

// ─── RENDER HOME PHOTO REVIEWS ───
function renderHomePhotoReviews() {
    const grid = document.getElementById('photoTrack');
    if (!grid || !reviewsData.photos || !reviewsData.photos.length) return;

    // render as flex column to match other cards
    grid.innerHTML = reviewsData.photos.map(r => `
    <div class="photo-review" onclick="openLightboxFromHome('${r.img}')" style="min-width: 280px; width: 280px; cursor: pointer; flex-shrink: 0; display: flex; flex-direction: column; overflow: hidden; border-radius: var(--radius); box-shadow: var(--shadow-card); background: white;">
        <img src="${r.img}" alt="Customer review photo — HoneyBee Learning personalised kids book" loading="lazy" style="width: 100%; height: 260px; object-fit: cover;">
        <div class="photo-caption" style="padding: 16px; display: flex; flex-direction: column; flex: 1;">
            ${r.stars ? `<div class="review-stars" style="color:var(--orange);font-size:1.1rem;margin-bottom:6px;">${renderStars(r.stars)}</div>` : ''}
            ${r.text ? `<p style="font-size:0.88rem;color:var(--text);margin-bottom:8px;line-height:1.5; flex: 1;">${r.text}</p>` : ''}
            ${r.name ? `<div class="pname" style="font-size:0.85rem;color:var(--text-soft);font-weight:700;text-align:right; margin-top: auto;">— ${r.name}${r.loc ? `, <span style="font-weight:600;">${r.loc}</span>` : ''}</div>` : ''}
        </div>
    </div>`).join('');
}

function renderStars(n) { return '★'.repeat(n) + '☆'.repeat(5 - n); }

function openLightboxFromHome(imgSrc) {
    const lightbox = document.getElementById('dmodalOverlay');
    if (lightbox) {
        // reuse the dmodal html we have
        document.getElementById('dmImg').src = imgSrc;
        document.getElementById('dmTitle').textContent = "Customer Photo";
        document.getElementById('dmPrice').textContent = '';
        document.getElementById('dmDesc').textContent = '';
        document.getElementById('dmTags').innerHTML = '';
        document.getElementById('dmBtn').style.display = 'none';
        document.querySelector('.dmodal-note').style.display = 'none';
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
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
            renderReturnGifts();
        });
    });
}

// ─── DETAIL MODAL ───
function openDetailModal(idx) {
    const p = learningProducts[idx];
    document.getElementById('dmImg').src = p.image;
    document.getElementById('dmTitle').textContent = p.title;
    document.getElementById('dmPrice').textContent = '₹' + p.price;
    document.getElementById('dmDesc').textContent = p.fullDesc;
    document.getElementById('dmTags').innerHTML = p.tags.map(t => `<span class="dmodal-tag">${t}</span>`).join('');
    document.getElementById('dmBtn').onclick = () => {
        const msg = encodeURIComponent(`🍯 *HoneyBee Learning — Order Enquiry* 📚\n\n*Product:* ${p.title}\n*Price:* ₹${p.price}\n\nI'd like to order this product. Please share personalisation details and payment info.\n\n_Sent from HoneyBee Learning website_`);
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
    document.getElementById('candy2').classList.toggle('selected', type === 'chikki');
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
    const candyMap = { chocolate: '🍫 Chocolate', chikki: '🍬 Chikki' };
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
