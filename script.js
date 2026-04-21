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
      id: 'findings-greeting-text',
      text: `Here's a breakdown of the seven key findings from the study — from respondent distribution to market readiness for wellness tools.`,
    },
    {
      id: 'market-greeting-text',
      text: `This section examines whether Bhutan has a viable market for digital wellness tools — and what the data says.`,
    },
    {
      id: 'files-greeting-text',
      text: 'Here are the files related to the project. Click "Preview" to view the Tableau Public story and the report directly on this page, or click "Download" to access the files.'
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

const LIVE_PAGES = [ 'products', 'home', 'about', 'findings', 'market', 'tableau', 'report'];


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
    target.style.animation = 'active';
    target.offsetHeight; // reflow
    target.style.animation = '';
  }

  // Activate nav button
  if (btn) btn.classList.add('active');

  // Sync bottom nav active state
  document.querySelectorAll('.bottom-nav-item').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-page') === pageId);
  });

  // Close mobile sidebar if open
  closeMobileSidebar();

  // Animate bars if navigating to market page
  if (pageId === 'market') {
    setTimeout(animateMarketBars, 200);
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

const PAGE_LABELS = {
  products: { label: 'Products',                    icon: '📦' },
  about:    { label: 'About This Project',          icon: 'ℹ️' },
  findings: { label: 'Key Findings',                icon: '📊' },
  market:   { label: 'Market Readiness',            icon: '📱' },
  tableau:  { label: 'Tableau Story',               icon: '📐' },
  report:   { label: 'Report',                      icon: '📄' },
  
};

function doSignOut() {
  visitorName = '';

  // Reset app screen
  const appScreen = document.getElementById('app-screen');
  appScreen.classList.remove('visible');
  appScreen.style.opacity = '';
  appScreen.style.transition = '';

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
  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active');
    p.style.display = '';
  });
  const homePage = document.getElementById('page-home');
  if (homePage) homePage.classList.add('active');

  // Reset name input
  document.getElementById('inp-name').value = '';
  document.getElementById('name-error').style.display = 'none';

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



// ── Mobile sidebar toggle ──────────────────────────────────────────────────

function toggleMobileSidebar() {
  const sidebar  = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  const isOpen   = sidebar.classList.contains('open');
  if (isOpen) {
    closeMobileSidebar();
  } else {
    sidebar.classList.add('open');
    backdrop.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }
}

function closeMobileSidebar() {
  const sidebar  = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  sidebar.classList.remove('open');
  backdrop.classList.remove('visible');
  document.body.style.overflow = '';
}


// ── Sync bottom nav active state ──────────────────────────────────────────

function syncBottomNav(btn) {
  const pageId = btn.getAttribute('data-page');
  document.querySelectorAll('.bottom-nav-item').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-page') === pageId);
  });
  // Also close drawer if open
  closeMobileSidebar();
}


// ── DOMContentLoaded: sidebar close + Enter key on name input ─────────────

document.addEventListener('DOMContentLoaded', () => {

  // Close sidebar drawer when a sidebar nav item is clicked on mobile
  document.querySelectorAll('.sidebar .nav-item').forEach(item => {
    item.addEventListener('click', () => {
      if (window.innerWidth <= 768) closeMobileSidebar();
    });
  });

  // Allow pressing Enter to submit the name screen
  const nameInput = document.getElementById('inp-name');
  if (nameInput) {
    nameInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') submitName();
    });
  }
});

