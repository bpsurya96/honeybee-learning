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
    } catch (e) { console.error('Failed to load reviews:', e); }
}

// ─── RENDER LEARNING PRODUCTS ───
function renderLearningProducts() {
    const grid = document.getElementById('learningGrid');
    if (!grid) return;
    grid.innerHTML = learningProducts.map((p, i) => {
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
          <a href="product.html?id=${p.id}" class="lcard-btn">View & Order 📚</a>
        </div>
      </div>
    </div>`;
    }).join('');
    // Re-observe new reveal elements
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => revealObs.observe(el));
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

// ─── RENDER TESTIMONIALS ───
function renderTestimonials() {
    const grid = document.getElementById('testiGrid');
    if (!grid || !reviewsData.text.length) return;
    // Show first 3 text reviews on home page
    const shown = reviewsData.text.slice(0, 3);
    grid.innerHTML = shown.map(r => `
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
