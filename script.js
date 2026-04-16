/* ── Bhutan Lifestyle Study · script.js ── */

let visitorName = '';

// ── Toggle PDF/preview viewer ──────────────────────────────────────────────
function togglePdfReader(viewerId, btn) {
  const viewer = document.getElementById(viewerId);
  if (!viewer) return;
  const isOpen = viewer.style.display !== 'none';
  viewer.style.display = isOpen ? 'none' : 'block';
  if (btn) btn.classList.toggle('prc-toggle-btn--active', !isOpen);
}

// ── Show home section (tabs) ───────────────────────────────────────────────
function showHomeSection(sectionId, btn) {
  document.querySelectorAll('.home-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.home-tab').forEach(b => b.classList.remove('active'));
  const target = document.getElementById('home-' + sectionId);
  if (target) target.classList.add('active');
  if (btn) btn.classList.add('active');
}

// ── Google Sheets logging ──────────────────────────────────────────────────
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbys3-Yefk8RbNEMZFzBJ9xupG4WMWhitYAw1EfoJnQwDEI-miDb9jNC2bthJtGbLGib2A/exec';

function logVisitor(name) {
  if (!SHEET_URL || SHEET_URL === 'YOUR_APPS_SCRIPT_URL') return;
  const now = new Date().toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
  fetch(SHEET_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, time: now }),
    mode: 'no-cors',
  }).catch(() => {});
}

// ── Greeting helper ────────────────────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

// ── Name submission ────────────────────────────────────────────────────────
function submitName() {
  const input = document.getElementById('inp-name');
  const err   = document.getElementById('name-error');
  const name  = input.value.trim();

  if (!name) {
    err.style.display = 'block';
    input.focus();
    return;
  }

  err.style.display = 'none';
  visitorName = name;
  logVisitor(name);

  // Set avatar (first letter)
  const avatar = document.getElementById('sidebar-avatar');
  avatar.textContent = name.charAt(0).toUpperCase();

  // Set username in sidebar
  document.getElementById('sidebar-username').textContent = name;

  // Personalised greetings for page cards
  const greet = getGreeting();
  setGreetingCards(name, greet);

  // Show greeting bar
  const bar = document.getElementById('greeting-bar');
  document.getElementById('greeting-text').innerHTML =
    `${greet}, <strong>${name}</strong> — welcome to SomPel Tech website 2026.`;

  // Transition screens
  document.getElementById('name-screen').style.display = 'none';

  const appScreen = document.getElementById('app-screen');
  appScreen.classList.add('visible');
  appScreen.style.opacity = '0';
  appScreen.style.transition = 'opacity 0.4s ease';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => { appScreen.style.opacity = '1'; });
  });

  // Animate market bars after a short delay (they'll be visible on market page)
  setTimeout(animateMarketBars, 600);

  window.scrollTo({ top: 0, behavior: 'instant' });
}

// ── Per-page personalised greeting cards ───────────────────────────────────
function setGreetingCards(name, greet) {
  const cards = [
    {
      id: 'about-greeting-text',
      text: 'This section explains why this study was conducted, who carried it out, and what questions it set out to answer.',
    },
    {
      id: 'findings-greeting-text',
      text: `Here's a breakdown of the seven key findings from the study — from respondent distribution to market readiness for wellness tools.`,
    },
    {
      id: 'market-greeting-text',
      text: `This section examines whether Bhutan has a viable market for digital wellness tools — and what the data says.`,
    },
    {
      id: 'products-greeting-text',
      text: `Explore the tools built from this research — try the live Benchmarking Platform or stay tuned for the upcoming Sleep & Lifestyle App.`,
    },
  ];
  cards.forEach(({ id, text }) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  });
}

// ── Pages that are live (others show "Coming Soon") ───────────────────────
const LIVE_PAGES = ['home', 'about', 'findings', 'market', 'tableau', 'report', 'products', 'sompal'];

// ── Navigation ─────────────────────────────────────────────────────────────
function navigateTo(pageId, btn) {
  // If page isn't live yet, show the coming-soon overlay
  if (!LIVE_PAGES.includes(pageId)) {
    showComingSoon(pageId);
    return;
  }

  // Deactivate all pages & nav items
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  // Activate target page
  const target = document.getElementById('page-' + pageId);
  if (target) {
    target.classList.add('active');
    target.style.animation = 'none';
    target.offsetHeight; // reflow
    target.style.animation = '';
  }

  // Activate nav button
  if (btn) btn.classList.add('active');

  // Animate bars if navigating to market page
  if (pageId === 'market') {
    setTimeout(animateMarketBars, 200);
  }



  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Coming Soon overlay ────────────────────────────────────────────────────
const PAGE_LABELS = {
  about:    { label: 'About This Project',          icon: 'ℹ️' },
  findings: { label: 'Key Findings',                icon: '📊' },
  market:   { label: 'Market Readiness',            icon: '📱' },
  tableau:  { label: 'Tableau Story',               icon: '📐' },
  report:   { label: 'Report',                      icon: '📄' },
  products: { label: 'Product',                     icon: '💡' },
  sompal:   { label: 'Sleep & Lifestyle Platform',  icon: '🌙' },
};

// ── Navigate into the SomPel platform (called by Products "Try it now" btn) ─
function showBenchmarkTool() {
  navigateTo('sompal', document.querySelector('[data-page="sompal"]'));
}

function showComingSoon(pageId) {
  // Remove any existing overlay
  const old = document.getElementById('coming-soon-overlay');
  if (old) old.remove();

  const info = PAGE_LABELS[pageId] || { label: pageId, icon: '🔒' };

  const overlay = document.createElement('div');
  overlay.id = 'coming-soon-overlay';
  overlay.innerHTML = `
    <div class="cs-backdrop" onclick="closeComingSoon()"></div>
    <div class="cs-card">
      <div class="cs-icon">${info.icon}</div>
      <div class="cs-tag">Coming Soon</div>
      <h2 class="cs-title">${info.label}</h2>
      <p class="cs-text">This section is being prepared and will be available soon. Stay tuned!</p>
      <button class="cs-btn" onclick="closeComingSoon()">← Back to Home</button>
    </div>
  `;
  document.body.appendChild(overlay);

  // Trigger animation
  requestAnimationFrame(() => overlay.classList.add('cs-visible'));
}

function closeComingSoon() {
  const overlay = document.getElementById('coming-soon-overlay');
  if (!overlay) return;
  overlay.classList.remove('cs-visible');
  setTimeout(() => overlay.remove(), 280);
}

// ── Market bar animation ───────────────────────────────────────────────────
let barsAnimated = false;

function animateMarketBars() {
  // Animate both old .market-bar-fill and new .mkt-card-bar-fill
  const bars = document.querySelectorAll('.market-bar-fill, .mkt-card-bar-fill');
  bars.forEach(bar => {
    const target = bar.getAttribute('data-target');
    if (target) {
      bar.style.width = '0';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          bar.style.width = target + '%';
        });
      });
    }
  });
}

// ── Scroll to finding card ─────────────────────────────────────────────────
function scrollToFinding(id) {
  // Make sure findings page is active
  const findingsBtn = document.querySelector('[data-page="findings"]');
  navigateTo('findings', findingsBtn);
  setTimeout(() => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('finding-highlight');
      setTimeout(() => el.classList.remove('finding-highlight'), 1400);
    }
  }, 150);
}


function doSignOut() {
  const appScreen = document.getElementById('app-screen');
  appScreen.style.transition = 'opacity 0.3s ease';
  appScreen.style.opacity = '0';

  setTimeout(() => {
    appScreen.classList.remove('visible');
    appScreen.style.opacity = '';
    appScreen.style.transition = '';

    document.getElementById('name-screen').style.display = 'flex';
    document.getElementById('inp-name').value = '';
    document.getElementById('name-error').style.display = 'none';
    visitorName = '';

    // Reset nav to home
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-home').classList.add('active');
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const homeBtn = document.querySelector('[data-page="home"]');
    if (homeBtn) homeBtn.classList.add('active');

    barsAnimated = false;
  }, 300);
}

// ── Keyboard: Enter on name screen ────────────────────────────────────────
document.addEventListener('keydown', function (e) {
  if (e.key !== 'Enter') return;
  const ns = document.getElementById('name-screen');
  if (ns && ns.style.display !== 'none') {
    submitName();
  }
});