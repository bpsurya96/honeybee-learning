/* ═══════════════════════════════════════════════
   HoneyBee Learning — Product Page Controller
   ═══════════════════════════════════════════════ */

let products = [];
let currentImgIdx = 0;
let p = null;
let selectedProductType = '';

document.addEventListener('DOMContentLoaded', async () => {
    await loadProducts();
    initProduct();
});

async function loadProducts() {
    try {
        const [activityRes, reusableRes, otherRes, storiesRes] = await Promise.all([
            fetch('data/products_activity.json'),
            fetch('data/products_reusable.json'),
            fetch('data/products_other.json'),
            fetch('data/products_stories.json')
        ]);
        const [activity, reusable, other, stories] = await Promise.all([
            activityRes.json(),
            reusableRes.json(),
            otherRes.json(),
            storiesRes.json()
        ]);
        // Tag divine stories so product page can detect them
        const divineTagged = stories.map(s => ({ ...s, productType: 'divine' }));
        products = [...activity, ...reusable, ...other, ...divineTagged];
    } catch (e) {
        console.error('Failed to load products:', e);
    }
}

// ─── DIVINE GOD COLOR MAP ───
const DIVINE_GOD_COLORS = {
    'Krishna': '#1a6b3c', 'Ganesha': '#e67e22', 'Hanuman': '#c0392b',
    'Durga': '#8e0c52', 'Kali': '#4A0E8F', 'Saraswati': '#8e44ad',
    'Siva': '#1a3a5c', 'Lakshmi': '#d4a017', 'Murugan': '#FF9933', 'Vishnu': '#1a3a7c', 'Rama': '#1a6b3c'
};

function buildDivineWALink(prod) {
    const msg = encodeURIComponent(
        'Hi HoneyBee Learning! 🕉️\n' +
        'I would like to order the Divine Story Book:\n' +
        '• ' + prod.title + '\n' +
        '• Price: ₹' + prod.price + '\n\n' +
        'Please share sample pages and tell me how to personalise it with my child’s name. 🙏'
    );
    return 'https://wa.me/918883624873?text=' + msg;
}

function initProduct() {
    const params = new URLSearchParams(window.location.search);
    const rawId = params.get('id');
    const id = (rawId && rawId.startsWith('ds-')) ? rawId : parseInt(rawId);
    
    p = products.find(item => String(item.id) === String(id)) || 
        products.find(item => item.id === parseInt(rawId)) || 
        products[0];
        
    if (!p) return;

    // Special routing for divine books
    if (p.productType === 'divine') {
        initDivineProduct(p);
        return;
    }

    // Dynamic Title & Meta
    document.title = (p.title || 'Personalised Activity Book') + ' — HoneyBee Learning';
    const badgeEl = document.getElementById('productBadge');
    if (badgeEl) badgeEl.textContent = p.badge || 'POPULAR';

    const titleEl = document.getElementById('productTitle');
    if (titleEl) titleEl.textContent = p.title;

    const sellEl = document.getElementById('priceSell');
    if (sellEl) sellEl.textContent = '₹' + p.price;

    // Compute MRP & Discount
    let mrp = p.mrp;
    if (!mrp) {
        if (p.price < 100) mrp = Math.round(p.price * 1.5);
        else if (p.price < 300) mrp = Math.round(p.price * 1.4);
        else mrp = Math.round(p.price * 1.35);
    }
    const mrpEl = document.getElementById('priceMrp');
    if (mrpEl) mrpEl.textContent = '₹' + mrp;
    const offEl = document.getElementById('priceDiscount');
    if (offEl) {
        const discount = Math.round(((mrp - p.price) / mrp) * 100);
        offEl.textContent = discount + '% OFF';
    }

    // Reusable Pill
    const reusablePill = document.getElementById('reusablePill');
    if (reusablePill) {
        const isReusable = p.productType === 'reusable' || 
                           (p.tags && p.tags.join(' ').toLowerCase().includes('reusable')) ||
                           (p.title && p.title.toLowerCase().includes('reusable'));
        reusablePill.style.display = isReusable ? 'inline-block' : 'none';
    }

    // Freebies Box (Flipkart Style)
    const freebiesContainer = document.getElementById('productFreebies');
    if (freebiesContainer) {
        let goodies = (p.freebies && p.freebies.length) ? p.freebies : [];
        if (!goodies.length) {
            // Sensible defaults based on product type
            if (p.productType === 'reusable') {
                goodies = ['✍️ Free Marker & Wiper Included', '⭐ Personalised Front Cover', '♻️ 100+ Wipe & Clean Uses'];
            } else if (p.productType === 'activity') {
                goodies = ['⭐ Personalised Child Cover', '🎨 Premium 250 GSM Sheets', '👶 100% Child-Safe Rounded Corners'];
            }
        }
        if (goodies.length) {
            freebiesContainer.innerHTML = `
                <div class="freebies-label">🎁 Free Goodies &amp; Inclusions</div>
                <div class="freebies-items">
                    ${goodies.map(f => `<span class="freebie-pill">${f}</span>`).join('')}
                </div>`;
            freebiesContainer.style.display = 'block';
        } else {
            freebiesContainer.style.display = 'none';
        }
    }

    // Customizer Box for Custom/Personalised Books
    const isCustom = p.productType === 'activity' || p.productType === 'reusable' || 
                     (p.title && (p.title.includes('Custom') || p.title.includes('Personalised')));
    const pcBox = document.getElementById('productCustomizerBox');
    if (pcBox) {
        pcBox.style.display = isCustom ? 'block' : 'none';
        if (isCustom) {
            const themeSelect = document.getElementById('pcTheme');
            if (themeSelect) {
                for (let opt of themeSelect.options) {
                    if (opt.value && p.title.toLowerCase().includes(opt.value.toLowerCase())) {
                        themeSelect.value = opt.value;
                        break;
                    }
                }
            }
        }
    }

    // Description & Tags
    const descEl = document.getElementById('productDesc');
    if (descEl) descEl.textContent = p.fullDesc || p.shortDesc || '';

    const tagsEl = document.getElementById('productTags');
    if (tagsEl && p.tags) {
        tagsEl.innerHTML = p.tags.map(t => `<span class="product-tag">${t}</span>`).join('');
    }

    // Build Flipkart-style Gallery
    buildGallery(p.images || [p.image]);

    // Sticky mobile bar
    const msbTitle = document.getElementById('msbTitle');
    const msbPrice = document.getElementById('msbPrice');
    const msbMrp = document.getElementById('msbMrp');
    if (msbTitle) msbTitle.textContent = p.title;
    if (msbPrice) msbPrice.textContent = '₹' + p.price;
    if (msbMrp) msbMrp.textContent = '₹' + mrp;

    // Bind CTAs
    bindActionButtons();

    // Render Related Products
    renderRelatedProducts();

    // Pre-fill Custom Order section
    prefillCustomSection(p);
}

// ═══════════════════════════════════════════════════════
// GALLERY SYSTEM (Flipkart Style: Desktop Thumbs + Mobile Slider)
// ═══════════════════════════════════════════════════════
function buildGallery(images) {
    if (!images || !images.length) images = ['images/logo/logo.png'];
    // Ensure primary cover image is always at index 0
    if (p && p.image && images.includes(p.image)) {
        const coverIdx = images.indexOf(p.image);
        if (coverIdx > 0) {
            images = [p.image, ...images.filter((_, idx) => idx !== coverIdx)];
        }
    }
    p.images = images;
    currentImgIdx = 0;

    const tc = document.getElementById('thumbsContainer');
    const dc = document.getElementById('galleryDots');
    if (tc) tc.innerHTML = '';
    if (dc) dc.innerHTML = '';

    const total = images.length;
    // Flipkart style: show at most 6 thumbnails in the thumbnail bar
    const displayThumbs = total > 6 ? images.slice(0, 6) : images;

    // Populate Thumbs (max 6 items to prevent overflow & layout oscillation)
    displayThumbs.forEach((src, i) => {
        if (!tc) return;

        const thumb = document.createElement('div');
        thumb.className = 'gallery-thumb' + (i === 0 ? ' active' : '');
        
        if (total > 6 && i === 5) {
            thumb.classList.add('has-more');
            thumb.innerHTML = `
                <img src="${src}" alt="View ${i + 1}" loading="lazy">
                <span class="gallery-thumb-more-overlay">+${total - 5} More</span>
            `;
            thumb.onclick = () => {
                setMainImg(5);
                const lbImg = document.getElementById('lightboxImg');
                if (lbImg) lbImg.src = p.images[5];
                const lb = document.getElementById('lightbox');
                if (lb) lb.classList.add('open');
                document.body.style.overflow = 'hidden';
            };
        } else {
            thumb.innerHTML = `<img src="${src}" alt="View ${i + 1}" loading="lazy">`;
            thumb.onclick = () => setMainImg(i);
        }

        tc.appendChild(thumb);
    });

    // Mobile dot indicators for all images
    if (dc) {
        images.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.className = 'gallery-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('role', 'button');
            dot.setAttribute('tabindex', '0');
            dot.setAttribute('aria-label', `View image ${i + 1}`);
            dot.onclick = () => setMainImg(i);
            dc.appendChild(dot);
        });
    }

    // Touch Swipe Gesture for Mobile Slider
    setupTouchSwipe();

    // Set first image directly without opacity flash
    setMainImg(0, 0, true);

    // Lightbox click on main image
    const mainImgEl = document.getElementById('mainImg');
    if (mainImgEl) {
        mainImgEl.onclick = () => {
            const lbImg = document.getElementById('lightboxImg');
            if (lbImg) lbImg.src = p.images[currentImgIdx];
            const lb = document.getElementById('lightbox');
            if (lb) lb.classList.add('open');
            document.body.style.overflow = 'hidden';
        };
    }
}

function setMainImg(idx, direction = 0, isInitial = false) {
    if (!p || !p.images || !p.images.length) return;
    currentImgIdx = (idx + p.images.length) % p.images.length;
    
    const mainImgEl = document.getElementById('mainImg');
    if (mainImgEl) {
        if (isInitial) {
            // Clean direct load — no opacity dim or flash
            mainImgEl.style.opacity = '1';
            mainImgEl.style.transform = 'none';
            mainImgEl.src = p.images[currentImgIdx];
        } else if (direction !== 0) {
            // Smooth mobile slide animation
            mainImgEl.style.transition = 'transform 0.16s ease-out, opacity 0.16s ease-out';
            mainImgEl.style.transform = direction > 0 ? 'translateX(-15px)' : 'translateX(15px)';
            mainImgEl.style.opacity = '0.4';
            setTimeout(() => {
                mainImgEl.src = p.images[currentImgIdx];
                mainImgEl.style.transform = direction > 0 ? 'translateX(15px)' : 'translateX(-15px)';
                setTimeout(() => {
                    mainImgEl.style.transform = 'translateX(0)';
                    mainImgEl.style.opacity = '1';
                }, 20);
            }, 160);
        } else {
            mainImgEl.style.opacity = '1';
            mainImgEl.src = p.images[currentImgIdx];
        }
    }

    // Counter badge: 1 / N
    const countBadge = document.getElementById('galleryCountBadge');
    if (countBadge) {
        countBadge.textContent = `${currentImgIdx + 1} / ${p.images.length}`;
    }

    // Sync Thumbnails (no window-level scrollIntoView to eliminate layout jitter)
    const thumbs = document.querySelectorAll('.gallery-thumb');
    const total = p.images.length;
    thumbs.forEach((t, i) => {
        if (total > 6 && currentImgIdx >= 5 && i === 5) {
            t.classList.add('active');
        } else {
            t.classList.toggle('active', i === currentImgIdx);
        }
    });

    // Sync Dots
    document.querySelectorAll('.gallery-dot').forEach((d, i) => {
        d.classList.toggle('active', i === currentImgIdx);
    });
}

function nextImg(dir = 1) { 
    if (p && p.images) setMainImg(currentImgIdx + 1, dir); 
}
function prevImg(dir = -1) { 
    if (p && p.images) setMainImg(currentImgIdx - 1, dir); 
}

function setupTouchSwipe() {
    let touchStartX = 0;
    let touchStartY = 0;
    const galleryEl = document.getElementById('galleryMain');
    if (!galleryEl) return;

    galleryEl.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    galleryEl.addEventListener('touchend', (e) => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        // Check for horizontal swipe gesture
        if (Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(dy)) {
            if (dx < 0) nextImg(1);   // swipe left = next
            else prevImg(-1);        // swipe right = prev
        }
    }, { passive: true });
}

function closeLightbox() {
    const lb = document.getElementById('lightbox');
    if (lb) lb.classList.remove('open');
    document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
});

// ═══════════════════════════════════════════════════════
// DIVINE PRODUCT PAGE (Specialized Series Display)
// ═══════════════════════════════════════════════════════
function initDivineProduct(prod) {
    const godColor = DIVINE_GOD_COLORS[prod.godCharacter] || '#4A0E8F';
    const waLink = buildDivineWALink(prod);

    document.title = prod.title + ' — HoneyBee Learning | Divine Story Books';
    
    // Badge
    const badge = document.getElementById('productBadge');
    if (badge) {
        badge.textContent = (prod.godEmoji || '🕉️') + ' ' + (prod.badge || 'DIVINE STORY');
        badge.style.background = godColor;
        badge.style.color = '#fff';
    }

    // Title & Price
    const titleEl = document.getElementById('productTitle');
    if (titleEl) titleEl.textContent = prod.title;
    const priceEl = document.getElementById('priceSell');
    if (priceEl) priceEl.textContent = '₹' + prod.price;

    let dMrp = prod.mrp || Math.round(prod.price * 1.4);
    const mrpEl = document.getElementById('priceMrp');
    if (mrpEl) mrpEl.textContent = '₹' + dMrp;
    const offEl = document.getElementById('priceDiscount');
    if (offEl) {
        const discount = Math.round(((dMrp - prod.price) / dMrp) * 100);
        offEl.textContent = discount + '% OFF';
    }

    // Name field for divine books (child name on cover)
    const pcBox = document.getElementById('productCustomizerBox');
    if (pcBox) {
        pcBox.style.display = 'block';
        const themeRow = pcBox.querySelector('.pc-row');
        if (themeRow) themeRow.style.display = 'none'; // hide theme dropdown for divine books
    }

    // Description & Lessons
    const descEl = document.getElementById('productDesc');
    if (descEl) descEl.textContent = prod.fullDesc || prod.shortDesc || '';

    const tagsEl = document.getElementById('productTags');
    if (tagsEl) {
        const tagHTML = (prod.tags || []).map(t => `<span class="product-tag">${t}</span>`).join('');
        const lessonTag = prod.lesson ? `<span class="product-tag" style="background:#F4EEFF;color:${godColor};font-weight:800;">${prod.lessonEmoji || '✨'} Teaches: ${prod.lesson}</span>` : '';
        tagsEl.innerHTML = tagHTML + lessonTag;
    }

    // Hide standard freebies for divine
    const freebiesContainer = document.getElementById('productFreebies');
    if (freebiesContainer) freebiesContainer.style.display = 'none';

    // Build Gallery
    buildGallery(prod.images || [prod.image]);

    // Sticky mobile bar
    const msbTitle = document.getElementById('msbTitle');
    const msbPrice = document.getElementById('msbPrice');
    if (msbTitle) msbTitle.textContent = prod.title;
    if (msbPrice) msbPrice.textContent = '₹' + prod.price;

    bindActionButtons();
    renderRelatedProducts();
}

// ═══════════════════════════════════════════════════════
// ORDER & SHARE HANDLERS (100% Reliable & Validated)
// ═══════════════════════════════════════════════════════
function handleMainOrderClick() {
    if (!p) return;

    // 1. Divine Story Books
    if (p.productType === 'divine' || (p.id && String(p.id).startsWith('ds-'))) {
        const nameEl = document.getElementById('pcChildName');
        const childName = (nameEl ? nameEl.value.trim() : '') || 'My Child';
        const msg = `Hi HoneyBee Learning! 🕉️\nI would like to order the Divine Story Book:\n• Story: ${p.title} (₹${p.price})\n• Child's Name: ${childName}\n\nPlease share sample pages & payment details!`;
        window.open(`https://wa.me/918883624873?text=${encodeURIComponent(msg)}`, '_blank');
        return;
    }

    // 2. Customised / Personalised Books
    const isCustom = p.productType === 'activity' || p.productType === 'reusable' || 
                     (p.title && (p.title.includes('Custom') || p.title.includes('Personalised')));

    if (isCustom) {
        const nameEl = document.getElementById('pcChildName');
        const childName = nameEl ? nameEl.value.trim() : '';
        const ageSelect = document.getElementById('pcChildAge');
        const childAge = ageSelect ? ageSelect.value : '3 Years';
        const themeSelect = document.getElementById('pcTheme');
        const theme = themeSelect ? themeSelect.value : 'Preferred Theme';

        if (!childName) {
            if (nameEl) {
                nameEl.focus();
                nameEl.style.borderColor = '#e11d48';
                nameEl.style.boxShadow = '0 0 0 4px rgba(225, 29, 72, 0.2)';
                setTimeout(() => {
                    nameEl.style.borderColor = '';
                    nameEl.style.boxShadow = '';
                }, 2000);
            }
            alert("Please enter your child's name for the cover! ✨");
            return;
        }

        const msg = `Hi HoneyBee Learning! 🐝\nI would like to order a Personalised Book:\n• Book: ${p.title} (₹${p.price})\n• Child's Name: ${childName}\n• Age: ${childAge}\n• Theme: ${theme}\n📸 I will send my child's photo here on WhatsApp!\n\n(Noted: 1st design review included, ₹50 per customization after 1st review).`;
        window.open(`https://wa.me/918883624873?text=${encodeURIComponent(msg)}`, '_blank');
        return;
    }

    // 3. Standard Books & Learning Charts
    const msg = `Hi HoneyBee Learning! 🐝\nI want to order:\n• Product: ${p.title} (₹${p.price})\n\nPlease share availability & payment details!`;
    window.open(`https://wa.me/918883624873?text=${encodeURIComponent(msg)}`, '_blank');
}

function shareProduct() {
    const url = window.location.href;
    const title = (p ? p.title : 'Personalised Activity Book') + ' — HoneyBee Learning';
    const text = 'Check out this awesome personalised kids book from HoneyBee Learning!';

    if (navigator.share) {
        navigator.share({ title, text, url }).catch(() => {});
    } else {
        // Fallback: clipboard copy
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url).then(showShareFeedback).catch(() => fallbackCopy(url));
        } else {
            fallbackCopy(url);
        }
    }
}

function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch(e) {}
    document.body.removeChild(ta);
    showShareFeedback();
}

function showShareFeedback() {
    const btn = document.getElementById('shareBtn');
    if (!btn) return;
    const origHTML = btn.innerHTML;
    btn.innerHTML = '✅ Link Copied!';
    btn.style.background = '#e6f4ea';
    btn.style.borderColor = '#34a853';
    setTimeout(() => {
        btn.innerHTML = origHTML;
        btn.style.background = '';
        btn.style.borderColor = '';
    }, 2200);
}

function bindActionButtons() {
    const orderBtn = document.getElementById('orderBtn');
    if (orderBtn) {
        orderBtn.onclick = (e) => {
            e.preventDefault();
            handleMainOrderClick();
        };
    }
    const msbBtn = document.getElementById('msbBtn');
    if (msbBtn) {
        msbBtn.onclick = (e) => {
            e.preventDefault();
            handleMainOrderClick();
        };
    }
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
        shareBtn.onclick = (e) => {
            e.preventDefault();
            shareProduct();
        };
    }
}

// ═══════════════════════════════════════════════════════
// RELATED PRODUCTS ("You May Also Like")
// ═══════════════════════════════════════════════════════
function renderRelatedProducts() {
    const grid = document.getElementById('relatedGrid');
    if (!grid || !products || !products.length || !p) return;

    // Filter out current product
    let candidates = products.filter(item => String(item.id) !== String(p.id));
    if (!candidates.length) return;

    // Sort by same product type first
    let sameType = candidates.filter(item => item.productType === p.productType);
    let otherTypes = candidates.filter(item => item.productType !== p.productType);

    sameType.sort(() => 0.5 - Math.random());
    otherTypes.sort(() => 0.5 - Math.random());

    const toShow = [...sameType, ...otherTypes].slice(0, 4);

    grid.innerHTML = toShow.map(item => {
        const badgeClass = item.badgeType === 'new' ? 'badge-new' : 'badge-hot';
        const img = item.image || (item.images && item.images[0]) || 'images/logo/logo.png';
        const tags = (item.tags || []).slice(0, 2).map(t => `<span class="lcard-tag">${t}</span>`).join('');

        return `
        <div class="learning-card">
          <div class="lcard-img-wrap">
            <img src="${img}" alt="${item.title}" loading="lazy" onerror="this.parentElement.innerHTML='<span style=\'font-size:3rem;display:flex;align-items:center;justify-content:center;height:100%;\'>${item.fallbackEmoji || '📚'}</span>'">
            <div class="lcard-badges">
              <span class="${badgeClass}">${item.badge || 'POPULAR'}</span>
              <div class="lcard-price">₹${item.price}</div>
            </div>
          </div>
          <div class="lcard-body" style="display:flex;flex-direction:column;flex:1;">
            <div class="lcard-title">${item.title}</div>
            <div class="lcard-tags" style="margin:6px 0 10px;">${tags}</div>
            <div class="lcard-footer" style="margin-top:auto;padding-top:10px;">
              <a href="product.html?id=${item.id}" class="lcard-btn" style="width:100%;text-align:center;text-decoration:none;">View Details 💡</a>
            </div>
          </div>
        </div>`;
    }).join('');
}

// ═══════════════════════════════════════════════════════
// CUSTOMISE / BULK ENQUIRY FORM LOGIC
// ═══════════════════════════════════════════════════════
function prefillCustomSection(prod) {
    const themeInput = document.getElementById('customThemeInput');
    if (themeInput) {
        let matched = false;
        document.querySelectorAll('.theme-chip:not(.custom-chip)').forEach(chip => {
            const text = chip.textContent.replace(/[^\w\s]/gi, '').trim().toLowerCase();
            if (prod.title.toLowerCase().includes(text) || (prod.tags && prod.tags.join(' ').toLowerCase().includes(text))) {
                chip.classList.add('selected');
                matched = true;
            } else {
                chip.classList.remove('selected');
            }
        });
        if (!matched) {
            const customChip = document.querySelector('.custom-chip');
            if (customChip) customChip.classList.add('selected');
            themeInput.style.display = 'block';
            themeInput.value = prod.title;
        } else {
            themeInput.style.display = 'none';
            themeInput.value = '';
        }
    }

    document.querySelectorAll('.pt-card').forEach(card => {
        if (card.dataset.type === prod.productType) {
            card.classList.add('selected');
            const ptName = card.querySelector('.pt-name');
            selectedProductType = ptName ? ptName.textContent : '';
        } else {
            card.classList.remove('selected');
        }
    });

    const budgetSelect = document.getElementById('custBudget');
    if (budgetSelect && prod.price) {
        if (prod.price < 200) budgetSelect.value = 'Under ₹200';
        else if (prod.price <= 500) budgetSelect.value = '₹200–₹500';
        else if (prod.price <= 1000) budgetSelect.value = '₹500–₹1000';
        else budgetSelect.value = '₹1000+';
    }

    const notesInput = document.getElementById('custNotes');
    if (notesInput) {
        notesInput.value = `Enquiring about: ${prod.title} (₹${prod.price}). Please share more details!`;
    }
}

function selectTheme(btn, value) {
    document.querySelectorAll('.theme-chip').forEach(c => c.classList.remove('selected'));
    btn.classList.add('selected');

    const input = document.getElementById('customThemeInput');
    if (value) {
        input.value = value;
        input.style.display = 'none';
    } else {
        input.value = '';
        input.style.display = 'block';
        input.focus();
    }
}

function selectProductType(card, typeLabel) {
    document.querySelectorAll('.pt-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    selectedProductType = typeLabel;
}

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

    const specials = [...document.querySelectorAll('.special-chips input:checked')].map(cb => cb.value);

    if (!theme) {
        showCustError('⚠️ Please pick a theme or type your custom theme.');
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

    const errEl = document.getElementById('custError');
    if (errEl) errEl.style.display = 'none';

    // Build rich WhatsApp enquiry message
    const msg = `Hi HoneyBee Learning! 🐝\nI would like to place a Custom / Bulk Enquiry:\n` +
        `• Theme: ${theme}\n` +
        `• Product Type: ${selectedProductType || 'Custom Order'}\n` +
        `• Child's Name: ${childName}\n` +
        `• Age Group: ${age}\n` +
        `• Quantity: ${qty}\n` +
        `• Budget: ${budget}\n` +
        (specials.length ? `• Special Requests: ${specials.join(', ')}\n` : '') +
        (notes ? `• Notes: ${notes}\n` : '') +
        `• Best Time to Contact: ${time}\n\n` +
        `(Customization Policy: 1st review included, ₹50 per customization after 1st review).`;

    // Open WhatsApp
    window.open(`https://wa.me/918883624873?text=${encodeURIComponent(msg)}`, '_blank');

    // Async post to FormSubmit
    const payload = {
        _subject: "Custom Product Enquiry - HoneyBee Learning",
        Theme: theme,
        ProductType: selectedProductType || 'Not specified',
        ChildName: childName,
        AgeGroup: age,
        Quantity: qty,
        Budget: budget,
        SpecialRequests: specials.join(', ') || 'None',
        Notes: notes,
        Phone: phone,
        BestTime: time
    };
    
    fetch('https://formsubmit.co/ajax/honeybeelearning.co@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
    }).catch(() => {});
}

function showCustError(msg) {
    const errEl = document.getElementById('custError');
    if (errEl) {
        errEl.textContent = msg;
        errEl.style.display = 'block';
        errEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

const ageCurriculums = {
    '1–2 years': {
        focus: 'Sensory Exploration',
        activities: ['Object recognition', 'Colour matching', 'Simple tracing', 'Shadow matching'],
        skills: 'Fine motor skills, early observation.'
    },
    '3–5 years': {
        focus: 'Foundation Learning',
        activities: ['Alphabet tracing', 'Number counting', 'Shape sorting', 'Simple mazes', 'Matching pairs'],
        skills: 'Hand-eye coordination, early literacy.'
    },
    '6 years': {
        focus: 'Comprehension & Logic',
        activities: ['Reading sentences', 'Missing letters', 'Word search', 'Number sequences', 'Addition & subtraction'],
        skills: 'Problem solving, reading comprehension.'
    },
    '7 years': {
        focus: 'Language & Thinking',
        activities: ['Sentence formation', 'Synonyms & opposites', 'Crosswords', 'Multiplication basics'],
        skills: 'Language development, reasoning.'
    },
    '8 years': {
        focus: 'Critical Thinking',
        activities: ['Simple comprehensions', 'Multiplication tables', 'Logic puzzles', 'Brain teasers'],
        skills: 'Advanced language, deep reasoning.'
    },
    '9 years': {
        focus: 'Problem Solving',
        activities: ['Paragraph comprehension', 'Math word problems', 'Long multiplication', 'Division puzzles'],
        skills: 'Analytical reasoning, complex comprehension.'
    },
    '10–12 years': {
        focus: 'Advanced Logic',
        activities: ['Complex word puzzles', 'Advanced math challenges', 'Logic grids', 'Scientific reasoning'],
        skills: 'Critical analysis, high-level reasoning.'
    }
};

function updateCustomAgeImage() {
    const ageVal = document.getElementById('custAge').value;
    const previewDiv = document.getElementById('custAgePreview');
    if (!previewDiv) return;

    previewDiv.innerHTML = '';
    previewDiv.style.display = 'none';

    let matchedData = null;
    for (const key of Object.keys(ageCurriculums)) {
        if (ageVal.includes(key)) {
            matchedData = ageCurriculums[key];
            break;
        }
    }

    if (matchedData) {
        previewDiv.innerHTML = `
            <div class="age-curr-card" style="background:#f8fafc;border:1.5px solid var(--green-pale);border-radius:12px;padding:12px 16px;text-align:left;margin-top:8px;">
                <div class="curr-header" style="font-weight:800;color:var(--green);margin-bottom:6px;">🎯 Focus: <span>${matchedData.focus}</span></div>
                <div class="curr-body" style="font-size:0.85rem;margin-bottom:6px;">
                    <strong>🧩 Inside the Book:</strong>
                    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:4px;">
                        ${matchedData.activities.map(a => `<span style="background:#fff;border:1px solid #e2e8f0;padding:2px 8px;border-radius:12px;font-size:0.75rem;">${a}</span>`).join('')}
                    </div>
                </div>
                <div class="curr-footer" style="font-size:0.8rem;color:#64748b;">🌟 <strong>Skills:</strong> ${matchedData.skills}</div>
            </div>
        `;
        previewDiv.style.display = 'block';
    }
}
