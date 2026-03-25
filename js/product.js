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
    
  // ─── Dynamic SEO update ───────────────────────────────────────────
  if (p.title) {
    document.title = p.title + ' — HoneyBee Learning | India\'s First Personalised Kids Book Brand';
    const md = document.getElementById('metaDesc');
    if (md) md.setAttribute('content', p.shortDesc + ' — Personalised by HoneyBee Learning, Chennai.');
    const ot = document.getElementById('ogTitle');
    if (ot) ot.setAttribute('content', p.title + ' — HoneyBee Learning');
    const od = document.getElementById('ogDesc');
    if (od) od.setAttribute('content', p.shortDesc || 'Personalised kids activity book by HoneyBee Learning, Chennai.');
    const oi = document.getElementById('ogImage');
    if (oi && p.image) oi.setAttribute('content', 'https://honeybeelearning.co/' + p.image);
  }

  document.getElementById('productTitle').textContent = p.title;
    document.getElementById('priceSell').textContent = '₹' + p.price;
    document.getElementById('productDesc').textContent = p.fullDesc;
    document.getElementById('productTags').innerHTML = p.tags.map(t => `<span class="product-tag">${t}</span>`).join('');

    document.getElementById('orderBtn').href = '#customiseSection';
    document.getElementById('orderBtn').onclick = (e) => {
        e.preventDefault();
        document.getElementById('customiseSection').scrollIntoView({ behavior: 'smooth' });
    };

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
    if (msbBtn) {
        msbBtn.href = '#customiseSection';
        msbBtn.onclick = (e) => {
            e.preventDefault();
            document.getElementById('customiseSection').scrollIntoView({ behavior: 'smooth' });
        };
    }

    renderRelatedProducts();

    // ─── AUTOFILL ENQUIRY FORM ───
    const themeInput = document.getElementById('customThemeInput');
    if (themeInput) {
        let matchedChip = false;
        document.querySelectorAll('.theme-chip:not(.custom-chip)').forEach(chip => {
            const text = chip.textContent.replace(/[^\w\s]/gi, '').trim().toLowerCase();
            if (p.title.toLowerCase().includes(text) || (p.tags && p.tags.join(' ').toLowerCase().includes(text))) {
                chip.classList.add('selected');
                matchedChip = true;
            } else {
                chip.classList.remove('selected');
            }
        });
        if (!matchedChip) {
            const customChip = document.querySelector('.custom-chip');
            if (customChip) {
                customChip.classList.add('selected');
            }
            themeInput.style.display = 'block';
            themeInput.value = p.title;
        } else {
            themeInput.style.display = 'none';
            themeInput.value = '';
        }
    }

    document.querySelectorAll('.pt-card').forEach(card => {
        if (card.dataset.type === p.productType) {
            card.classList.add('selected');
            const ptName = card.querySelector('.pt-name');
            const ptDesc = card.querySelector('.pt-desc');
            selectedProductType = (ptName ? ptName.textContent : '') + ' - ' + (ptDesc ? ptDesc.textContent : '');
        } else {
            card.classList.remove('selected');
        }
    });

    const budgetSelect = document.getElementById('custBudget');
    if (budgetSelect && p.price) {
        if (p.price < 200) budgetSelect.value = 'Under ₹200';
        else if (p.price <= 500) budgetSelect.value = '₹200–₹500';
        else if (p.price <= 1000) budgetSelect.value = '₹500–₹1000';
        else budgetSelect.value = '₹1000+';
    }

    const notesInput = document.getElementById('custNotes');
    if (notesInput) {
        notesInput.value = `Enquiring about: ${p.title} (₹${p.price}). Please share more details!`;
    }

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

    const payload = {
        _subject: "Custom Product Enquiry - HoneyBee Learning",
        Theme: theme,
        ProductType: selectedProductType || 'Not specified',
        ChildName: childName,
        AgeGroup: age,
        Quantity: qty,
        Budget: budget,
        SpecialRequests: specials.length ? specials.join(', ') : 'None',
        Notes: notes,
        Phone: phone,
        BestTime: time
    };
    
    const btn = document.querySelector('.cust-submit-btn');
    const origText = btn.innerHTML;
    btn.innerHTML = 'Sending... ⏳';
    
    fetch('https://formsubmit.co/ajax/honeybeelearning.co@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
    }).then(r => r.json()).then(res => {
        alert("Enquiry Sent! We will reach out to you and customize based on your preference.");
        document.getElementById('custChildName').value = '';
        document.getElementById('custNotes').value = '';
    }).catch(e => {
        showCustError('⚠️ Network error. Please try again.');
    }).finally(() => {
        btn.innerHTML = origText;
    });
}

function showCustError(msg) {
    const errEl = document.getElementById('custError');
    errEl.textContent = msg;
    errEl.style.display = 'block';
    errEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
        activities: ['Reading sentences', 'Missing letters', 'Word search', 'Number sequences', 'Addition & subtraction', 'Time basics', 'Spot differences'],
        skills: 'Problem solving, reading comprehension.'
    },
    '7 years': {
        focus: 'Language & Thinking',
        activities: ['Sentence formation', 'Synonyms & opposites', 'Crosswords', 'Multiplication basics', 'Skip counting', 'Logical puzzles', 'Riddles'],
        skills: 'Language development, reasoning.'
    },
    '8 years': {
        focus: 'Critical Thinking',
        activities: ['Simple comprehensions', 'Multiplication tables', 'Logic puzzles', 'Brain teasers', 'Fractions basics', 'Coding patterns', 'Sudoku (medium)'],
        skills: 'Advanced language, deep reasoning.'
    },
    '9 years': {
        focus: 'Problem Solving & Advanced Thinking',
        activities: ['Paragraph comprehension', 'Math word problems', 'Long multiplication', 'Division puzzles', 'Logic grids & riddles', 'Coding puzzles'],
        skills: 'Analytical reasoning, complex comprehension.'
    },
    '10-12 years': {
        focus: 'Advanced Logic',
        activities: ['Complex word puzzles', 'Advanced math challenges', 'Logic grids', 'Scientific reasoning', 'Strategic brain teasers'],
        skills: 'Critical analysis, high-level reasoning.'
    }
};

function updateCustomAgeImage() {
    const ageVal = document.getElementById('custAge').value;
    const previewDiv = document.getElementById('custAgePreview');
    
    // Clear out previous HTML and hide by default
    previewDiv.innerHTML = '';
    previewDiv.style.display = 'none';
    
    // Find matching curriculum
    let matchedData = null;
    for (const key of Object.keys(ageCurriculums)) {
        if (ageVal.includes(key)) {
            matchedData = ageCurriculums[key];
            break;
        }
    }

    if (matchedData) {
        // Build the fast HTML card
        previewDiv.innerHTML = `
            <div class="age-curr-card">
                <div class="curr-header">🎯 Focus: <span>${matchedData.focus}</span></div>
                <div class="curr-body">
                    <strong>🧩 Inside the Book:</strong>
                    <div class="curr-tags">
                        ${matchedData.activities.map(a => `<span class="curr-tag">${a}</span>`).join('')}
                    </div>
                </div>
                <div class="curr-footer">🌟 <strong>Skills developed:</strong> ${matchedData.skills}</div>
            </div>
        `;
        previewDiv.style.display = 'block';
    }
}

