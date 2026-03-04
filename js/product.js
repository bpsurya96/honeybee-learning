/* ═══════════════════════════════════════════════
   HoneyBee Learning — Product Page JS
   ═══════════════════════════════════════════════
   Products loaded from split files:
     • data/products_activity.json
     • data/products_reusable.json
     • data/products_other.json
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
        products = [...activity, ...reusable, ...other];
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
    const id = parseInt(params.get('id'));
    p = products.find(item => item.id === id) || products[0];
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

    // Build gallery thumbs + dot indicators
    const tc = document.getElementById('thumbsContainer');
    const dc = document.getElementById('galleryDots');
    p.images.forEach((src, i) => {
        // Thumbnail
        const div = document.createElement('div');
        div.className = 'gallery-thumb' + (i === 0 ? ' active' : '');
        div.innerHTML = `<img src="${src}" alt="View ${i + 1}" loading="lazy">`;
        div.onclick = () => setMainImg(i);
        tc.appendChild(div);

        // Dot
        if (dc) {
            const dot = document.createElement('button');
            dot.className = 'gallery-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `View image ${i + 1}`);
            dot.onclick = () => setMainImg(i);
            dc.appendChild(dot);
        }
    });
    setMainImg(0);

    // Click main image to open lightbox
    const mainImgEl = document.getElementById('mainImg');
    mainImgEl.addEventListener('click', () => {
        document.getElementById('lightboxImg').src = p.images[currentImgIdx];
        document.getElementById('lightbox').classList.add('open');
    });

    // ─── Touch swipe support ───
    let touchStartX = 0;
    let touchStartY = 0;
    const galleryEl = document.getElementById('galleryMain');
    galleryEl.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    galleryEl.addEventListener('touchend', (e) => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        // Only count as a horizontal swipe if X movement > Y (not a scroll)
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
            if (dx < 0) nextImg();   // swipe left = next
            else prevImg();   // swipe right = prev
        }
    }, { passive: true });
}

function setMainImg(idx) {
    currentImgIdx = idx;
    const mainImgEl = document.getElementById('mainImg');
    // Fade out, swap src, fade in — prevents flash of wrong-size image
    mainImgEl.style.opacity = '0';
    setTimeout(() => {
        mainImgEl.src = p.images[idx];
        mainImgEl.style.opacity = '1';
    }, 80);
    // Sync thumbs
    document.querySelectorAll('.gallery-thumb').forEach((t, i) => t.classList.toggle('active', i === idx));
    // Sync dots
    document.querySelectorAll('.gallery-dot').forEach((d, i) => d.classList.toggle('active', i === idx));
}
function nextImg() { setMainImg((currentImgIdx + 1) % p.images.length); }
function prevImg() { setMainImg((currentImgIdx - 1 + p.images.length) % p.images.length); }
function closeLightbox() { document.getElementById('lightbox').classList.remove('open'); }

function renderStars(n) { return '★'.repeat(n) + '☆'.repeat(5 - n); }

// ─── AVATAR HELPERS ───
function getInitials(name) {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}
const AVATAR_COLORS = ['#3d6b24', '#f4a227', '#6b3a1f', '#5a9435', '#d35400', '#1a6b5a', '#8b5a3a', '#c0392b'];
function avatarColor(name) {
    let h = 0; for (const c of name) h = c.charCodeAt(0) + ((h << 5) - h);
    return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

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
                <div class="review-avatar testi-avatar-initials" style="background:${avatarColor(r.name)}">${getInitials(r.name)}</div>
                <div>
                    <div class="review-name">${r.name}</div>
                    <div class="review-loc">${r.loc}${r.date ? ` &nbsp;&middot;&nbsp; <span class="review-date">${r.date}</span>` : ''}</div>
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

// ─────────────────────────────────────────────────
//  CUSTOMISE YOUR OWN — Interactive Logic
// ─────────────────────────────────────────────────

let selectedProductType = '';

// Theme chip selection
function selectTheme(btn, value) {
    // Deselect all chips
    document.querySelectorAll('.theme-chip').forEach(c => c.classList.remove('selected'));
    btn.classList.add('selected');

    const input = document.getElementById('customThemeInput');
    if (value) {
        // Pre-fill input with the chosen theme
        input.value = value;
        input.style.display = 'none';
    } else {
        // "My Own Theme" — show and focus the input
        input.value = '';
        input.style.display = 'block';
        input.focus();
    }
}

// Product type card selection
function selectProductType(card, typeLabel) {
    document.querySelectorAll('.pt-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    selectedProductType = typeLabel;
}

// Submit custom order via WhatsApp
function submitCustomOrder() {
    const themeInput = (document.getElementById('customThemeInput').value || '').trim();
    const selectedChip = document.querySelector('.theme-chip.selected:not(.custom-chip)');
    const theme = themeInput || (selectedChip ? selectedChip.textContent.trim() : '');

    const childName = (document.getElementById('custChildName').value || '').trim();
    const age = document.getElementById('custAge').value;
    const qty = document.getElementById('custQty').value;
    const budget = document.getElementById('custBudget').value;
    const phone = (document.getElementById('custPhone').value || '').trim();
    const time = document.getElementById('custTime').value;
    const notes = (document.getElementById('custNotes').value || '').trim();
    const errEl = document.getElementById('custError');

    // Collect checked special features
    const specials = [...document.querySelectorAll('.special-chip input:checked')]
        .map(cb => cb.value);

    // Validation
    if (!theme) {
        showCustError('⚠️ Please pick a theme or type your own in the text box.');
        return;
    }
    if (!childName) {
        showCustError("⚠️ Please enter your child's name.");
        return;
    }
    if (!age) {
        showCustError('⚠️ Please select your child\'s age group.');
        return;
    }
    if (!phone || !/^\d{10}$/.test(phone.replace(/\s/g, ''))) {
        showCustError('⚠️ Please enter a valid 10-digit WhatsApp number.');
        return;
    }
    errEl.style.display = 'none';

    // Build a rich, structured WhatsApp message
    let msg = `🍯 *HoneyBee Learning — Custom Book Request* 🎨\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    msg += `🖼️ *Theme:* ${theme}\n`;
    if (selectedProductType) msg += `📦 *Product Type:* ${selectedProductType}\n`;
    msg += `\n👶 *Child's Name:* ${childName}\n`;
    msg += `🎂 *Age Group:* ${age}\n`;
    if (qty) msg += `🔢 *Quantity:* ${qty}\n`;
    if (budget) msg += `💰 *Budget:* ${budget}\n`;

    if (specials.length) {
        msg += `\n✨ *Special Requests:*\n`;
        specials.forEach(s => { msg += `  • ${s}\n`; });
    }

    if (notes) {
        msg += `\n📝 *Additional Details:*\n${notes}\n`;
    }

    msg += `\n📞 *WhatsApp:* ${phone}`;
    if (time) msg += `\n⏰ *Best Time to Reach:* ${time}`;

    msg += `\n\n━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `_Sent from HoneyBee Learning custom order form_`;

    window.open(`https://wa.me/918883624873?text=${encodeURIComponent(msg)}`, '_blank');
}

function showCustError(msg) {
    const errEl = document.getElementById('custError');
    errEl.textContent = msg;
    errEl.style.display = 'block';
    errEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

