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
    await loadProducts();
    initProduct();
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
    document.getElementById('productDesc').textContent = p.fullDesc;
    document.getElementById('productTags').innerHTML = p.tags.map(t => `<span class="product-tag">${t}</span>`).join('');

    const msg = encodeURIComponent(`🍯 *HoneyBee Learning — Order Enquiry* 📚\n\n*Product:* ${p.title}\n*Price:* ₹${p.price}\n\nI'd like to order this product. Please share personalisation details and payment info.\n\n_Sent from HoneyBee Learning website_`);
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

    // Populate sticky order bar
    const msbTitle = document.getElementById('msbTitle');
    const msbPrice = document.getElementById('msbPrice');
    const msbBtn = document.getElementById('msbBtn');
    if (msbTitle) msbTitle.textContent = p.title;
    if (msbPrice) msbPrice.textContent = '₹' + p.price;
    if (msbBtn) msbBtn.href = `https://wa.me/918883624873?text=${msg}`;

    renderRelatedProducts();
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

function renderRelatedProducts() {
    const grid = document.getElementById('relatedGrid');
    if (!grid || !products.length || !p) return;

    // Filter out current product
    let related = products.filter(item => item.id !== p.id);

    // Prefer same product type if possible
    const sameType = related.filter(item => item.productType === p.productType);
    if (sameType.length >= 3) {
        related = sameType;
    }

    // Shuffle and pick 3
    related.sort(() => 0.5 - Math.random());
    const toShow = related.slice(0, 3);

    grid.innerHTML = toShow.map(item => {
        const badgeClass = item.badgeType === 'hot' ? 'badge-hot' : item.badgeType === 'new' ? 'badge-new' : 'badge-hot';
        return `
    <div class="learning-card">
      <div class="lcard-img-wrap">
        <img src="${item.image}" alt="${item.title}" loading="lazy" onerror="this.parentElement.innerHTML='<span>${item.fallbackEmoji || '📚'}</span>'">
        <div class="lcard-badges">
          <span class="${badgeClass}">${item.badge}</span>
          <div class="lcard-price">₹${item.price}</div>
        </div>
      </div>
      <div class="lcard-body" style="display:flex;flex-direction:column;">
        <div class="lcard-title">${item.title}</div>
        <div class="lcard-tags">${(item.tags || []).slice(0, 2).map(t => `<span class="lcard-tag">${t}</span>`).join('')}</div>
        <div class="lcard-footer" style="margin-top:auto;padding-top:12px;">
          <a href="product.html?id=${item.id}" class="lcard-btn" style="width:100%;text-align:center;">View Details 💡</a>
        </div>
      </div>
    </div>`;
    }).join('');
}

function shareProduct() {
    const url = window.location.href;
    const title = p.title + ' — HoneyBee Learning';
    const text = 'Check out this awesome personalised book from HoneyBee Learning!';

    if (navigator.share) {
        navigator.share({
            title: title,
            text: text,
            url: url
        }).catch(err => console.error('Error sharing', err));
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(url).then(() => {
            const btn = document.getElementById('shareBtn');
            const origHTML = btn.innerHTML;
            btn.innerHTML = '✅ Link Copied!';
            setTimeout(() => btn.innerHTML = origHTML, 2000);
        });
    }
}

// review logic removed

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

