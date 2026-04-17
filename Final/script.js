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
    // {
    //   id: 'about-greeting-text',
    //   text: 'This section explains why this study was conducted, who carried it out, and what questions it set out to answer.',
    // },
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
      text: `Explore the tools and applications being developed by SomPel Tech to improve sleep health and daily wellbeing in Bhutan.`,
    },
  ];

  cards.forEach(({ id, text }) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  });
}


// ── Pages that are live (others show "Coming Soon") ───────────────────────

const LIVE_PAGES = ['home', 'about', 'findings', 'market', 'tableau', 'report', 'products'];


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
  products: { label: 'Products',                    icon: '📦' },
};



// ── Sign out ───────────────────────────────────────────────────────────────

function doSignOut() {
  visitorName = '';

  // Reset app screen
  const appScreen = document.getElementById('app-screen');
  appScreen.classList.remove('visible');
  appScreen.style.opacity = '';
  appScreen.style.transition = '';

  // Reset name input
  const input = document.getElementById('inp-name');
  if (input) { input.value = ''; }
  document.getElementById('name-error').style.display = 'none';

  // Reset sidebar user
  document.getElementById('sidebar-avatar').textContent = '?';
  document.getElementById('sidebar-username').textContent = '';

  // Reset greeting bar
  document.getElementById('greeting-text').innerHTML = '';

  // Reset nav — home active
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const homeBtn = document.querySelector('.nav-item[data-page="home"]');
  if (homeBtn) homeBtn.classList.add('active');

  // Reset pages — home active
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const homePage = document.getElementById('page-home');
  if (homePage) homePage.classList.add('active');

  // Show name screen
  document.getElementById('name-screen').style.display = '';

  window.scrollTo({ top: 0, behavior: 'instant' });
}


// ── Animate market bar fills ───────────────────────────────────────────────

function animateMarketBars() {
  document.querySelectorAll('.mkt-card-bar-fill[data-target]').forEach(bar => {
    const target = parseFloat(bar.getAttribute('data-target')) || 0;
    bar.style.transition = 'width 1s cubic-bezier(0.22,1,0.36,1)';
    bar.style.width = target + '%';
  });

  // Also animate plain fc-bar-fills (findings page)
  document.querySelectorAll('.fc-bar-fill[style*="width"]').forEach(bar => {
    const w = bar.style.width;
    bar.style.width = '0';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        bar.style.transition = 'width 1s cubic-bezier(0.22,1,0.36,1)';
        bar.style.width = w;
      });
    });
  });
}


// ── Scroll to a specific finding card ─────────────────────────────────────

function scrollToFinding(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const offset = 80; // account for sticky greeting bar
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: 'smooth' });
}


// ── Coming Soon overlay ────────────────────────────────────────────────────

function showComingSoon(pageId) {
  // Remove any existing overlay first
  const existing = document.getElementById('coming-soon-overlay');
  if (existing) existing.remove();

  const info = PAGE_LABELS[pageId] || { label: pageId, icon: '🚧' };

  const overlay = document.createElement('div');
  overlay.id = 'coming-soon-overlay';
  overlay.style.cssText = `
    position: fixed; inset: 0; z-index: 200;
    background: rgba(249,249,247,0.92);
    backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center;
  `;

  overlay.innerHTML = `
    <div style="
      background: var(--page);
      border: 1.5px solid var(--border);
      border-radius: 16px;
      padding: 48px 52px;
      text-align: center;
      max-width: 380px;
      width: 90%;
      box-shadow: 0 8px 48px rgba(0,0,0,0.10);
    ">
      <div style="font-size: 2.4rem; margin-bottom: 16px;">${info.icon}</div>
      <div style="font-size: 0.65rem; font-weight: 700; letter-spacing: 0.18em;
                  text-transform: uppercase; color: var(--muted); margin-bottom: 10px;">
        Coming Soon
      </div>
      <h2 style="font-family: 'Playfair Display', serif; font-size: 1.5rem;
                 font-weight: 700; color: var(--text); margin-bottom: 12px;">
        ${info.label}
      </h2>
      <p style="font-size: 0.85rem; color: var(--text2); line-height: 1.7; margin-bottom: 28px;">
        This section is currently being prepared. Check back soon.
      </p>
      <button onclick="document.getElementById('coming-soon-overlay').remove()"
        style="
          padding: 10px 24px;
          background: var(--green);
          border: none; border-radius: 8px;
          color: #fff; font-family: 'Outfit', sans-serif;
          font-size: 0.83rem; font-weight: 600;
          cursor: pointer; transition: background 0.2s;
        "
        onmouseover="this.style.background='var(--green-lt)'"
        onmouseout="this.style.background='var(--green)'">
        ← Go Back
      </button>
    </div>
  `;

  document.body.appendChild(overlay);
}