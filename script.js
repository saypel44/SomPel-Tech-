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
      text: `${name}, this section explains why this study was conducted, who carried it out, and what questions it set out to answer.`,
    },
    {
      id: 'findings-greeting-text',
      text: `${name}, here's a breakdown of the seven key findings from the study — from respondent distribution to market readiness for wellness tools.`,
    },
    {
      id: 'market-greeting-text',
      text: ` ${name}, this section examines whether Bhutan has a viable market for digital wellness tools — and what the data says.`,
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
  about:    { label: 'About This Project', icon: 'ℹ️' },
  findings: { label: 'Key Findings',        icon: '📊' },
  market:   { label: 'Market Readiness',    icon: '📱' },
  tableau:  { label: 'Tableau Story',       icon: '📐' },
  report:   { label: 'Report',              icon: '📄' },
};

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


// ── Benchmarking Tool ──────────────────────────────────────────────────────

// Survey dataset averages (from the 358-respondent study)
const BHUTAN_DATA = {
  {
    section: 'Section 1 · Demographics',
    q: 'Where do you currently live?',
    key: 'residence',
    type: 'list',
    opts: [
      { val: 'urban',      label: '🏙️ Urban',      sub: 'City or town centre' },
      { val: 'semi-urban', label: '🏘️ Semi-urban',  sub: 'Town outskirts or peri-urban' },
      { val: 'rural',      label: '🌾 Rural',       sub: 'Village or remote area' },
    ],
  },
  {
    section: 'Section 1 · Demographics',
    q: 'What is your age group?',
    key: 'age',
    type: 'grid',
    opts: [
      { val: 'under18', label: 'Under 18' },
      { val: '18-25',   label: '18 – 25' },
      { val: '26-35',   label: '26 – 35' },
      { val: '36-50',   label: '36 – 50' },
      { val: '50+',     label: '50+' },
    ],
  },
  {
    section: 'Section 2 · Work & Daily Routine',
    q: 'What kind of work do you mostly do?',
    key: 'workType',
    type: 'list',
    opts: [
      { val: 'mental',   label: '🧠 Mostly mental',   sub: 'Study, office, screens' },
      { val: 'physical', label: '💪 Mostly physical',  sub: 'Farming, walking, labour' },
      { val: 'mixed',    label: '⚖️ Mixed',            sub: 'Both types equally' },
    ],
  },
  {
    section: 'Section 2 · Work & Daily Routine',
    q: 'How many hours do you work or study per day?',
    key: 'workHours',
    type: 'grid',
    opts: [
      { val: '0-4', label: '0 – 4 hrs' },
      { val: '5-6', label: '5 – 6 hrs' },
      { val: '7-8', label: '7 – 8 hrs' },
      { val: '8+',  label: 'More than 8 hrs' },
    ],
  },
  {
    section: 'Section 3 · Screen Habits',
    q: 'How long do you use your phone <em>before sleep</em>?',
    key: 'screenTime',
    type: 'list',
    opts: [
      { val: 'none', label: '📵 No phone before bed' },
      { val: '<30',  label: '⏱️ Under 30 minutes' },
      { val: '30-60',label: '🕐 30 – 60 minutes' },
      { val: '1-2h', label: '📱 1 – 2 hours' },
      { val: '2h+',  label: '🌀 More than 2 hours' },
    ],
  },
  {
    section: 'Section 4 · Sleep Duration',
    q: 'How many hours do you sleep per night on average?',
    key: 'sleepHours',
    type: 'grid',
    opts: [
      { val: '0-4', label: '0 – 4 hrs' },
      { val: '5-6', label: '5 – 6 hrs' },
      { val: '7-8', label: '7 – 8 hrs' },
      { val: '8+',  label: 'More than 8 hrs' },
    ],
  },
  {
    section: 'Section 5 · Sleep Quality',
    q: 'I fall asleep easily at night.',
    key: 'fallAsleep',
    type: 'likert',
    opts: [
      { val: '1', label: '😖', sub: 'Strongly\nDisagree' },
      { val: '2', label: '😕', sub: 'Disagree' },
      { val: '3', label: '😐', sub: 'Neutral' },
      { val: '4', label: '🙂', sub: 'Agree' },
      { val: '5', label: '😄', sub: 'Strongly\nAgree' },
    ],
  },
  {
    section: 'Section 5 · Sleep Quality',
    q: 'I wake up feeling rested and refreshed.',
    key: 'wakeRested',
    type: 'likert',
    opts: [
      { val: '1', label: '😖', sub: 'Strongly\nDisagree' },
      { val: '2', label: '😕', sub: 'Disagree' },
      { val: '3', label: '😐', sub: 'Neutral' },
      { val: '4', label: '🙂', sub: 'Agree' },
      { val: '5', label: '😄', sub: 'Strongly\nAgree' },
    ],
  },
  {
    section: 'Section 5 · Sleep Quality',
    q: 'I have enough energy throughout the day.',
    key: 'dayEnergy',
    type: 'likert',
    opts: [
      { val: '1', label: '😖', sub: 'Strongly\nDisagree' },
      { val: '2', label: '😕', sub: 'Disagree' },
      { val: '3', label: '😐', sub: 'Neutral' },
      { val: '4', label: '🙂', sub: 'Agree' },
      { val: '5', label: '😄', sub: 'Strongly\nAgree' },
    ],
  },
];

const BHUTAN_AVG = {
  urban:  { work: 6.09, screen: 1.97, sleep: 7.03 },
  rural:  { work: 5.64, screen: 2.15, sleep: 7.09 },
};

let quizStep = 0;
let quizAnswers = {};

function navigateToQuiz() {
  quizReset();
  navigateTo('quiz', null);
  // No nav item highlights for quiz — it's a sub-page of products
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function quizGoBack() {
  // Return to products
  navigateTo('products', document.querySelector('[data-page="products"]'));
}

function quizRenderStep() {
  const q = QUIZ_QUESTIONS[quizStep];
  const total = QUIZ_QUESTIONS.length;
  const pct = (quizStep / total) * 100;

  // Progress
  document.getElementById('quiz-progress-fill').style.width = pct + '%';
  document.getElementById('quiz-section-label').textContent = q.section;
  document.getElementById('quiz-count-label').textContent = `${quizStep + 1} of ${total}`;

  // Header
  document.getElementById('quiz-eyebrow').textContent = q.section;
  document.getElementById('quiz-question').innerHTML = q.q;

  // Back button visibility
  const backBtn = document.getElementById('quiz-nav-back');
  backBtn.style.visibility = quizStep > 0 ? 'visible' : 'hidden';

  // Next button
  const nextBtn = document.getElementById('quiz-nav-next');
  const isLast = quizStep === total - 1;
  nextBtn.textContent = isLast ? 'See my results →' : 'Next →';
  nextBtn.disabled = !quizAnswers[q.key];

  // Render options
  const container = document.getElementById('quiz-options-container');
  const selectedVal = quizAnswers[q.key] || null;

  if (q.type === 'likert') {
    container.innerHTML = `<div class="quiz-options--likert">` +
      q.opts.map(o => `
        <button class="quiz-opt quiz-opt--likert${selectedVal === o.val ? ' selected' : ''}"
          data-key="${q.key}" data-val="${o.val}" onclick="quizSelectOpt(this)">
          <div class="quiz-opt-check">${selectedVal === o.val ? '✓' : ''}</div>
          ${o.label}
          <small>${o.sub}</small>
        </button>`).join('') +
      `</div>`;
  } else if (q.type === 'grid') {
    container.innerHTML = `<div class="quiz-options--grid">` +
      q.opts.map(o => `
        <button class="quiz-opt${selectedVal === o.val ? ' selected' : ''}"
          data-key="${q.key}" data-val="${o.val}" onclick="quizSelectOpt(this)">
          <div class="quiz-opt-check">${selectedVal === o.val ? '✓' : ''}</div>
          ${o.label}
        </button>`).join('') +
      `</div>`;
  } else {
    container.innerHTML = `<div class="quiz-options">` +
      q.opts.map(o => `
        <button class="quiz-opt${selectedVal === o.val ? ' selected' : ''}"
          data-key="${q.key}" data-val="${o.val}" onclick="quizSelectOpt(this)">
          <div class="quiz-opt-check">${selectedVal === o.val ? '✓' : ''}</div>
          <div><div>${o.label}</div>${o.sub ? `<small>${o.sub}</small>` : ''}</div>
        </button>`).join('') +
      `</div>`;
  }

  // Re-animate card
  const card = document.getElementById('quiz-card');
  card.style.animation = 'none';
  card.offsetHeight;
  card.style.animation = '';
}

function quizSelectOpt(btn) {
  const key = btn.dataset.key;
  const val = btn.dataset.val;
  quizAnswers[key] = val;

  // Update selection UI
  btn.closest('[class*="quiz-options"]').querySelectorAll('.quiz-opt').forEach(b => {
    b.classList.remove('selected');
    const chk = b.querySelector('.quiz-opt-check');
    if (chk) chk.textContent = '';
  });
  btn.classList.add('selected');
  const chk = btn.querySelector('.quiz-opt-check');
  if (chk) chk.textContent = '✓';

  // Enable next
  document.getElementById('quiz-nav-next').disabled = false;

  // Auto-advance for non-likert
  const q = QUIZ_QUESTIONS[quizStep];
  if (q.type !== 'likert') {
    setTimeout(() => {
      if (quizStep < QUIZ_QUESTIONS.length - 1) {
        quizStep++;
        quizRenderStep();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        quizShowResults();
      }
    }, 300);
  }
}

function quizNext() {
  if (quizStep < QUIZ_QUESTIONS.length - 1) {
    quizStep++;
    quizRenderStep();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    quizShowResults();
  }
}

function quizBack() {
  if (quizStep > 0) {
    quizStep--;
    quizRenderStep();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function quizShowResults() {
  // Hide card, show results
  document.getElementById('quiz-card').style.display = 'none';
  document.getElementById('quiz-top-bar').style.display = 'none';
  const results = document.getElementById('quiz-results');
  results.style.display = 'block';

  const a = quizAnswers;
  const isUrban = a.residence !== 'rural';
  const avg = isUrban ? BHUTAN_AVG.urban : BHUTAN_AVG.rural;

  const myWork   = { '0-4':2,'5-6':5.5,'7-8':7.5,'8+':9 }[a.workHours] || 6;
  const myScreen = { 'none':0,'<30':0.25,'30-60':0.75,'1-2h':1.5,'2h+':2.5 }[a.screenTime] || 1;
  const mySleep  = { '0-4':3,'5-6':5.5,'7-8':7.5,'8+':8.5 }[a.sleepHours] || 7;
  const sleepScore = ((+a.fallAsleep||3)+(+a.wakeRested||3)+(+a.dayEnergy||3))/3;

  // Hero
  const name = visitorName || 'Your';
  document.getElementById('quiz-results-name').textContent = `${name}'s Lifestyle Report`;
  document.getElementById('quiz-results-sub').textContent =
    `Here's how your habits compare with ${isUrban ? 'urban' : 'rural'} respondents from across Bhutan.`;

  // Score badge
  const scoreLabel = sleepScore >= 4 ? '😄 Good Sleep Health' : sleepScore >= 3 ? '😐 Moderate Sleep Health' : '😔 Needs Attention';
  const scoreColor = sleepScore >= 4 ? '#6BA368' : sleepScore >= 3 ? '#B08D57' : '#C0392B';
  document.getElementById('quiz-score-row').innerHTML = `
    <div class="quiz-score-badge" style="background:${scoreColor}20;color:${scoreColor};border:1.5px solid ${scoreColor}40;">
      ${scoreLabel} · ${sleepScore.toFixed(1)}/5
    </div>
    <div class="quiz-score-badge" style="background:rgba(107,163,104,0.10);color:#3A7040;border:1.5px solid rgba(107,163,104,0.25);">
      📍 ${isUrban ? 'Urban' : 'Rural'} comparison
    </div>
  `;

  // Compare cards
  const comparisons = [
    {
      icon: '⏰', label: 'Daily Work Hours',
      you: myWork, avg: avg.work, unit: 'hrs',
      youLabel: a.workHours === '8+' ? '8+ hrs' : a.workHours + ' hrs',
      avgLabel: avg.work.toFixed(1) + ' hrs',
      status: myWork > avg.work + 1 ? 'high' : myWork < avg.work - 1 ? 'low' : 'avg',
    },
    {
      icon: '📱', label: 'Screen Before Sleep',
      you: myScreen, avg: avg.screen, unit: 'hrs',
      youLabel: { 'none':'No phone','<30':'<30 min','30-60':'30-60 min','1-2h':'1-2 hrs','2h+':'2+ hrs' }[a.screenTime],
      avgLabel: avg.screen.toFixed(2) + ' hrs',
      status: myScreen > avg.screen + 0.25 ? 'high' : myScreen < avg.screen - 0.25 ? 'low' : 'avg',
    },
    {
      icon: '🌙', label: 'Sleep Duration',
      you: mySleep, avg: avg.sleep, unit: 'hrs',
      youLabel: a.sleepHours === '8+' ? '8+ hrs' : a.sleepHours + ' hrs',
      avgLabel: avg.sleep.toFixed(1) + ' hrs',
      status: mySleep < avg.sleep - 0.5 ? 'low' : mySleep > avg.sleep + 0.5 ? 'high' : 'avg',
    },
  ];

  const statusLabels = { high:'▲ Above average', low:'▼ Below average', avg:'● On average' };
  const statusClasses = { high:'res-status--high', low:'res-status--low', avg:'res-status--avg' };

  document.getElementById('quiz-compare-grid').innerHTML = comparisons.map(c => {
    const maxVal = Math.max(c.you, c.avg) * 1.35 || 10;
    const youPct = Math.min((c.you / maxVal)*100, 100).toFixed(1);
    const avgPct = Math.min((c.avg / maxVal)*100, 100).toFixed(1);
    return `
      <div class="quiz-compare-card">
        <div class="quiz-compare-card-top">
          <span class="quiz-compare-icon">${c.icon}</span>
          <div>
            <div class="quiz-compare-label">${c.label}</div>
            <span class="quiz-compare-status ${statusClasses[c.status]}">${statusLabels[c.status]}</span>
          </div>
        </div>
        <div class="quiz-compare-bars">
          <div class="quiz-compare-bar-row">
            <span class="quiz-compare-bar-tag quiz-compare-bar-tag--you">You</span>
            <div class="quiz-compare-bar-track"><div class="quiz-compare-bar-fill quiz-compare-bar-fill--you" data-target="${youPct}"></div></div>
            <span class="quiz-compare-bar-val">${c.youLabel}</span>
          </div>
          <div class="quiz-compare-bar-row">
            <span class="quiz-compare-bar-tag quiz-compare-bar-tag--avg">Avg</span>
            <div class="quiz-compare-bar-track"><div class="quiz-compare-bar-fill quiz-compare-bar-fill--avg" data-target="${avgPct}"></div></div>
            <span class="quiz-compare-bar-val">${c.avgLabel}</span>
          </div>
        </div>
      </div>`;
  }).join('');

  // Animate bars
  setTimeout(() => {
    document.querySelectorAll('.quiz-compare-bar-fill').forEach(b => {
      const t = b.dataset.target;
      if (t) { b.style.width='0'; requestAnimationFrame(() => requestAnimationFrame(() => { b.style.width = t + '%'; })); }
    });
  }, 300);

  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Fetch AI recommendation
  fetchAIRecommendation(a, { myWork, myScreen, mySleep, sleepScore, isUrban, avg });
}

async function fetchAIRecommendation(a, metrics) {
  const loading = document.getElementById('quiz-ai-loading');
  const content = document.getElementById('quiz-ai-content');
  loading.style.display = 'flex';
  content.style.display = 'none';

  const screenLabel = { 'none':'no phone before bed','<30':'under 30 minutes of screen time before sleep','30-60':'30-60 minutes of screen time before sleep','1-2h':'1-2 hours of screen time before sleep','2h+':'more than 2 hours of screen time before sleep' }[a.screenTime] || a.screenTime;
  const workLabel = { '0-4':'0-4 hours','5-6':'5-6 hours','7-8':'7-8 hours','8+':'more than 8 hours' }[a.workHours] || a.workHours;
  const sleepLabel = { '0-4':'0-4 hours','5-6':'5-6 hours','7-8':'7-8 hours','8+':'more than 8 hours' }[a.sleepHours] || a.sleepHours;

  const prompt = `You are a compassionate wellness advisor for SomPel Tech, a Bhutanese startup focused on sleep and lifestyle wellbeing.

User profile:
- Name: ${visitorName || 'the user'}
- Location: ${a.residence || 'Bhutan'}
- Age group: ${a.age || 'unknown'}
- Work type: ${a.workType || 'unknown'}
- Work hours: ${workLabel} per day (Bhutan ${metrics.isUrban ? 'urban' : 'rural'} average: ${metrics.avg.work.toFixed(1)} hrs)
- Screen time before sleep: ${screenLabel} (Bhutan average: ${metrics.avg.screen.toFixed(2)} hrs)
- Sleep duration: ${sleepLabel} per night (Bhutan average: ${metrics.avg.sleep.toFixed(1)} hrs)
- Falls asleep easily: ${['','Strongly disagree','Disagree','Neutral','Agree','Strongly agree'][+a.fallAsleep] || 'neutral'}
- Wakes up rested: ${['','Strongly disagree','Disagree','Neutral','Agree','Strongly agree'][+a.wakeRested] || 'neutral'}
- Daytime energy: ${['','Strongly disagree','Disagree','Neutral','Agree','Strongly agree'][+a.dayEnergy] || 'neutral'}
- Overall sleep quality score: ${metrics.sleepScore.toFixed(1)}/5

Write a personalised, warm, and motivating wellness recommendation for this person. Structure your response with:
1. A brief personal greeting using their name (1-2 sentences acknowledging their specific situation)
2. **What's working well** — highlight 1-2 positive habits or strengths from their data
3. **Your top 3 personalised recommendations** — specific, actionable, culturally sensitive to Bhutan. Each should be concrete (not generic). Reference their actual data points (e.g. their specific screen time, work hours).
4. **A motivational closing** — a short, warm sentence encouraging them.

Keep the tone warm, personal, non-judgmental, and encouraging. Use simple language. Format in clean HTML using <h4> for section titles, <ul><li> for lists. Keep total length to about 250-300 words. Do NOT use markdown. Start directly with the greeting, no preamble.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();
    const text = (data.content || []).map(b => b.text || '').join('');

    loading.style.display = 'none';
    content.style.display = 'block';
    content.innerHTML = text;
  } catch (err) {
    loading.style.display = 'none';
    content.style.display = 'block';
    // Fallback static recommendations
    const recos = [];
    if (metrics.myScreen > 1.5) recos.push('<li><strong>Reduce pre-sleep screen time:</strong> You\'re using your phone significantly more than average before bed. Try putting it away 45 minutes before sleep — even small reductions make a real difference.</li>');
    if (metrics.mySleep < 6.5) recos.push('<li><strong>Prioritise more sleep:</strong> You\'re sleeping less than the Bhutan average. Even going to bed 30 minutes earlier can improve your energy and focus the next day.</li>');
    if (metrics.myWork > 8)    recos.push('<li><strong>Build recovery time:</strong> Long work hours can accumulate stress. Try a 10-minute wind-down ritual after work before picking up your phone.</li>');
    if (metrics.sleepScore < 3) recos.push('<li><strong>Create a bedtime routine:</strong> A consistent routine — same sleep time, low light, no screens — can help signal your body it\'s time to rest.</li>');
    if (recos.length === 0)     recos.push('<li><strong>Keep it up!</strong> Your habits are well-aligned with healthy sleep. Maintain your consistent routine and low screen use before bed.</li>');

    content.innerHTML = `
      <h4>Your Personalised Recommendations</h4>
      <ul>${recos.join('')}</ul>
      <p>Small, consistent changes to your daily habits can make a big difference to your sleep quality and overall wellbeing. — SomPel Tech</p>`;
  }
}



// Survey dataset averages (from the 358-respondent study)
const BHUTAN_DATA = {
  avgWorkHoursUrban:  6.09,
  avgWorkHoursRural:  5.64,
  avgScreenUrban:     1.97,
  avgScreenRural:     2.15,
  avgSleepUrban:      7.03,
  avgSleepRural:      7.09,
  // % who said screen time harms sleep: ~70% based on findings
  screenHarmPct:      70,
  // willingness to use app: 55%+ yes
  appWillingPct:      55,
};

let bmarkAnswers  = {};
let bmarkStep     = 1;
const BMARK_TOTAL = 4;

function showBenchmarkTool() {
  navigateTo('sompal', null);
  setTimeout(() => { spInit(); gp('home'); }, 60);
}

function hideBenchmarkTool() {
  navigateTo('products', document.querySelector('[data-page="products"]'));
}

// ── SOMPAL TECH: all state and logic ─────────────────────────────────────────
// These functions are called by inline onclick handlers inside #page-sompal.
// They operate exclusively on elements within that page.

let spQAge = 'u18', spQLoc = 'urban';
let spFAge = 'u18', spFLoc = 'urban';
let spChartMode = 'w', spSelSound = 'Gentle Bell';
let spQLA = {}, spFLA = {};
let spFLogs = [];
let spInited = false;

const SP_BM = {
  urban: {
    'u18':   { sleep:8.2, screen:2.1, work:3.0, score:74 },
    '18-25': { sleep:7.0, screen:2.8, work:7.2, score:65 },
    '26-35': { sleep:6.5, screen:2.2, work:8.5, score:62 },
    '36-50': { sleep:6.8, screen:1.5, work:8.0, score:68 },
    '50+':   { sleep:7.2, screen:0.8, work:5.0, score:72 }
  },
  rural: {
    'u18':   { sleep:8.8, screen:0.5, work:2.5, score:82 },
    '18-25': { sleep:7.8, screen:0.8, work:6.0, score:78 },
    '26-35': { sleep:7.5, screen:0.6, work:7.0, score:76 },
    '36-50': { sleep:7.8, screen:0.4, work:7.5, score:79 },
    '50+':   { sleep:8.0, screen:0.3, work:5.5, score:81 }
  }
};

const SP_LQS = [
  'I go to sleep at the same time every night.',
  'I fall asleep easily.',
  'I sleep well most nights.',
  'I wake up feeling rested.',
  'I have enough energy during the day.'
];

const SP_TIPS = [
  { cl:'caffeine', ic:'☕', ct:'Caffeine',            h:'Cut off caffeine by 2 PM',              p:'Caffeine has a half-life of 5–7 hours. A cup of tea at 3 PM still has half its stimulant effect at bedtime — making it harder to fall asleep even if you feel tired.' },
  { cl:'light',    ic:'💡', ct:'Light Exposure',       h:'Morning light resets your clock',        p:'Exposure to natural light within the first hour of waking sets your circadian rhythm. Even 10 minutes outside helps regulate when you feel sleepy at night.' },
  { cl:'light',    ic:'📵', ct:'Screen Light',          h:'Blue light delays melatonin by 3 hours', p:'Phone and laptop screens emit blue light that suppresses melatonin. Dimming screens or using night mode 90 minutes before bed meaningfully improves sleep onset.' },
  { cl:'temp',     ic:'🌡️', ct:'Bedroom Temperature', h:'Cooler rooms = deeper sleep',            p:'Your core body temperature drops during sleep. A bedroom between 18–21°C supports this natural process and helps you enter deep sleep more easily.' },
  { cl:'wind',     ic:'🧘', ct:'Wind-Down Routine',    h:'Signal sleep with a consistent ritual',  p:'Your brain learns to associate cues with sleep. A 20-minute wind-down routine — same time, same order — trains your body to transition automatically.' },
  { cl:'caffeine', ic:'🥱', ct:'Sleep Consistency',    h:'Wake time matters more than bedtime',    p:'Keeping a consistent wake time — even on weekends — anchors your sleep cycle more effectively than any supplement.' },
  { cl:'light',    ic:'🚶', ct:'Movement',              h:'30 min of movement improves sleep depth', p:'Regular physical activity, even gentle walks, increases slow-wave sleep. Avoid vigorous exercise within 2 hours of bedtime.' },
  { cl:'temp',     ic:'🍽️', ct:'Eating Habits',        h:'Avoid heavy meals within 3 hrs of bed',  p:'Digestion competes with sleep. Eating late keeps your body metabolically active. A large meal delays and fragments your sleep cycles.' }
];

// ── Page map for SomPel nav tabs ──────────────────────────────────────────────
const SP_pgMap = {
  'home':'nt-home','qp':'nt-qp','qh':'nt-qh','qr':'nt-qr','qt':'nt-qt',
  'fp':'nt-fp','fr':'nt-fr','fh':'nt-fh','fi':'nt-fi','ft':'nt-ft','ftp':'nt-ftp'
};
const SP_QN = ['nt-qp','nt-qh','nt-qr','nt-qt'];
const SP_FN = ['nt-fp','nt-fr','nt-fh','nt-fi','nt-ft','nt-ftp'];

// ── Navigate within SomPel sub-pages ─────────────────────────────────────────
function gp(id) {
  document.querySelectorAll('.sp-page').forEach(p => p.classList.remove('active'));
  document.getElementById('pg-' + id)?.classList.add('active');
  document.querySelectorAll('#sp-nav-tabs .nav-tab').forEach(t => t.classList.remove('active'));
  document.getElementById(SP_pgMap[id])?.classList.add('active');
  if (id === 'fi') { spFUpdateScore(); spRenderCG('ficg', spFAge, spFLoc); spRenderBars('fibars', spFAge, spFLoc); spFUpdateRecs(); }
  if (id === 'ft') { setTimeout(drawChart, 80); }
  if (id === 'qt' && !spQTipGenerated) { spQTipGenerated = true; spGenerateAITip('q'); }
  if (id === 'ftp' && !spFTipGenerated) { spFTipGenerated = true; spGenerateAITip('f'); }
  const app = document.getElementById('sp-app');
  if (app) app.scrollTop = 0;
  else window.scrollTo(0, 0);
}

// ── Mode selection ────────────────────────────────────────────────────────────
function selMode(m) {
  document.getElementById('mc-q')?.classList.toggle('sel', m === 'q');
  document.getElementById('mc-f')?.classList.toggle('sel', m === 'f');
}

function startMode(m) {
  selMode(m);
  const badge = document.getElementById('nav-badge');
  if (badge) {
    badge.className = 'nav-badge ' + (m === 'q' ? 'quick' : 'full');
    badge.textContent = m === 'q' ? '⚡ Quick Check' : '📊 Full Tracker';
  }
  [...SP_QN, ...SP_FN].forEach(id => document.getElementById(id)?.classList.add('hidden'));
  document.getElementById('nt-home')?.classList.remove('active');
  if (m === 'q') {
    SP_QN.forEach(id => document.getElementById(id)?.classList.remove('hidden'));
    gp('qp');
  } else {
    SP_FN.forEach(id => document.getElementById(id)?.classList.remove('hidden'));
    gp('fp');
  }
}

// ── Age / Loc selectors ───────────────────────────────────────────────────────
function setQAge(el, ag) {
  document.querySelectorAll('#q-atabs .atab').forEach(t => t.classList.remove('active'));
  el.classList.add('active'); spQAge = ag;
  const s = document.getElementById('qsa'); if (s) s.value = ag;
  spRenderCG('qcg', spQAge, spQLoc);
}
function setQLoc(el, loc) {
  document.querySelectorAll('#q-ltabs .ltab').forEach(t => t.classList.remove('active','urban','rural'));
  el.classList.add('active', loc); spQLoc = loc;
  const s = document.getElementById('qsl'); if (s) s.value = loc;
  spRenderCG('qcg', spQAge, spQLoc);
}
function qSyncAge() { const v = document.getElementById('qsa')?.value; if (v) { spQAge = v; spRenderCG('qcg', spQAge, spQLoc); } }
function qSyncLoc() { const v = document.getElementById('qsl')?.value; if (v) { spQLoc = v; spRenderCG('qcg', spQAge, spQLoc); } }

function setFAge(el, ag) {
  document.querySelectorAll('#f-atabs .atab').forEach(t => t.classList.remove('active'));
  el.classList.add('active'); spFAge = ag;
  const s = document.getElementById('fsa'); if (s) s.value = ag;
  spRenderCG('fcg', spFAge, spFLoc);
}
function setFLoc(el, loc) {
  document.querySelectorAll('#f-ltabs .ltab').forEach(t => t.classList.remove('active','urban','rural'));
  el.classList.add('active', loc); spFLoc = loc;
  const s = document.getElementById('fsl'); if (s) s.value = loc;
  spRenderCG('fcg', spFAge, spFLoc);
}
function fSyncAge() { const v = document.getElementById('fsa')?.value; if (v) { spFAge = v; spRenderCG('fcg', spFAge, spFLoc); } }
function fSyncLoc() { const v = document.getElementById('fsl')?.value; if (v) { spFLoc = v; spRenderCG('fcg', spFAge, spFLoc); } }

// ── Compare stats grid ────────────────────────────────────────────────────────
function spRenderCG(id, ag, loc) {
  const b = SP_BM[loc]?.[ag] || SP_BM.urban['18-25'];
  const e = document.getElementById(id); if (!e) return;
  e.innerHTML = `
    <div class="cstat"><div class="csl">Avg Sleep Hours</div><div class="csv" style="color:var(--sky)">${b.sleep}</div><div class="csb">Healthy benchmark</div></div>
    <div class="cstat"><div class="csl">Screen Before Bed</div><div class="csv" style="color:var(--accent)">${b.screen}h</div><div class="csb">Avg for group</div></div>
    <div class="cstat"><div class="csl">Work Hours</div><div class="csv" style="color:var(--accent)">${b.work}</div><div class="csb">Avg for group</div></div>
    <div class="cstat"><div class="csl">Wellness Score</div><div class="csv" style="color:var(--green)">${b.score}</div><div class="csb">Group average</div></div>`;
}

// ── Bars ──────────────────────────────────────────────────────────────────────
function spRenderBars(id, ag, loc) {
  const b = SP_BM[loc]?.[ag] || SP_BM.urban['18-25'];
  const e = document.getElementById(id); if (!e) return;
  const last = spFLogs[0];
  const us = last ? ({'0-4':2,'5-6':5.5,'7-8':7.5,'9+':9}[last.sleep] || 0) : 0;
  const uc = last ? ({'none':0,'30min':0.25,'1hr':0.75,'2hr':1.5,'3hr':2.5,'3+hr':4}[last.screen] || 0) : 0;
  const mb = (lbl, you, bench, max, unit) => `
    <div class="cbrow">
      <div class="cblabel"><span>${lbl}</span><span style="color:var(--muted)">You: ${you || '?'} ${unit} · Benchmark: ${bench} ${unit}</span></div>
      <div class="btrack"><div class="bfill by" style="width:${you ? Math.min(100, you/max*100) : 0}%"></div></div>
      <div class="btrack"><div class="bfill bb" style="width:${Math.min(100, bench/max*100)}%"></div></div>
      <div style="display:flex;gap:.9rem;margin-top:.2rem;font-size:.7rem;color:var(--muted)"><span style="color:var(--sky)">■ You</span><span style="color:var(--green)">■ Benchmark</span></div>
    </div>`;
  e.innerHTML = mb('Sleep Hours', us, b.sleep, 10, 'hrs') + mb('Screen Before Bed', uc, b.screen, 5, 'hrs');
}

// ── Likert scale ──────────────────────────────────────────────────────────────
function spBuildLikert(id, obj, pfx) {
  const e = document.getElementById(id); if (!e) return;
  e.innerHTML = SP_LQS.map((q, i) =>
    `<div class="lrow"><div class="lq">${q}</div><div class="lscale">${
      [1,2,3,4,5].map(v =>
        `<button class="lbtn" id="${pfx}l${i}v${v}" onclick="spPickL('${pfx}',${i},${v})">${v}</button>`
      ).join('')
    }</div></div>`
  ).join('');
}

function spPickL(pfx, qi, v) {
  const obj = pfx === 'q' ? spQLA : spFLA;
  obj[qi] = v;
  [1,2,3,4,5].forEach(x => document.getElementById(`${pfx}l${qi}v${x}`)?.classList.toggle('sel', x === v));
}

// ── Tips ──────────────────────────────────────────────────────────────────────
function spBuildTips(id) {
  const e = document.getElementById(id); if (!e) return;
  e.innerHTML = SP_TIPS.map(t =>
    `<div class="tcard ${t.cl}"><div class="ticon">${t.ic}</div><div class="tcat">${t.ct}</div><h4>${t.h}</h4><p>${t.p}</p></div>`
  ).join('');
}

// ── Score ─────────────────────────────────────────────────────────────────────
function spCalcScore(log) {
  let s = 50;
  if (log.sleep === '7-8') s += 20; else if (log.sleep === '5-6') s += 5; else if (log.sleep === '9+') s += 12;
  if (log.screen === 'none') s += 15; else if (log.screen === '30min') s += 10; else if (log.screen === '1hr') s += 5;
  else if (log.screen === '2hr') s -= 2; else if (log.screen === '3hr') s -= 8; else s -= 15;
  if (log.work === '7-8') s += 5; else if (log.work === '9+') s -= 8; else if (log.work === '0-4') s += 8;
  if (log.q) { const q = parseFloat(log.q); s += Math.round((q - 3) * 8); }
  return Math.max(10, Math.min(99, s));
}

function spRing(arcId, numId, score) {
  const arc = document.getElementById(arcId), num = document.getElementById(numId);
  if (!arc || !num) return;
  arc.style.strokeDashoffset = 289 - (289 * score / 100);
  arc.style.stroke = score >= 75 ? '#6BA368' : score >= 55 ? '#B08D57' : '#C0392B';
  num.innerHTML = score + '<span>score</span>';
}

function spScoreLabel(score) {
  return score >= 80 ? ['Excellent', 'Your sleep habits are outstanding. Keep it up!'] :
         score >= 65 ? ['Good', 'Solid habits. Small tweaks can push you further.'] :
         score >= 50 ? ['Fair', 'Room to improve. Check your recommendations below.'] :
                       ['Needs Work', 'Your habits are impacting sleep quality. Follow the tips.'];
}

// ── Quick Check submit ────────────────────────────────────────────────────────
function submitQ() {
  const w  = document.getElementById('qlw')?.value;
  const s  = document.getElementById('qls')?.value;
  const sc = document.getElementById('qlsc')?.value;
  if (!w || !s || !sc) { spShowToast('Please fill in all habit fields.'); return; }
  const av = Object.values(spQLA);
  if (av.length < 5) { spShowToast('Please answer all 5 sleep quality questions.'); return; }
  const q = (av.reduce((a, b) => a + b, 0) / av.length).toFixed(1);
  const score = spCalcScore({ work: w, sleep: s, screen: sc, q });
  gp('qr');
  setTimeout(() => {
    spRing('qarc', 'qsn', score);
    const [lbl, desc] = spScoreLabel(score);
    const el1 = document.getElementById('qsl2'); if (el1) el1.textContent = lbl;
    const el2 = document.getElementById('qsd');  if (el2) el2.textContent = desc;
    spRenderRecs('qrecs', spQAge, spQLoc, { work: w, sleep: s, screen: sc, q });
  }, 80);
}

// ── Full Tracker log ──────────────────────────────────────────────────────────
function fLog() {
  const w  = document.getElementById('flw')?.value;
  const s  = document.getElementById('fls')?.value;
  const sc = document.getElementById('flsc')?.value;
  if (!w || !s || !sc) { spShowToast('Please fill in all habit fields.'); return; }
  const av = Object.values(spFLA);
  if (av.length < 5) { spShowToast('Please answer all 5 sleep quality questions.'); return; }
  const q = (av.reduce((a, b) => a + b, 0) / av.length).toFixed(1);
  spFLogs.unshift({
    date: new Date().toLocaleDateString('en-BT', { day: 'numeric', month: 'short' }),
    work: w, sleep: s, screen: sc, quality: q
  });
  spRenderFLogs();
  spShowToast('✓ Today\'s habits saved!');
}

function spRenderFLogs() {
  const tb = document.getElementById('fltb'); if (!spFLogs.length || !tb) return;
  const sl = { 'none':'No screen','30min':'<30 min','1hr':'30–60 min','2hr':'1–2 hr','3hr':'2–3 hr','3+hr':'>3 hr' };
  tb.innerHTML = spFLogs.slice(0, 7).map(l => {
    const q  = parseFloat(l.quality);
    const cl = q >= 4 ? 'pg' : q >= 3 ? 'po' : 'pb';
    const ql = q >= 4 ? 'Good' : q >= 3 ? 'Fair' : 'Poor';
    return `<tr><td>${l.date}</td><td>${l.work} hrs</td><td>${l.sleep} hrs</td><td>${sl[l.screen] || l.screen}</td><td><span class="pill ${cl}">${ql} (${l.quality})</span></td></tr>`;
  }).join('');
}

function gotoInsights() { gp('fi'); }
function gotoTrends()   { gp('ft'); setTimeout(drawChart, 80); }

function spFUpdateScore() {
  if (!spFLogs.length) return;
  const l = spFLogs[0];
  const score = spCalcScore({ work: l.work, sleep: l.sleep, screen: l.screen, q: l.quality });
  spRing('farc', 'fsn', score);
  const [lbl, desc] = spScoreLabel(score);
  const el1 = document.getElementById('fsl3'); if (el1) el1.textContent = lbl;
  const el2 = document.getElementById('fsd');  if (el2) el2.textContent = desc;
}

function spFUpdateRecs() {
  spRenderRecs('frecs', spFAge, spFLoc,
    spFLogs[0] ? { work: spFLogs[0].work, sleep: spFLogs[0].sleep, screen: spFLogs[0].screen } : null);
}

// ── Static fallback recommendations (used while AI loads or on error) ──────────
function spStaticRecs(age, loc, log) {
  let items = [];
  if (log) {
    if (['3hr','3+hr'].includes(log.screen))
      items.push({ cl:'crit', badge:'Critical', h:'Reduce screen time before bed', b:'You\'re using screens 2+ hours before bed. This significantly delays melatonin. Try phone face-down 90 minutes before your target bedtime.' });
    else if (log.screen === '2hr')
      items.push({ cl:'warn', badge:'Improve',  h:'Shorten screen time to under 1 hour', b:'1–2 hours of screen time before bed interferes with sleep onset. Enable night mode after 8 PM and set a phone-down reminder.' });
    else if (['none','30min'].includes(log.screen))
      items.push({ cl:'good', badge:'Great',    h:'Excellent screen discipline!', b:'Low screen time before bed is one of the most impactful sleep habits. Keep it up.' });

    if (log.sleep === '0-4')
      items.push({ cl:'crit', badge:'Priority', h:'You need significantly more sleep', b:'Sleeping 4 hours or less severely impacts cognitive function. Prioritize a fixed bedtime tonight.' });
    else if (log.sleep === '5-6')
      items.push({ cl:'warn', badge:'Improve',  h:'Aim for 7–8 hours of sleep', b:'You\'re 1–2 hours below the recommendation. Shift bedtime 30 minutes earlier each week until you reach 7–8 hours naturally.' });
    else if (log.sleep === '7-8')
      items.push({ cl:'good', badge:'Optimal',  h:'Sleep duration is on target', b:'You\'re hitting 7–8 hours. Focus now on quality — dark room, cool temperature, and consistent timing deepens your sleep cycles.' });

    if (log.work === '9+')
      items.push({ cl:'warn', badge:'Balance',  h:'Long work hours are impacting recovery', b:'Working 9+ hours compresses wind-down time. Set a clear end-of-work signal — close your laptop and take a brief walk.' });
  }
  if (loc === 'urban')
    items.push({ cl:'', badge:'Urban Tip', h:'Create a work–wind-down boundary', b:'Urban lifestyles blur work and rest. Designate a time — say 9 PM — after which you don\'t check messages. Use the alarm feature to reinforce this.' });
  else
    items.push({ cl:'good', badge:'Rural Advantage', h:'Your natural light exposure is a sleep superpower', b:'Rural environments offer more natural light and less light pollution, naturally regulating your circadian rhythm. Maintain your early sleep schedule.' });

  if (age === '18-25')
    items.push({ cl:'', badge:'18–25', h:'Social media is the #1 sleep disruptor for your age group', b:'Screen time — especially social media — delays sleep by an average of 47 minutes. Consider app timers for social platforms after 9 PM.' });
  else if (age === '36-50')
    items.push({ cl:'', badge:'36–50', h:'Stress management directly affects sleep quality', b:'Work stress is the leading sleep disruptor for this age group. Try a 5-minute breathing exercise before bed: 4 counts in, 7 hold, 8 out.' });
  else if (age === '50+')
    items.push({ cl:'', badge:'50+', h:'Sleep architecture changes with age', b:'Older adults naturally spend less time in deep sleep. A consistent schedule, limiting naps to 20 minutes, and morning sunlight help preserve quality.' });

  return items;
}

// ── Recommendations (AI-powered with static fallback) ─────────────────────────
function spRenderRecs(id, age, loc, log) {
  const e = document.getElementById(id); if (!e) return;

  // Show loading spinner while AI generates
  e.innerHTML = `
    <div class="sp-ai-loading" id="${id}-ai-loading">
      <div class="sp-ai-spinner"></div>
      <div class="sp-ai-loading-text">✨ Generating your personalised recommendations…</div>
    </div>
    <div class="sp-ai-content" id="${id}-ai-content" style="display:none;"></div>`;

  // Start AI fetch
  spFetchAIRecs(id, age, loc, log);
}

async function spFetchAIRecs(id, age, loc, log) {
  const loadingEl = document.getElementById(`${id}-ai-loading`);
  const contentEl = document.getElementById(`${id}-ai-content`);
  if (!loadingEl || !contentEl) return;

  const ageLabels = { 'u18':'Under 18','18-25':'18–25','26-35':'26–35','36-50':'36–50','50+':'50+' };
  const ageLabel  = ageLabels[age] || age;
  const bm        = SP_BM[loc]?.[age] || SP_BM.urban['18-25'];

  const workLabel   = { '0-4':'0–4 hours','5-6':'5–6 hours','7-8':'7–8 hours','9+':'9+ hours' }[log?.work]   || 'not provided';
  const sleepLabel  = { '0-4':'0–4 hours','5-6':'5–6 hours','7-8':'7–8 hours','9+':'9+ hours' }[log?.sleep]  || 'not provided';
  const screenLabel = { 'none':'no phone before bed','30min':'less than 30 minutes','1hr':'30–60 minutes','2hr':'1–2 hours','3hr':'2–3 hours','3+hr':'more than 3 hours' }[log?.screen] || 'not provided';

  // Likert scores
  const qScores = id.startsWith('q') ? Object.values(spQLA) : Object.values(spFLA);
  const avgQ = qScores.length ? (qScores.reduce((a,b) => a+b, 0) / qScores.length).toFixed(1) : '3.0';
  const likertAnswers = [
    'I go to sleep at the same time every night',
    'I fall asleep easily',
    'I sleep well most nights',
    'I wake up feeling rested',
    'I have enough energy during the day'
  ].map((q, i) => `${q}: ${qScores[i] || '?'}/5`).join('; ');

  const prompt = `You are a warm, encouraging wellness advisor for SomPel Tech — a Bhutanese startup helping people improve their sleep and daily wellbeing through data-driven insights. Research from 358 Bhutanese participants guides your advice.

User profile:
- Name: ${visitorName || 'this person'}
- Age group: ${ageLabel}
- Residence: ${loc === 'urban' ? 'Urban (city/town)' : 'Rural (village)'}
- Work hours today: ${workLabel}
- Sleep hours last night: ${sleepLabel}
- Screen use before bed: ${screenLabel}
- Sleep quality self-report (1=low, 5=high): ${likertAnswers}
- Average sleep quality score: ${avgQ}/5

Age group benchmarks for ${ageLabel} ${loc} Bhutan:
- Typical sleep: ${bm.sleep} hours, screen before bed: ${bm.screen} hours, work: ${bm.work} hours, wellness score: ${bm.score}/100

Write a warm, specific, and actionable wellness recommendation in clean HTML. Use this exact structure:
1. One greeting sentence using their name and acknowledging their specific situation today (1 sentence).
2. <div class="rcard good"><div class="rbadge">What's Working</div><div class="rtitle">[title]</div><div class="rbody">[specific positive about their habits — reference their actual numbers]</div></div>
3. Two or three <div class="rcard [crit/warn/good based on urgency]"> cards, each with <div class="rbadge">[topic]</div><div class="rtitle">[specific action headline]</div><div class="rbody">[2–3 sentences: specific, reference their actual data, culturally aware of Bhutan, practical and doable today]</div></div>
4. One <div class="rcard"> card with class "good" titled "Age Group Insight" giving one specific insight relevant to ${ageLabel} ${loc} Bhutanese people.
5. A single closing motivational sentence.

Urgency classes: use "crit" for serious concerns, "warn" for moderate, "good" for positive/tips. Reference actual numbers (e.g. "${sleepLabel} vs ${bm.sleep}hr benchmark"). Keep total to 200–250 words. Do NOT use markdown. Output only HTML starting with the greeting.`;

  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    const data = await resp.json();
    const text = (data.content || []).map(b => b.text || '').join('');
    if (loadingEl) loadingEl.style.display = 'none';
    if (contentEl) { contentEl.style.display = 'block'; contentEl.innerHTML = text; }
  } catch (err) {
    // Fallback to static recommendations
    if (loadingEl) loadingEl.style.display = 'none';
    if (contentEl) {
      contentEl.style.display = 'block';
      const items = spStaticRecs(age, loc, log);
      if (!items.length) {
        contentEl.innerHTML = '<p style="color:var(--green);font-size:.86rem;">✓ Your habits look healthy! Keep logging to track progress.</p>';
      } else {
        contentEl.innerHTML = items.map(i =>
          `<div class="rcard ${i.cl}"><div class="rbadge">${i.badge}</div><div class="rtitle">${i.h}</div><div class="rbody">${i.b}</div></div>`
        ).join('');
      }
    }
  }
}

// ── AI Personalised Tip of the Week ──────────────────────────────────────────
let spQTipGenerated = false;
let spFTipGenerated = false;

async function spGenerateAITip(mode) {
  const isQ = mode === 'q';
  const loadId = isQ ? 'qt-ai-tip-loading' : 'ft-ai-tip-loading';
  const contId = isQ ? 'qt-ai-tip-content' : 'ft-ai-tip-content';
  const loadEl = document.getElementById(loadId);
  const contEl = document.getElementById(contId);
  if (!loadEl || !contEl) return;

  const age = isQ ? spQAge : spFAge;
  const loc = isQ ? spQLoc : spFLoc;
  const logs = isQ ? null : spFLogs;

  const ageLabels = { 'u18':'Under 18','18-25':'18–25','26-35':'26–35','36-50':'36–50','50+':'50+' };
  const ageLabel = ageLabels[age] || age;

  // Pick a tip topic based on age/loc pattern
  const topics = ['caffeine cut-off timing', 'blue light and melatonin', 'bedroom temperature', 'wind-down routine', 'consistent wake time', 'morning sunlight', 'napping rules', 'eating habits before sleep'];
  const topic = topics[Math.floor(Math.random() * topics.length)];

  const logSummary = logs?.length
    ? `Their recent average sleep: ${({'0-4':2,'5-6':5.5,'7-8':7.5,'9+':9}[logs[0].sleep]||7)} hrs, screen before bed: ${({'none':0,'30min':0.25,'1hr':0.75,'2hr':1.5,'3hr':2.5,'3+hr':4}[logs[0].screen]||1)} hrs.`
    : 'No recent logs available.';

  const prompt = `You are a sleep education specialist for SomPel Tech — a Bhutanese wellness startup. Write one short, research-backed sleep tip for a ${ageLabel}-year-old ${loc === 'urban' ? 'urban' : 'rural'} Bhutanese person on the topic: "${topic}".

Context: ${logSummary}

Format in clean HTML:
- A bold <strong> tip headline (7 words max)
- 2–3 sentences explaining the science simply and a concrete action they can take tonight or this week
- A short "Why it matters for you:" line that connects to their age group or ${loc} lifestyle

Keep total under 80 words. Warm, clear, practical. No markdown. No preamble. Start directly with the tip.`;

  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    const data = await resp.json();
    const text = (data.content || []).map(b => b.text || '').join('');
    loadEl.style.display = 'none';
    contEl.style.display = 'block';
    contEl.innerHTML = text;
  } catch {
    loadEl.style.display = 'none';
    contEl.style.display = 'block';
    contEl.innerHTML = `<strong>Put your phone away 60 minutes before bed.</strong> Blue light from screens suppresses melatonin production by up to 3 hours, directly delaying sleep onset. Start tonight: set a screen-off reminder at 9 PM. <em>Why it matters for you:</em> ${loc === 'urban' ? 'Urban screen use averages 2+ hours before bed — you can break that cycle.' : 'Even in rural areas, increased phone access is shifting sleep times later.'}`;
  }
}
function setAlarm() {
  const bed  = document.getElementById('ab')?.value;
  const wake = document.getElementById('aw')?.value;
  if (!bed || !wake) { spShowToast('Please set both bedtime and wake time.'); return; }
  const fmt = t => { const [h, m] = t.split(':'); const ap = +h >= 12 ? 'PM' : 'AM'; return `${+h % 12 || 12}:${m} ${ap}`; };
  const at = document.getElementById('alarmt'); if (at) at.textContent = `Bed ${fmt(bed)} · Wake ${fmt(wake)} · ${spSelSound}`;
  const as = document.getElementById('alarmst'); if (as) as.style.display = 'block';
  spShowToast(`⏰ Reminder set — Bed ${fmt(bed)} · Wake ${fmt(wake)}`);
}

function pickSound(el, s) {
  document.querySelectorAll('.schip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  spSelSound = s;
}

// ── Chart ─────────────────────────────────────────────────────────────────────
function setChart(el, m) {
  document.querySelectorAll('.cbtn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  spChartMode = m;
  drawChart();
}

function drawChart() {
  const cv = document.getElementById('tc'); if (!cv) return;
  const ctx = cv.getContext('2d');
  const W = cv.offsetWidth || 700, H = 220;
  cv.width = W; cv.height = H; ctx.clearRect(0, 0, W, H);
  const iw = spChartMode === 'w';
  const lbs = iw ? ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] : ['Wk1','Wk2','Wk3','Wk4'];
  let sd, scd, ed;
  if (spFLogs.length >= 2) {
    const rc = iw ? spFLogs.slice(0, 7).reverse() : spFLogs.slice(0, 4).reverse();
    const ts = v => ({'0-4':2,'5-6':5.5,'7-8':7.5,'9+':9}[v] || 6);
    const tc = v => ({'none':0,'30min':0.3,'1hr':0.8,'2hr':1.5,'3hr':2.5,'3+hr':3.5}[v] || 1);
    sd  = rc.map(l => ts(l.sleep));
    scd = rc.map(l => tc(l.screen));
    ed  = rc.map(l => parseFloat(l.quality));
    while (sd.length < lbs.length) { sd.unshift(null); scd.unshift(null); ed.unshift(null); }
    sd  = sd.slice(-lbs.length);
    scd = scd.slice(-lbs.length);
    ed  = ed.slice(-lbs.length);
  } else {
    sd  = iw ? [6,5.5,7.5,6,7,8,7.5] : [6.2,6.8,7.2,7.5];
    scd = iw ? [2.5,3,2,1.5,2,0.5,1] : [2.2,1.8,1.4,1.0];
    ed  = iw ? [2.8,2.5,3.5,3,3.8,4.2,4] : [3.0,3.4,3.8,4.1];
  }
  const p = { t:20, r:20, b:30, l:40 };
  const cw = W - p.l - p.r, ch = H - p.t - p.b, n = lbs.length;
  const xs = lbs.map((_, i) => p.l + (i / (n - 1)) * cw);
  ctx.strokeStyle = 'rgba(0,0,0,0.06)'; ctx.lineWidth = 1;
  for (let y = 0; y <= 4; y++) {
    const yy = p.t + ch * (1 - y / 4);
    ctx.beginPath(); ctx.moveTo(p.l, yy); ctx.lineTo(p.l + cw, yy); ctx.stroke();
    ctx.fillStyle = 'rgba(138,136,132,0.7)'; ctx.font = '11px Outfit,sans-serif'; ctx.textAlign = 'right';
    ctx.fillText(y === 0 ? '0' : (y / 4 * 10).toFixed(0) + 'h', p.l - 6, yy + 4);
  }
  ctx.fillStyle = 'rgba(138,136,132,0.8)'; ctx.font = '11px Outfit,sans-serif'; ctx.textAlign = 'center';
  lbs.forEach((l, i) => ctx.fillText(l, xs[i], H - 8));
  function dl(data, col, mv) {
    if (!data.filter(d => d !== null).length) return;
    ctx.strokeStyle = col; ctx.lineWidth = 2.5; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.shadowColor = col; ctx.shadowBlur = 8; ctx.beginPath(); let first = true;
    data.forEach((v, i) => {
      if (v === null) { first = true; return; }
      const x = xs[i], y = p.t + ch * (1 - v / mv);
      first ? ctx.moveTo(x, y) : ctx.lineTo(x, y); first = false;
    });
    ctx.stroke(); ctx.shadowBlur = 0;
    data.forEach((v, i) => {
      if (v === null) return;
      ctx.beginPath(); ctx.arc(xs[i], p.t + ch * (1 - v / mv), 4, 0, Math.PI * 2);
      ctx.fillStyle = col; ctx.fill();
    });
  }
  dl(sd, '#6BA368', 10); dl(scd, '#B08D57', 5); dl(ed, '#7AABC8', 5);
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function spShowToast(msg) {
  const t = document.getElementById('toast'); if (!t) return;
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ── Init SomPel (called once when platform is first opened) ───────────────────
function spInit() {
  if (spInited) return;
  spInited = true;
  spBuildLikert('qlic', spQLA, 'q');
  spBuildLikert('flic', spFLA, 'f');
  spBuildTips('qt-tips');
  spBuildTips('ft-tips');
  spRenderCG('qcg', spQAge, spQLoc);
  spRenderCG('fcg', spFAge, spFLoc);
}

window.addEventListener('resize', drawChart);


function showBmarkSheet(sheetId, btn) {
  document.querySelectorAll('.bmark-sheet').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.bmark-sheet-tab').forEach(b => b.classList.remove('active'));
  const target = document.getElementById('bmark-sheet-' + sheetId);
  if (target) target.classList.add('active');
  if (btn) btn.classList.add('active');
}

function bmarkUpdateProgress() {
  const pct = ((bmarkStep - 1) / BMARK_TOTAL) * 100;
  const fill = document.getElementById('bmark-progress-fill');
  const label = document.getElementById('bmark-progress-label');
  if (fill)  fill.style.width = pct + '%';
  if (label) label.textContent = `Question ${bmarkStep} of 4`;
}

function bmarkShowStep(n) {
  document.querySelectorAll('.bmark-step').forEach(s => s.classList.remove('active'));
  const target = document.querySelector(`.bmark-step[data-step="${n}"]`);
  if (target) target.classList.add('active');

  const backBtn = document.getElementById('bmark-back');
  const nextBtn = document.getElementById('bmark-next');
  if (backBtn) backBtn.style.display = n > 1 ? 'inline-flex' : 'none';

  // Check if current step has an answer
  const key = target ? target.querySelector('.bmark-options')?.dataset.key : null;
  if (nextBtn) {
    nextBtn.disabled = !(key && bmarkAnswers[key]);
    nextBtn.textContent = n === BMARK_TOTAL ? 'See my results →' : 'Next →';
  }

  bmarkUpdateProgress();
}

function bmarkNext() {
  if (bmarkStep < BMARK_TOTAL) {
    bmarkStep++;
    bmarkShowStep(bmarkStep);
  } else {
    bmarkShowResults();
  }
}

function bmarkBack() {
  if (bmarkStep > 1) {
    bmarkStep--;
    bmarkShowStep(bmarkStep);
  }
}

// Option click handler — delegated
document.addEventListener('click', function(e) {
  const opt = e.target.closest('.bmark-opt');
  if (!opt) return;
  const container = opt.closest('.bmark-options');
  if (!container) return;
  container.querySelectorAll('.bmark-opt').forEach(b => b.classList.remove('selected'));
  opt.classList.add('selected');
  const key = container.dataset.key;
  bmarkAnswers[key] = opt.dataset.value;

  const nextBtn = document.getElementById('bmark-next');
  if (nextBtn) nextBtn.disabled = false;

  // Auto-advance after brief delay for single-select (non-likert)
  if (!container.classList.contains('bmark-options--likert')) {
    setTimeout(() => {
      if (bmarkStep < BMARK_TOTAL) { bmarkStep++; bmarkShowStep(bmarkStep); }
      else { bmarkShowResults(); }
    }, 320);
  }
});

// ── Map answers to numeric values ─────────────────────────────────────────
function workHoursToNum(v) {
  return { '0-4': 2, '5-6': 5.5, '7-8': 7.5, '8+': 9 }[v] || 6;
}
function screenToNum(v) {
  return { 'none': 0, '<30': 0.25, '30-60': 0.75, '1-2h': 1.5, '2h+': 2.5 }[v] || 1;
}
function sleepToNum(v) {
  return { '0-4': 3, '5-6': 5.5, '7-8': 7.5, '8+': 8.5 }[v] || 7;
}

// ── Age-group benchmark data ──────────────────────────────────────────────
const AGE_NORMS = {
  'under18': { workMin:6,  workMax:8,  workMid:7,  screenMin:1, screenMax:2, screenMid:1.5, sleepMin:8,  sleepMax:10, sleepMid:9,   pattern:'Structured routine, high sleep need' },
  '18-25':   { workMin:6,  workMax:10, workMid:8,  screenMin:2, screenMax:4, screenMid:3,   sleepMin:7,  sleepMax:9,  sleepMid:8,   pattern:'High screen use, irregular sleep risk' },
  '26-35':   { workMin:8,  workMax:10, workMid:9,  screenMin:2, screenMax:3, screenMid:2.5, sleepMin:7,  sleepMax:8,  sleepMid:7.5, pattern:'Work-heavy lifestyle, moderate screen exposure' },
  '36-50':   { workMin:8,  workMax:9,  workMid:8.5,screenMin:1, screenMax:3, screenMid:2,   sleepMin:7,  sleepMax:8,  sleepMid:7.5, pattern:'Balanced but stress-dependent sleep quality' },
  '50+':     { workMin:3,  workMax:6,  workMid:4.5,screenMin:0.5,screenMax:2,screenMid:1.25,sleepMin:7,  sleepMax:8,  sleepMid:7.5, pattern:'Lower workload, earlier sleep timing' },
};

const AGE_LABELS = {
  'under18':'Under 18', '18-25':'18 – 25', '26-35':'26 – 35', '36-50':'36 – 50', '50+':'50+'
};

// ── Map answer values to numbers ──────────────────────────────────────────
function bmarkWorkToNum(v) {
  return { '0-4':2, '5-6':5.5, '7-8':7.5, '8+':9 }[v] || 6;
}
function bmarkScreenToNum(v) {
  return { 'none':0, '<30':0.25, '30-60':0.75, '1-2h':1.5, '2h+':2.5 }[v] || 1;
}
function bmarkSleepToNum(v) {
  return { '0-4':3, '5-6':5.5, '7-8':7.5, '8+':8.5 }[v] || 7;
}

// ── Generate results ───────────────────────────────────────────────────────
function bmarkShowResults() {
  document.getElementById('bmark-survey').style.display = 'none';
  document.getElementById('bmark-nav').style.display = 'none';
  document.querySelector('.bmark-progress-wrap').style.display = 'none';
  document.getElementById('bmark-results').style.display = 'block';

  const a = bmarkAnswers;
  const age = a.ageGroup || '26-35';
  const norm = AGE_NORMS[age];
  const ageLabel = AGE_LABELS[age] || age;

  const myWork   = bmarkWorkToNum(a.workHours);
  const myScreen = bmarkScreenToNum(a.screenTime);
  const mySleep  = bmarkSleepToNum(a.sleepHours);

  // Sub-header
  const sub = document.getElementById('bmark-results-sub');
  if (sub && visitorName) sub.textContent = `Here's how ${visitorName}'s habits compare against the ${ageLabel} age group.`;

  // Age group banner
  const banner = document.getElementById('bmark-age-banner');
  if (banner) {
    banner.innerHTML = `
      <div class="bab-icon">👤</div>
      <div class="bab-body">
        <div class="bab-label">Comparing you against the <strong>${ageLabel}</strong> age group</div>
        <div class="bab-pattern">${norm.pattern}</div>
      </div>
    `;
  }

  // ── Build 3 behaviour charts ──
  const behaviours = [
    {
      key: 'work',
      icon: '⏰',
      title: 'Work / Study Hours',
      unit: 'hrs/day',
      myVal: myWork,
      myLabel: { '0-4':'0–4 hrs', '5-6':'5–6 hrs', '7-8':'7–8 hrs', '8+':'8+ hrs' }[a.workHours] || a.workHours,
      normMin: norm.workMin,
      normMax: norm.workMax,
      normMid: norm.workMid,
      normLabel: `${norm.workMin}–${norm.workMax} hrs`,
      // For this metric: being above norm max = potential burnout risk
      getStatus(my, min, max) {
        if (my > max + 0.5) return { tag: '⚠️ Above typical range', cls: 'bch-tag--high', tip: `People aged ${ageLabel} typically work ${min}–${max} hrs. You're doing more — watch for burnout.` };
        if (my < min - 0.5) return { tag: '✅ Below typical range', cls: 'bch-tag--low', tip: `You work fewer hours than typical for ${ageLabel}. Great for balance — just make sure productivity stays high.` };
        return { tag: '✅ Within typical range', cls: 'bch-tag--ok', tip: `Your work hours are typical for the ${ageLabel} age group. Aim for regular breaks and a firm stop time.` };
      }
    },
    {
      key: 'screen',
      icon: '📱',
      title: 'Screen Use Before Sleep',
      unit: 'hrs',
      myVal: myScreen,
      myLabel: { 'none':'No phone', '<30':'<30 min', '30-60':'30–60 min', '1-2h':'1–2 hrs', '2h+':'2+ hrs' }[a.screenTime],
      normMin: norm.screenMin,
      normMax: norm.screenMax,
      normMid: norm.screenMid,
      normLabel: `${norm.screenMin}–${norm.screenMax} hrs`,
      // For screen: lower is always better
      getStatus(my, min, max) {
        if (my > max)       return { tag: '⚠️ Above typical range', cls: 'bch-tag--high', tip: `Even for ${ageLabel} — where screen use is common — you're using your phone more than average before bed. This directly delays sleep onset.` };
        if (my <= 0.25)     return { tag: '🌟 Excellent', cls: 'bch-tag--great', tip: `You barely use your phone before bed — this is the single best thing you can do for sleep quality. Keep it up!` };
        return { tag: '✅ Within typical range', cls: 'bch-tag--ok', tip: `Your pre-sleep screen use is in the typical range for ${ageLabel}. Even reducing by 30 minutes would noticeably improve sleep.` };
      }
    },
    {
      key: 'sleep',
      icon: '🌙',
      title: 'Sleep Duration',
      unit: 'hrs/night',
      myVal: mySleep,
      myLabel: { '0-4':'0–4 hrs', '5-6':'5–6 hrs', '7-8':'7–8 hrs', '8+':'8+ hrs' }[a.sleepHours] || a.sleepHours,
      normMin: norm.sleepMin,
      normMax: norm.sleepMax,
      normMid: norm.sleepMid,
      normLabel: `${norm.sleepMin}–${norm.sleepMax} hrs`,
      getStatus(my, min, max) {
        if (my < min - 0.5) return { tag: '⚠️ Below typical range', cls: 'bch-tag--high', tip: `You're sleeping less than the typical ${min}–${max} hrs for ${ageLabel}. Even 30 extra minutes can improve energy and mood.` };
        if (my > max + 0.5) return { tag: 'ℹ️ Above typical range', cls: 'bch-tag--info', tip: `You sleep more than average for ${ageLabel}. Quality matters too — if you still feel tired, screen time and stress are worth examining.` };
        return { tag: '✅ Within typical range', cls: 'bch-tag--ok', tip: `Your sleep duration matches what's typical for ${ageLabel}. Protect this by keeping a consistent bedtime.` };
      }
    },
  ];

  const chartsGrid = document.getElementById('bmark-charts-grid');
  chartsGrid.innerHTML = behaviours.map(b => {
    const status = b.getStatus(b.myVal, b.normMin, b.normMax);
    // Chart scale: 0 to max of (normMax * 1.5, myVal * 1.3), at least 12
    const scale = Math.max(b.normMax * 1.5, b.myVal * 1.3, 12);
    const myPct  = Math.min((b.myVal / scale) * 100, 100).toFixed(1);
    const minPct = Math.min((b.normMin / scale) * 100, 100).toFixed(1);
    const maxPct = Math.min((b.normMax / scale) * 100, 100).toFixed(1);
    const midPct = Math.min((b.normMid / scale) * 100, 100).toFixed(1);

    return `
    <div class="bch-card">
      <div class="bch-card-top">
        <span class="bch-icon">${b.icon}</span>
        <div>
          <div class="bch-title">${b.title}</div>
          <span class="bch-tag ${status.cls}">${status.tag}</span>
        </div>
      </div>

      <!-- Chart -->
      <div class="bch-chart">
        <!-- Norm range band -->
        <div class="bch-norm-band" style="left:${minPct}%;width:${maxPct - minPct}%;" title="Typical range for ${AGE_LABELS[age]}"></div>

        <!-- You bar -->
        <div class="bch-row">
          <span class="bch-row-label bch-row-label--you">You</span>
          <div class="bch-bar-track">
            <div class="bch-bar-fill bch-bar-fill--you" data-target="${myPct}" style="width:0%"></div>
          </div>
          <span class="bch-row-val">${b.myLabel}</span>
        </div>

        <!-- Norm midpoint bar -->
        <div class="bch-row">
          <span class="bch-row-label bch-row-label--norm">Typical (${ageLabel})</span>
          <div class="bch-bar-track">
            <div class="bch-bar-fill bch-bar-fill--norm" data-target="${midPct}" style="width:0%"></div>
            <!-- Range markers -->
            <div class="bch-range-min" style="left:${minPct}%" title="Min: ${b.normMin} ${b.unit}"></div>
            <div class="bch-range-max" style="left:${maxPct}%" title="Max: ${b.normMax} ${b.unit}"></div>
          </div>
          <span class="bch-row-val">${b.normLabel}</span>
        </div>
      </div>

      <p class="bch-tip">${status.tip}</p>
    </div>`;
  }).join('');

  // Animate bars
  setTimeout(() => {
    document.querySelectorAll('.bch-bar-fill').forEach(b => {
      const t = b.dataset.target;
      if (t) { b.style.width = '0'; requestAnimationFrame(() => requestAnimationFrame(() => { b.style.width = t + '%'; })); }
    });
  }, 300);

  // Scroll to results
  document.getElementById('bmark-results').scrollIntoView({ behavior: 'smooth', block: 'start' });

  // AI recommendations
  bmarkFetchAI(a, { age, ageLabel, norm, myWork, myScreen, mySleep });
}

async function bmarkFetchAI(a, m) {
  const loading = document.getElementById('bmark-ai-loading');
  const content = document.getElementById('bmark-ai-content');
  loading.style.display = 'flex';
  content.style.display = 'none';

  const workLabel   = { '0-4':'0–4 hours', '5-6':'5–6 hours', '7-8':'7–8 hours', '8+':'more than 8 hours' }[a.workHours] || a.workHours;
  const screenLabel = { 'none':'no phone before bed', '<30':'under 30 minutes', '30-60':'30–60 minutes', '1-2h':'1–2 hours', '2h+':'more than 2 hours' }[a.screenTime] || a.screenTime;
  const sleepLabel  = { '0-4':'0–4 hours', '5-6':'5–6 hours', '7-8':'7–8 hours', '8+':'more than 8 hours' }[a.sleepHours] || a.sleepHours;

  const prompt = `You are a warm, knowledgeable wellness advisor for SomPel Tech — a Bhutanese startup helping people improve sleep and daily wellbeing.

User profile:
- Name: ${visitorName || 'this person'}
- Age group: ${m.ageLabel}
- Work/study hours per day: ${workLabel} (typical for age group: ${m.norm.workMin}–${m.norm.workMax} hrs)
- Screen use before sleep: ${screenLabel} (typical for age group: ${m.norm.screenMin}–${m.norm.screenMax} hrs)
- Sleep hours per night: ${sleepLabel} (typical for age group: ${m.norm.sleepMin}–${m.norm.sleepMax} hrs)
- Age group lifestyle pattern: ${m.norm.pattern}

Write a personalised, warm, and actionable wellness recommendation. Structure it as clean HTML with:
1. A one-sentence greeting using their name and acknowledging their age group context
2. <h4>💼 Work & Study</h4> — one specific recommendation about their work hours vs the norm for their age
3. <h4>📱 Screen Use</h4> — one specific recommendation about their screen time before sleep
4. <h4>🌙 Sleep</h4> — one specific recommendation about their sleep hours vs the age-group typical range
5. A short motivational closing sentence (1 line, no header)

Be specific — reference their actual numbers. Keep total length to 200–250 words. Use <ul><li> for sub-points if needed. Do NOT use markdown. Start directly with the greeting.`;

  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    const data = await resp.json();
    const text = (data.content || []).map(b => b.text || '').join('');
    loading.style.display = 'none';
    content.style.display = 'block';
    content.innerHTML = text;
  } catch (err) {
    loading.style.display = 'none';
    content.style.display = 'block';
    // Fallback
    const recos = [];
    if (m.myWork > m.norm.workMax + 0.5)     recos.push(`<li><strong>Work hours:</strong> You're working more than the typical ${m.norm.workMin}–${m.norm.workMax} hrs for your age group. Try scheduling a firm stop time each day and taking short breaks.</li>`);
    if (m.myScreen > m.norm.screenMax)        recos.push(`<li><strong>Screen time:</strong> Your pre-sleep screen use exceeds what's typical for ${m.ageLabel}. Put your phone away 30 minutes before bed — even small changes here can dramatically improve sleep onset.</li>`);
    if (m.mySleep < m.norm.sleepMin - 0.5)   recos.push(`<li><strong>Sleep:</strong> You're sleeping less than the ${m.norm.sleepMin}–${m.norm.sleepMax} hrs typical for ${m.ageLabel}. Going to bed just 30 minutes earlier is a simple, high-impact change.</li>`);
    if (recos.length === 0)                   recos.push(`<li><strong>Keep it up!</strong> Your habits are well-aligned with what's healthy for the ${m.ageLabel} age group. Protect your sleep routine by keeping consistent sleep and wake times.</li>`);
    content.innerHTML = `<h4>Your Personalised Recommendations</h4><ul>${recos.join('')}</ul><p>Small changes add up — SomPel Tech</p>`;
  }
}

function formatHours(v) {
  return { '0-4': '0–4 hrs', '5-6': '5–6 hrs', '7-8': '7–8 hrs', '8+': '8+ hrs' }[v] || v;
}
function formatScreen(v) {
  return { 'none': 'No phone', '<30': '<30 mins', '30-60': '30–60 mins', '1-2h': '1–2 hrs', '2h+': '2+ hrs' }[v] || v;
}
function formatSleep(v) {
  return { '0-4': '0–4 hrs', '5-6': '5–6 hrs', '7-8': '7–8 hrs', '8+': '8+ hrs' }[v] || v;
}

function bmarkReset() {
  bmarkAnswers = {};
  bmarkStep = 1;
  // Reset UI
  document.querySelectorAll('.bmark-opt').forEach(b => b.classList.remove('selected'));
  document.getElementById('bmark-results').style.display = 'none';
  document.getElementById('bmark-survey').style.display = 'block';
  document.getElementById('bmark-nav').style.display = 'flex';
  document.querySelector('.bmark-progress-wrap').style.display = 'flex';
  // Reset AI box
  const aiLoad = document.getElementById('bmark-ai-loading');
  const aiCont = document.getElementById('bmark-ai-content');
  if (aiLoad) { aiLoad.style.display = 'flex'; }
  if (aiCont) { aiCont.style.display = 'none'; aiCont.innerHTML = ''; }
  bmarkShowStep(1);
  document.getElementById('benchmark-tool').scrollIntoView({ behavior: 'smooth', block: 'start' });
}