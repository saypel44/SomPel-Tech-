/* ════════════════════════════════
   AUTH — localStorage user store
════════════════════════════════ */
const USERS_KEY = 'qt_users_v1';

function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || {}; }
  catch (e) { return {}; }
}

function saveUsers(u) {
  localStorage.setItem(USERS_KEY, JSON.stringify(u));
}

let currentUser = null;

/* ── Tab switching ── */
function switchTab(t) {
  document.getElementById('tab-login').style.display  = t === 'login'  ? '' : 'none';
  document.getElementById('tab-signup').style.display = t === 'signup' ? '' : 'none';
  document.querySelectorAll('.auth-tab').forEach((el, i) => {
    el.classList.toggle('active', (i === 0 && t === 'login') || (i === 1 && t === 'signup'));
  });
  clearMsgs();
}

function clearMsgs() {
  ['li-msg', 'su-msg'].forEach(id => {
    const el = document.getElementById(id);
    el.className = 'auth-msg';
    el.textContent = '';
  });
}

function showMsg(id, text, type) {
  const el = document.getElementById(id);
  el.textContent = text;
  el.className = 'auth-msg ' + type;
}

/* ── Password toggle ── */
function togglePw(id, btn) {
  const inp = document.getElementById(id);
  inp.type = inp.type === 'password' ? 'text' : 'password';
  btn.textContent = inp.type === 'password' ? '👁' : '🙈';
}

/* ── Sign up ── */
function doSignup() {
  const name = document.getElementById('su-name').value.trim();
  const user = document.getElementById('su-user').value.trim().toLowerCase();
  const pass = document.getElementById('su-pass').value;

  if (!name || !user || !pass)  return showMsg('su-msg', 'Please fill in all fields.', 'err');
  if (user.length < 3)          return showMsg('su-msg', 'Username must be at least 3 characters.', 'err');
  if (pass.length < 6)          return showMsg('su-msg', 'Password must be at least 6 characters.', 'err');

  const users = getUsers();
  if (users[user])              return showMsg('su-msg', 'That username is already taken.', 'err');

  users[user] = { name, pass, created: new Date().toISOString() };
  saveUsers(users);
  showMsg('su-msg', 'Account created! Signing you in…', 'ok');
  setTimeout(() => launchApp({ username: user, name }), 900);
}

/* ── Sign in ── */
function doLogin() {
  const user = document.getElementById('li-user').value.trim().toLowerCase();
  const pass = document.getElementById('li-pass').value;

  if (!user || !pass) return showMsg('li-msg', 'Please enter your username and password.', 'err');

  const users = getUsers();
  if (!users[user] || users[user].pass !== pass) {
    return showMsg('li-msg', 'Incorrect username or password.', 'err');
  }
  launchApp({ username: user, name: users[user].name });
}

/* ── Launch app ── */
function launchApp(user) {
  currentUser = user;
  const firstName = user.name.split(' ')[0];
  document.getElementById('greeting-name').textContent = firstName;
  document.getElementById('hdr-avatar').textContent    = user.name.charAt(0).toUpperCase();
  document.getElementById('hdr-name').textContent      = user.name;

  document.getElementById('auth-screen').classList.remove('active');
  document.getElementById('app-screen').classList.add('active');
  window.scrollTo(0, 0);
}

/* ── Sign out ── */
function doLogout() {
  currentUser = null;
  restartForm();
  document.getElementById('app-screen').classList.remove('active');
  document.getElementById('auth-screen').classList.add('active');
  clearMsgs();
  document.getElementById('li-user').value = '';
  document.getElementById('li-pass').value = '';
  switchTab('login');
  window.scrollTo(0, 0);
}

/* ── Enter-key shortcuts ── */
document.getElementById('li-user').addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('li-pass').focus(); });
document.getElementById('li-pass').addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });
document.getElementById('su-pass').addEventListener('keydown', e => { if (e.key === 'Enter') doSignup(); });


/* ════════════════════════════════
   TRACKER
════════════════════════════════ */
const likertQs = [
  { id: 'l1', text: 'I can fall asleep easily.' },
  { id: 'l2', text: 'I sleep well most nights.' },
  { id: 'l3', text: 'I wake up feeling rested.' },
  { id: 'l4', text: 'I feel sleepy during the day.' },
  { id: 'l5', text: 'I have good energy during the day.' }
];
const likertOpts = ['Yes, always', 'Most of the time', 'Sometimes', 'Not really', 'No, never'];
const answers  = {};
const lAnswers = {};

/* Build likert rows */
const lc = document.getElementById('lik-container');
likertQs.forEach((q, i) => {
  const row = document.createElement('div');
  row.className = 'lik-item';
  row.innerHTML = `
    <span class="lik-label">Q${i + 8}. ${q.text}</span>
    <div class="lik-btns">
      ${likertOpts.map(o => `<button type="button" class="lbtn" data-lq="${q.id}" data-v="${o}">${o}</button>`).join('')}
    </div>`;
  lc.appendChild(row);
});

/* Option click handlers */
document.querySelectorAll('.opts').forEach(grp => {
  grp.querySelectorAll('.opt').forEach(btn => {
    btn.addEventListener('click', () => {
      grp.querySelectorAll('.opt').forEach(b => b.classList.remove('sel'));
      btn.classList.add('sel');
      answers[grp.dataset.q] = btn.dataset.v;
      updateProg();
    });
  });
});

document.querySelectorAll('.lbtn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll(`.lbtn[data-lq="${btn.dataset.lq}"]`).forEach(b => b.classList.remove('sel'));
    btn.classList.add('sel');
    lAnswers[btn.dataset.lq] = btn.dataset.v;
    updateProg();
  });
});

function updateProg() {
  const total = 12;
  const done  = Object.keys(answers).length + Object.keys(lAnswers).length;
  const pct   = Math.round((done / total) * 100);
  document.getElementById('prog-bar').style.width = pct + '%';
  document.getElementById('prog-txt').textContent = `${done} of ${total}`;
  document.getElementById('submit-btn').disabled  = (done < total);
}

/* ── Scoring helpers ── */
function lScore(v) {
  return { 'Yes, always': 5, 'Most of the time': 4, 'Sometimes': 3, 'Not really': 2, 'No, never': 1 }[v] || 3;
}

function sleepScore() {
  const s = {};
  likertQs.forEach(q => { s[q.id] = lScore(lAnswers[q.id]); });
  return Math.round((((s.l1 + s.l2 + s.l3 + s.l5) / 4) + (6 - s.l4)) / 2 * 10);
}

function phoneRisk() {
  return {
    'no phone before bed': 0, 'less than 30 minutes': 1,
    '30 min–1 hour': 2, '1–2 hours': 3, '2–3 hours': 4, 'more than 3 hours': 5
  }[answers.phonetime] || 0;
}

function isLateNight() {
  return answers.bedtime === 'after 12 AM' || answers.bedtime === '11 PM–12 AM';
}

/* ── Show results ── */
function showResults() {
  document.getElementById('tracker-form').style.display = 'none';
  const rd = document.getElementById('results');
  rd.style.display = 'block';
  window.scrollTo(0, 0);

  const sc   = sleepScore();
  const pr   = phoneRisk();
  const late = isLateNight();

  const overwork      = answers.workhours === '9 or more hours';
  const sedentary     = answers.worktype  === 'Sitting';
  const feelRested    = lAnswers.l3 === 'Yes, always'    || lAnswers.l3 === 'Most of the time';
  const poorRested    = lAnswers.l3 === 'Not really'     || lAnswers.l3 === 'No, never';
  const feelEnergetic = lAnswers.l5 === 'Yes, always'    || lAnswers.l5 === 'Most of the time';
  const lowEnergy     = lAnswers.l5 === 'Not really'     || lAnswers.l5 === 'No, never';
  const daySleepy     = lAnswers.l4 === 'Yes, always'    || lAnswers.l4 === 'Most of the time';
  const hardToSleep   = lAnswers.l1 === 'Not really'     || lAnswers.l1 === 'No, never';
  const shortSleep    = answers.sleep === '0–4 hours'    || answers.sleep === '5–6 hours';
  const goodHours     = answers.sleep === '7–8 hours'    || answers.sleep === '9 or more hours';
  const outcomeGood   = feelRested && feelEnergetic && !daySleepy;
  const outcomePoor   = poorRested || lowEnergy || daySleepy;

  let intro = '', emoji = '✨';
  if (outcomeGood) {
    intro = "Your body is doing well — you feel rested and have good energy. Keep up what you're doing!"; emoji = '🌟';
  } else if (outcomePoor && goodHours) {
    intro = `You sleep ${answers.sleep} but still don't feel your best. Duration isn't everything — a consistent bedtime and less phone time before bed can help a lot.`; emoji = '⚠️';
  } else if (outcomePoor && shortSleep) {
    intro = `You sleep ${answers.sleep} and your energy shows it. Small changes to your bedtime routine can make a big difference very quickly.`; emoji = '💤';
  } else {
    intro = 'Some things are going well and some could improve. The tips below are based on how you actually feel.'; emoji = '🔍';
  }

  const recs = [];
  if (outcomeGood && late) recs.push({ l: '', t: '✅ You feel good — your routine is working', b: [`<strong>What's happening:</strong> You go to bed ${answers.bedtime} and your body has adapted — you feel rested and energised.`, `<strong>Why it works:</strong> A consistent bedtime, even a late one, beats an irregular schedule.`, `<strong>Keep doing:</strong> Same bedtime every day including weekends.`] });
  else if (outcomeGood)   recs.push({ l: '', t: '✅ Your habits are working — keep it up', b: [`<strong>What's happening:</strong> You wake up rested and have good energy — the best sign of healthy sleep.`, `<strong>Keep doing:</strong> Consistent bedtime every night, even weekends. Check in again in a few weeks.`] });
  if (outcomePoor && goodHours)  recs.push({ l: 'warn', t: '⚠️ Enough hours but still tired', b: [`<strong>What's happening:</strong> You sleep ${answers.sleep} but still wake up drained. More hours alone isn't always the fix.`, `<strong>Why:</strong> Phone use, irregular timing, or stress reduce sleep quality even with enough hours.`, `<strong>Try:</strong> Phone away 30–60 min before bed. Same wake time every day. Darker, quieter room.`] });
  if (outcomePoor && shortSleep) recs.push({ l: 'bad',  t: '🔴 Not enough sleep — your body feels it', b: [`<strong>What's happening:</strong> You sleep ${answers.sleep} and feel tired and low on energy — directly linked.`, `<strong>Why:</strong> Your body needs 7–8 hours to rest and repair.`, `<strong>Try:</strong> Go to bed 15–20 min earlier this week. No caffeine after 2 pm. No phone in bed.`] });
  if (hardToSleep)  recs.push({ l: 'warn', t: '⚠️ Hard to fall asleep', b: [`<strong>What's happening:</strong> Your mind stays active when you try to sleep.`, `<strong>Try:</strong> 30 minutes of calm before bed — no phone, dim lights, light reading. Same wake time every morning.`] });
  if (daySleepy)    recs.push({ l: (daySleepy && poorRested) ? 'bad' : 'warn', t: (daySleepy && poorRested) ? '🔴 Very tired during the day' : '⚠️ Sleepy during the day', b: [`<strong>What's happening:</strong> You feel sleepy through the day — your night sleep isn't fully refreshing you.`, `<strong>Try:</strong> Same wake time every day. A 10–20 min nap before 3 pm can help. No phone for the last 30 min before bed.`] });
  if (pr >= 2 && outcomePoor)   recs.push({ l: 'warn', t: '⚠️ Phone use before bed is hurting your sleep', b: [`<strong>What's happening:</strong> You use your phone ${answers.phonetime} before sleeping — these are connected.`, `<strong>Why:</strong> Screens signal your brain it's still daytime, reducing deep sleep.`, `<strong>Try:</strong> Phone away 30 min before bed. Replace with reading or gentle stretching.`] });
  if (overwork && outcomePoor)  recs.push({ l: 'bad',  t: '🔴 Too many work hours is draining you', b: [`<strong>What's happening:</strong> You work ${answers.workhours} a day and feel drained.`, `<strong>Try:</strong> A short walk after work to decompress. Stop all work at least 1 hour before bed.`] });
  if (sedentary && lowEnergy)   recs.push({ l: '',     t: '🪑 Sitting all day could be making you sluggish', b: [`<strong>Why:</strong> Long sitting slows circulation, making you feel heavy and unfocused.`, `<strong>Try:</strong> 2-minute movement break every hour. A short walk after lunch.`] });
  if (late && outcomePoor)      recs.push({ l: 'bad',  t: '🔴 Very late bedtime is reducing sleep quality', b: [`<strong>Why:</strong> Your deepest sleep happens earlier in the night. Going late shifts this window.`, `<strong>Try:</strong> Move your bedtime 15 min earlier each week. Aim for 11 pm as a first goal.`] });
  if (recs.length === 0) recs.push({ l: '', t: '✅ Everything looks good', b: [`<strong>What's happening:</strong> Your habits and how you feel are both in good shape.`, `<strong>Keep doing:</strong> Same bedtime every day. Check in again in a few weeks.`] });

  rd.innerHTML = `
    <div class="res-hero">
      <div class="res-emoji">${emoji}</div>
      <h3>Here is what we found…</h3>
      <p>${intro}</p>
    </div>
    <div class="stat-grid">
      <div class="stat"><div class="stat-val">${answers.workhours.replace(' hours','')}</div><div class="stat-sub">Work / day</div></div>
      <div class="stat"><div class="stat-val">${answers.sleep.replace(' hours','')}</div><div class="stat-sub">Sleep / night</div></div>
      <div class="stat"><div class="stat-val">${sc}<span style="font-size:12px;font-weight:400">/50</span></div><div class="stat-sub">Sleep score</div></div>
      <div class="stat"><div class="stat-val" style="font-size:13px">${answers.bedtime}</div><div class="stat-sub">Bedtime</div></div>
    </div>
    <p class="sec-lbl">Tips just for you</p>
    ${recs.map(r => `<div class="rec ${r.l}"><h4>${r.t}</h4><ul>${r.b.map(b => `<li>${b}</li>`).join('')}</ul></div>`).join('')}
    <button type="button" id="restart-btn" onclick="restartForm()">↩ Take the quiz again</button>
  `;
}

/* ── Restart ── */
function restartForm() {
  document.getElementById('results').innerHTML = '';
  document.getElementById('results').style.display = 'none';
  document.getElementById('tracker-form').style.display = 'block';
  document.querySelectorAll('.opt, .lbtn').forEach(b => b.classList.remove('sel'));
  Object.keys(answers).forEach(k  => delete answers[k]);
  Object.keys(lAnswers).forEach(k => delete lAnswers[k]);
  document.getElementById('prog-bar').style.width     = '0%';
  document.getElementById('prog-txt').textContent     = '0 of 12';
  document.getElementById('submit-btn').disabled      = true;
  window.scrollTo(0, 0);
}