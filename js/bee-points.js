/* ═══════════════════════════════════════════════════════════
   HoneyBee Learning — Bee Points System
   Supabase-powered loyalty programme
   ═══════════════════════════════════════════════════════════

   🔧 SUPABASE SETUP INSTRUCTIONS:
   ─────────────────────────────────────────────────────────
   1. Go to https://supabase.com → Create free project
   2. Project Settings → API:
      - Copy "Project URL"  → paste in SUPABASE_URL below
      - Copy "anon public"  → paste in SUPABASE_ANON_KEY below

   3. Go to Authentication → Settings:
      - Turn OFF "Enable email confirmations"
      - Turn OFF "Enable phone confirmations"

   4. Go to Authentication → Users → Invite user:
      Email: natcha@honeybeelearning.co  (any email you like)
      Password: Natcha@2023

   5. SQL Editor → Run this once:

      CREATE TABLE bee_points_customers (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name TEXT NOT NULL,
        mobile TEXT UNIQUE NOT NULL,
        points INTEGER DEFAULT 0,
        total_orders INTEGER DEFAULT 0,
        total_spent NUMERIC(10,2) DEFAULT 0,
        notes TEXT,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now()
      );

      -- Row Level Security
      ALTER TABLE bee_points_customers ENABLE ROW LEVEL SECURITY;

      -- Public can read all (for customer lookup & leaderboard)
      CREATE POLICY "Public read" ON bee_points_customers
        FOR SELECT USING (true);

      -- Only authenticated Supabase users can write
      CREATE POLICY "Auth users can write" ON bee_points_customers
        FOR ALL USING (auth.role() = 'authenticated');

   ═══════════════════════════════════════════════════════════ */

// ─── SUPABASE CONFIG ── Replace with your real values ──────
const SUPABASE_URL = 'https://hoxeqhzremcmgwcdatdf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhveGVxaHpyZW1jbWd3Y2RhdGRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5Njc2OTAsImV4cCI6MjA5MDU0MzY5MH0.8gEX7jmH8JuJJ5KyzJ6dzcDp2gFj0EsmJh4HP-Je6pE';

// ──────────────────────────────────────────────────────────
// Admin email (must match the Supabase Auth user you created)
const ADMIN_EMAIL = 'bpsurya96@gmail.com';

// Detect demo mode
const IS_DEMO_MODE = SUPABASE_URL === 'YOUR_SUPABASE_URL_HERE';

// Initialize Supabase client
let supabase = null;
if (!IS_DEMO_MODE) {
  try {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (e) {
    console.warn('Supabase init failed, running in demo mode:', e);
  }
}

// ─── DEMO DATA ─────────────────────────────────────────────
const DEMO_CUSTOMERS = [
  { id: '1', name: 'Deepa Rajan', mobile: '7654321098', points: 580, total_orders: 8, total_spent: 3200, notes: 'Birthday bulk order', created_at: '2024-11-20T10:00:00Z' },
  { id: '2', name: 'Priya Kumar', mobile: '9876543210', points: 340, total_orders: 5, total_spent: 1850, notes: 'Loyal customer', created_at: '2025-01-15T10:00:00Z' },
  { id: '3', name: 'Meena Krishnan', mobile: '8432109876', points: 220, total_orders: 4, total_spent: 1100, notes: 'Regular customer', created_at: '2025-06-18T10:00:00Z' },
  { id: '4', name: 'Anita Sharma', mobile: '8765432109', points: 120, total_orders: 2, total_spent: 650, notes: '', created_at: '2025-03-10T10:00:00Z' },
  { id: '5', name: 'Sunita Patel', mobile: '9543210987', points: 70, total_orders: 1, total_spent: 450, notes: '', created_at: '2026-01-05T10:00:00Z' },
];
let demoData = [...DEMO_CUSTOMERS];

// ─── STATE ─────────────────────────────────────────────────
let currentEditId = null;
let deleteTargetId = null;
let realtimeChannel = null;
let allCustomers = [];

// ═══════════════════════════════════
//  REDEMPTION CATALOGUE
// ═══════════════════════════════════
const REDEMPTION_REWARDS = [
  { points: 60, reward: 'Free Stationery Set', icon: '✏️' },
  { points: 100, reward: '₹45 OFF (Min ₹199 order)', icon: '💸' },
  { points: 150, reward: 'Free Activity Sheets', icon: '📄' },
  { points: 200, reward: '₹50 OFF (Min ₹399 order)', icon: '💰' },
  { points: 300, reward: 'Free Reusable Practice Worksheet', icon: '📋' },
  { points: 400, reward: '₹75 OFF (Min ₹599 order)', icon: '🏷️' },
  { points: 500, reward: 'FREE Mini Activity Book (Special Reward)', icon: '📚' },
  { points: 1000, reward: 'Free Activity Book (Special Reward)', icon: '🎁' },
];

// ═══════════════════════════════════
//  PUBLIC PAGE — RENDER REDEEM GRID
// ═══════════════════════════════════
function renderRedeemGrid() {
  const grid = document.getElementById('redeemGrid');
  if (!grid) return;
  grid.innerHTML = REDEMPTION_REWARDS.map(item => `
    <div class="bp-redeem-card" role="listitem">
      <span class="bp-redeem-icon" aria-hidden="true">${item.icon}</span>
      <div class="bp-redeem-points">${item.points}</div>
      <div class="bp-redeem-pts-label">Bee Points</div>
      <hr class="bp-redeem-divider">
      <div class="bp-redeem-reward">${item.reward}</div>
      <a href="index.html#streams" class="bp-redeem-order-btn">Shop to Earn 🛍️</a>
    </div>
  `).join('');
}

// ═══════════════════════════════════
//  LEADERBOARD — TOP 5 CUSTOMERS
// ═══════════════════════════════════
async function loadLeaderboard() {
  const board = document.getElementById('leaderboardList');
  if (!board) return;

  try {
    let top5 = [];

    if (IS_DEMO_MODE || !supabase) {
      await delay(400);
      top5 = [...demoData].sort((a, b) => b.points - a.points).slice(0, 5);
    } else {
      const { data, error } = await supabase
        .from('bee_points_customers')
        .select('name, points, total_orders')
        .order('points', { ascending: false })
        .limit(5);
      if (error) throw error;
      top5 = data || [];
    }

    const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
    const colors = ['#FFD700', '#C0C0C0', '#CD7F32', 'rgba(255,255,255,0.6)', 'rgba(255,255,255,0.5)'];

    board.innerHTML = top5.map((c, i) => `
      <div class="bp-leader-row" style="animation-delay:${i * 0.1}s">
        <span class="bp-leader-medal">${medals[i]}</span>
        <div class="bp-leader-info">
          <div class="bp-leader-name">${maskName(c.name)}</div>
          <div class="bp-leader-orders">${c.total_orders || 0} orders</div>
        </div>
        <div class="bp-leader-pts" style="color:${colors[i]}">${Number(c.points).toLocaleString('en-IN')} <span style="font-size:0.75rem;opacity:0.7;">pts</span></div>
      </div>
    `).join('');

  } catch (err) {
    console.error('Leaderboard error:', err);
    board.innerHTML = '<p style="text-align:center;color:rgba(255,255,255,0.4);font-size:0.88rem;padding:20px;">Unable to load leaderboard.</p>';
  }
}

// Mask name for privacy: "Priya Kumar" → "Priya K."
function maskName(name) {
  if (!name) return '—';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0];
  return parts[0] + ' ' + parts[1].charAt(0) + '.';
}

// ═══════════════════════════════════
//  CUSTOMER LOOKUP
// ═══════════════════════════════════
async function lookupPoints(e) {
  e.preventDefault();
  const mobile = document.getElementById('mobileInput').value.trim();
  const errorEl = document.getElementById('lookupError');
  const resultEl = document.getElementById('pointsResult');
  const btn = document.getElementById('lookupBtn');
  const btnText = document.getElementById('lookupBtnText');

  errorEl.style.display = 'none';
  resultEl.style.display = 'none';

  if (!/^[0-9]{10}$/.test(mobile)) {
    showLookupError('Please enter a valid 10-digit mobile number.');
    return;
  }

  btnText.innerHTML = '<span class="bp-spinner" style="width:18px;height:18px;border-width:2.5px;vertical-align:middle;margin-right:6px;"></span> Checking...';
  btn.disabled = true;

  try {
    let customer = null;

    if (IS_DEMO_MODE || !supabase) {
      await delay(700);
      customer = demoData.find(c => c.mobile === mobile) || null;
    } else {
      const { data, error } = await supabase
        .from('bee_points_customers')
        .select('*')
        .eq('mobile', mobile)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      customer = data || null;
    }

    if (!customer) {
      showLookupError('📱 No account found for this number. Place an order via WhatsApp to start earning Bee Points!');
    } else {
      displayCustomerResult(customer);
    }
  } catch (err) {
    console.error('Lookup error:', err);
    showLookupError('Something went wrong. Please try again or contact us on WhatsApp.');
  } finally {
    btnText.textContent = 'Check My Points 🐝';
    btn.disabled = false;
  }
}

function showLookupError(msg) {
  const el = document.getElementById('lookupError');
  el.textContent = msg;
  el.style.display = 'block';
}

function displayCustomerResult(customer) {
  document.getElementById('resultName').textContent = customer.name;
  document.getElementById('resultPoints').textContent = '0';
  document.getElementById('resultEquivalent').textContent =
    `Worth approx. ₹${Math.floor(customer.points / 10 * 9)} in rewards`;
  document.getElementById('resultOrders').textContent = customer.total_orders;
  document.getElementById('resultSpent').textContent = '₹' + Number(customer.total_spent).toLocaleString('en-IN');
  document.getElementById('pointsResult').style.display = 'block';
  animateCounter('resultPoints', customer.points);
}

function animateCounter(elementId, targetValue) {
  const el = document.getElementById(elementId);
  if (!el) return;
  let current = 0;
  const steps = 55;
  const increment = targetValue / steps;
  const timer = setInterval(() => {
    current += increment;
    if (current >= targetValue) { current = targetValue; clearInterval(timer); }
    el.textContent = Math.floor(current).toLocaleString('en-IN');
  }, 22);
}

// ═══════════════════════════════════
//  ADMIN — AUTH via Supabase
// ═══════════════════════════════════
function initAdmin() {
  if (!document.getElementById('loginScreen')) return;

  // Check existing session
  if (!IS_DEMO_MODE && supabase) {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) showDashboard();
    });
    // Listen for auth state changes
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        showDashboard();
      } else {
        document.getElementById('adminDashboard').style.display = 'none';
        document.getElementById('loginScreen').style.display = 'flex';
      }
    });
  } else if (sessionStorage.getItem('hbl_admin_auth') === 'true') {
    showDashboard();
  }
}

async function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;
  const errorEl = document.getElementById('loginError');
  const btn = document.getElementById('loginBtn');

  errorEl.style.display = 'none';
  btn.textContent = 'Signing in...';
  btn.disabled = true;

  try {
    if (IS_DEMO_MODE || !supabase) {
      // Demo mode
      if (username === 'natcha' && password === 'Natcha@2023') {
        await delay(400);
        sessionStorage.setItem('hbl_admin_auth', 'true');
        showDashboard();
      } else {
        throw new Error('Invalid credentials');
      }
    } else {
      // Real Supabase Auth
      // Accept either the short username "natcha" or the full email
      const email = username.includes('@') ? username : ADMIN_EMAIL;
      console.log('[BeePoints Admin] Attempting login with email:', email);

      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      console.log('[BeePoints Admin] Auth response:', { data, error });

      if (error) {
        // Map Supabase error codes to helpful messages
        let msg = error.message;
        if (error.message.includes('Email not confirmed')) {
          msg = 'Your admin email is not confirmed. Go to Supabase → Authentication → Users → click the user → Confirm email manually.';
        } else if (error.message.includes('Invalid login credentials')) {
          msg = `Wrong email or password. The admin email set is: ${ADMIN_EMAIL}. Make sure this exactly matches the email in Supabase Authentication → Users.`;
        } else if (error.message.includes('path') || error.message.includes('Path')) {
          msg = `Supabase project error: ${error.message}. Check that your project is not paused at supabase.com.`;
        }
        throw new Error(msg);
      }
      // showDashboard() will be called by onAuthStateChange
    }
  } catch (err) {
    console.error('[BeePoints Admin] Login error:', err);
    // Show full error message
    errorEl.textContent = err.message || 'Login failed. Please try again.';
    errorEl.style.display = 'block';
    const card = document.querySelector('.admin-login-card');
    if (card) { card.style.animation = 'none'; card.offsetHeight; card.style.animation = 'shake 0.4s ease'; }
    btn.textContent = 'Sign In 🔑';
    btn.disabled = false;
  }
}

async function handleLogout() {
  if (!IS_DEMO_MODE && supabase) {
    await supabase.auth.signOut();
  }
  sessionStorage.removeItem('hbl_admin_auth');
  if (realtimeChannel && supabase) supabase.removeChannel(realtimeChannel);
  document.getElementById('adminDashboard').style.display = 'none';
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('loginUsername').value = '';
  document.getElementById('loginPassword').value = '';
  document.getElementById('loginBtn').textContent = 'Sign In 🔑';
  document.getElementById('loginBtn').disabled = false;
}

async function showDashboard() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('adminDashboard').style.display = 'block';

  if (IS_DEMO_MODE || !supabase) {
    document.getElementById('setupBanner').style.display = 'flex';
    document.getElementById('realtimeStatus').textContent = 'Demo Mode';
  }

  await loadCustomers();
  setupRealtime();
}

// ═══════════════════════════════════
//  ADMIN — LOAD & RENDER TABLE
// ═══════════════════════════════════
async function loadCustomers() {
  const loading = document.getElementById('tableLoading');
  const table = document.getElementById('adminTable');
  const empty = document.getElementById('adminEmpty');

  loading.style.display = 'block';
  table.style.display = 'none';
  empty.style.display = 'none';

  try {
    let customers = [];

    if (IS_DEMO_MODE || !supabase) {
      await delay(500);
      customers = [...demoData];
    } else {
      const { data, error } = await supabase
        .from('bee_points_customers')
        .select('*')
        .order('points', { ascending: false });
      if (error) throw error;
      customers = data || [];
    }

    allCustomers = customers;
    renderTable(customers);
    updateStats(customers);

    loading.style.display = 'none';
    if (customers.length === 0) { empty.style.display = 'block'; }
    else { table.style.display = 'table'; }

    if (!IS_DEMO_MODE) document.getElementById('realtimeStatus').textContent = 'Live';

  } catch (err) {
    console.error('Load customers error:', err);
    loading.innerHTML = '<p style="color:#ff6b6b;font-weight:700;padding:20px;text-align:center;">⚠️ Failed to load data. Check your Supabase credentials.</p>';
  }
}

function renderTable(customers) {
  const tbody = document.getElementById('adminTableBody');
  if (!tbody) return;

  if (customers.length === 0) {
    document.getElementById('adminTable').style.display = 'none';
    document.getElementById('adminEmpty').style.display = 'block';
    return;
  }

  document.getElementById('adminTable').style.display = 'table';
  document.getElementById('adminEmpty').style.display = 'none';

  tbody.innerHTML = customers.map((c, i) => `
    <tr id="row-${c.id}">
      <td style="color:rgba(255,255,255,0.3);font-size:0.82rem;">${i + 1}</td>
      <td>
        <div style="font-weight:700;color:white;">${escapeHtml(c.name)}</div>
        ${c.notes ? `<div style="font-size:0.75rem;color:rgba(255,255,255,0.35);margin-top:2px;">${escapeHtml(c.notes)}</div>` : ''}
      </td>
      <td>
        <div class="admin-mobile-badge">
          <span>📱</span>
          <span>${escapeHtml(c.mobile)}</span>
        </div>
      </td>
      <td><span class="admin-points-badge">${Number(c.points).toLocaleString('en-IN')} 🐝</span></td>
      <td style="color:rgba(255,255,255,0.65);">${c.total_orders}</td>
      <td style="color:rgba(255,255,255,0.65);">₹${Number(c.total_spent).toLocaleString('en-IN')}</td>
      <td class="admin-member-since">${formatDate(c.created_at)}</td>
      <td>
        <div class="admin-action-btns">
          <button class="admin-edit-btn" onclick="openEditModal('${c.id}')" aria-label="Edit ${escapeHtml(c.name)}">✏️ Edit</button>
          <button class="admin-delete-btn" onclick="openDeleteModal('${c.id}', '${escapeHtml(c.name)}')" aria-label="Delete ${escapeHtml(c.name)}">🗑️</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function updateStats(customers) {
  const totalPoints = customers.reduce((s, c) => s + Number(c.points), 0);
  const totalOrders = customers.reduce((s, c) => s + Number(c.total_orders), 0);
  const totalRevenue = customers.reduce((s, c) => s + Number(c.total_spent), 0);
  document.getElementById('statTotalCustomers').textContent = customers.length;
  document.getElementById('statTotalPoints').textContent = totalPoints.toLocaleString('en-IN');
  document.getElementById('statTotalOrders').textContent = totalOrders;
  document.getElementById('statTotalRevenue').textContent = '₹' + totalRevenue.toLocaleString('en-IN');
}

function filterTable(query) {
  const q = query.toLowerCase();
  const filtered = allCustomers.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.mobile.includes(q) ||
    (c.notes && c.notes.toLowerCase().includes(q))
  );
  renderTable(filtered);
}

// ═══════════════════════════════════
//  ADMIN — ADD / EDIT MODAL
// ═══════════════════════════════════
function openAddModal() {
  currentEditId = null;
  document.getElementById('modalTitle').textContent = 'Add Customer 🐝';
  document.getElementById('modalSaveBtn').textContent = 'Add Customer ✓';
  ['modalName', 'modalMobile', 'modalNotes'].forEach(id => document.getElementById(id).value = '');
  ['modalPoints', 'modalOrders', 'modalSpent'].forEach(id => document.getElementById(id).value = '0');
  document.getElementById('modalError').style.display = 'none';
  document.getElementById('modalMobile').disabled = false;
  openModal('customerModal');
}

function openEditModal(id) {
  const customer = allCustomers.find(c => c.id === id);
  if (!customer) return;
  currentEditId = id;
  document.getElementById('modalTitle').textContent = 'Edit Customer ✏️';
  document.getElementById('modalSaveBtn').textContent = 'Save Changes ✓';
  document.getElementById('modalName').value = customer.name;
  document.getElementById('modalMobile').value = customer.mobile;
  document.getElementById('modalPoints').value = customer.points;
  document.getElementById('modalOrders').value = customer.total_orders;
  document.getElementById('modalSpent').value = customer.total_spent;
  document.getElementById('modalNotes').value = customer.notes || '';
  document.getElementById('modalError').style.display = 'none';
  openModal('customerModal');
}

async function saveCustomer() {
  const name = document.getElementById('modalName').value.trim();
  const mobile = document.getElementById('modalMobile').value.trim();
  const points = parseInt(document.getElementById('modalPoints').value) || 0;
  const orders = parseInt(document.getElementById('modalOrders').value) || 0;
  const spent = parseFloat(document.getElementById('modalSpent').value) || 0;
  const notes = document.getElementById('modalNotes').value.trim();
  const saveBtn = document.getElementById('modalSaveBtn');

  document.getElementById('modalError').style.display = 'none';
  if (!name) { showModalError('Customer name is required.'); return; }
  if (!/^[0-9]{10}$/.test(mobile)) { showModalError('Enter a valid 10-digit mobile number.'); return; }
  if (points < 0) { showModalError('Points cannot be negative.'); return; }

  const originalText = saveBtn.textContent;
  saveBtn.textContent = 'Saving...';
  saveBtn.disabled = true;

  try {
    if (IS_DEMO_MODE || !supabase) {
      await delay(400);
      if (currentEditId) {
        const idx = demoData.findIndex(c => c.id === currentEditId);
        if (idx !== -1) demoData[idx] = { ...demoData[idx], name, mobile, points, total_orders: orders, total_spent: spent, notes };
      } else {
        if (demoData.find(c => c.mobile === mobile)) { showModalError('A customer with this mobile already exists.'); return; }
        demoData.unshift({ id: String(Date.now()), name, mobile, points, total_orders: orders, total_spent: spent, notes, created_at: new Date().toISOString() });
      }
    } else {
      const payload = { name, mobile, points, total_orders: orders, total_spent: spent, notes, updated_at: new Date().toISOString() };
      if (currentEditId) {
        const { error } = await supabase.from('bee_points_customers').update(payload).eq('id', currentEditId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('bee_points_customers').insert([{ ...payload, created_at: new Date().toISOString() }]);
        if (error) throw error;
      }
    }
    closeModal();
    await loadCustomers();
  } catch (err) {
    console.error('Save error:', err);
    showModalError(err.code === '23505' ? 'Mobile number already exists.' : 'Failed to save. Please try again.');
  } finally {
    saveBtn.textContent = originalText;
    saveBtn.disabled = false;
  }
}

function showModalError(msg) {
  const el = document.getElementById('modalError');
  el.textContent = msg;
  el.style.display = 'block';
}

// ═══════════════════════════════════
//  ADMIN — DELETE
// ═══════════════════════════════════
function openDeleteModal(id, name) {
  deleteTargetId = id;
  document.getElementById('deleteCustomerName').textContent = name;
  openModal('deleteModal');
}

async function confirmDelete() {
  if (!deleteTargetId) return;
  try {
    if (IS_DEMO_MODE || !supabase) {
      await delay(300);
      demoData = demoData.filter(c => c.id !== deleteTargetId);
    } else {
      const { error } = await supabase.from('bee_points_customers').delete().eq('id', deleteTargetId);
      if (error) throw error;
    }
    closeDeleteModal();
    await loadCustomers();
  } catch (err) {
    console.error('Delete error:', err);
    alert('Failed to delete customer. Please try again.');
  }
}

// ═══════════════════════════════════
//  ADMIN — REALTIME
// ═══════════════════════════════════
function setupRealtime() {
  if (IS_DEMO_MODE || !supabase) return;
  realtimeChannel = supabase
    .channel('bee_points_live')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'bee_points_customers' }, () => {
      loadCustomers();
    })
    .subscribe(status => {
      const badge = document.getElementById('realtimeStatus');
      if (badge) badge.textContent = status === 'SUBSCRIBED' ? 'Live' : status === 'CLOSED' ? 'Offline' : 'Connecting...';
    });
}

// ─── HELPERS ───────────────────────────────────────────────
function openModal(id) { document.getElementById(id).classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeModal() { document.getElementById('customerModal').classList.remove('open'); document.body.style.overflow = ''; currentEditId = null; }
function closeDeleteModal() { document.getElementById('deleteModal').classList.remove('open'); document.body.style.overflow = ''; deleteTargetId = null; }
function handleModalOverlayClick(e) { if (e.target === document.getElementById('customerModal')) closeModal(); }
function handleDeleteOverlayClick(e) { if (e.target === document.getElementById('deleteModal')) closeDeleteModal(); }
function formatDate(d) { return d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'; }
function escapeHtml(str) { return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;'); }
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

// Shake animation keyframe
const _shakeStyle = document.createElement('style');
_shakeStyle.textContent = `@keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-10px)} 40%,80%{transform:translateX(10px)} }`;
document.head.appendChild(_shakeStyle);

// ═══════════════════════════════════
//  INIT
// ═══════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  // Public page
  renderRedeemGrid();
  loadLeaderboard();

  const lookupForm = document.getElementById('lookupForm');
  if (lookupForm) lookupForm.addEventListener('submit', lookupPoints);

  const mobileInput = document.getElementById('mobileInput');
  if (mobileInput) mobileInput.addEventListener('input', e => { e.target.value = e.target.value.replace(/[^0-9]/g, ''); });

  // Admin page
  initAdmin();
});
