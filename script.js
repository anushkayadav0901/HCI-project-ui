// Centpercent — Interactive Student Finance Prototype
// Pure Vanilla JS + LocalStorage persistence

const STORAGE_KEYS = {
  TXNS: 'cp_v2_txns',
  BUDGET: 'cp_v2_budget',
  GOALS: 'cp_v2_goals',
  USER: 'cp_v2_user',
  PREFS: 'cp_v2_prefs',
  SPLITS: 'cp_v2_splits',
  BILLS: 'cp_v2_bills',
  ROOM_FUND: 'cp_v2_room_fund',
  NOTIFS: 'cp_v2_notifs',
  LESSONS: 'cp_v2_lessons'
};

const DEFAULT_TXNS = [
  { id: 1, title: 'Zomato · Late Night Roll', category: 'Food & Mess', amount: 140, type: 'expense', date: 'Today', method: 'UPI', note: 'Hostel dinner' },
  { id: 2, title: 'Campus Canteen · Chai & Samosa', category: 'Food & Mess', amount: 60, type: 'expense', date: 'Today', method: 'Cash', note: 'Break with friends' },
  { id: 3, title: 'Priya Sharma · Split Settlement', category: 'Transfer', amount: 500, type: 'income', date: 'Yesterday', method: 'UPI', note: 'Grocery share' },
  { id: 4, title: 'Metro Card Recharge', category: 'Travel', amount: 200, type: 'expense', date: 'Yesterday', method: 'UPI', note: 'College commute' },
  { id: 5, title: 'Textbooks & Lab Printout', category: 'Books & Printing', amount: 850, type: 'expense', date: '10 Nov', method: 'Card', note: 'HCI notes' },
  { id: 6, title: 'Swiggy · Biryani', category: 'Food & Mess', amount: 180, type: 'expense', date: '8 Nov', method: 'UPI', note: '' },
  { id: 7, title: 'Myntra · Winter Hoodie', category: 'Shopping', amount: 1200, type: 'expense', date: '7 Nov', method: 'Card', note: '' },
  { id: 8, title: 'Spotify Student Plan', category: 'Subscriptions', amount: 59, type: 'expense', date: '5 Nov', method: 'Card', note: 'Monthly' },
  { id: 9, title: 'PG Rent · Flat 402', category: 'PG Rent', amount: 5500, type: 'expense', date: '1 Nov', method: 'UPI', note: 'Monthly rent' },
  { id: 10, title: 'Monthly Allowance', category: 'Income', amount: 15000, type: 'income', date: '1 Nov', method: 'NEFT', note: 'Parents transfer' }
];

const DEFAULT_GOALS = [
  { id: 1, name: 'Goa Semester Trip', saved: 14000, target: 20000, deadline: '15 Jan 2027', history: ['+₹1,000 on 5 Nov', '+₹500 on 1 Nov'] },
  { id: 2, name: 'Emergency Fund', saved: 8000, target: 10000, deadline: '30 Jun 2027', history: ['+₹2,000 on 2 Nov'] },
  { id: 3, name: 'Laptop Fund', saved: 5500, target: 35000, deadline: '1 May 2027', history: ['+₹1,500 on 28 Oct'] }
];

const DEFAULT_USER = {
  name: 'Aditi',
  fullName: 'Aditi Sharma',
  campus: 'NSUT · Delhi',
  upi: 'aditi.sharma@centpercent'
};

const DEFAULT_PREFS = {
  hideBalance: false,
  highContrast: false,
  colorBlind: false,
  textSize: 'md',
  safetyMode: false,
  weekendChallenge: false
};

const DEFAULT_BILLS = [
  { id: 'rent', name: 'PG / Hostel Rent', amount: 5500, due: 'Due 15 Nov', paid: false },
  { id: 'elec', name: 'Electricity Bill', amount: 340, due: 'Due 20 Nov', paid: false },
  { id: 'wifi', name: 'Airtel Wi-Fi (Flat 402)', amount: 200, due: 'Paid', paid: true },
  { id: 'mess', name: 'Mess Charges', amount: 3200, due: 'Due 25 Nov', paid: false }
];

const DEFAULT_SPLITS = [
  { id: 101, title: 'Flat 402 — Grocery & Wi-Fi', total: 2400, payer: 'Aditi (You)', perPerson: 600, participants: ['Aditi (You)', 'Priya Sharma', 'Rohit Kumar', 'Aryan Mehta'], settled: ['Aditi (You)'] }
];

const DEFAULT_NOTIFS = [
  { id: 1, title: 'PG Rent due in 5 days', desc: 'Your share is ₹5,500 for Flat 402.', time: '2h ago', read: false, screen: 'living' },
  { id: 2, title: 'Expense saved: Zomato ₹140', desc: 'Categorized under Food & Mess.', time: '3h ago', read: false, screen: 'activity' },
  { id: 3, title: 'Goa Trip 70% complete', desc: '₹6,000 more to reach your ₹20,000 target.', time: 'Today', read: false, screen: 'goals' },
  { id: 4, title: '7-day Savings Streak', desc: 'You stayed within your daily Safe-to-Spend!', time: 'Yesterday', read: true, screen: 'goals' },
  { id: 5, title: 'Payment received from Priya', desc: '+₹500 added via UPI.', time: 'Yesterday', read: true, screen: 'activity' }
];

const LESSONS = [
  {
    title: 'The 50 / 30 / 20 Rule',
    meta: '5 min read · Beginner',
    progress: 60,
    content: 'Split your monthly allowance into 3 buckets: 50% for Needs (PG rent, mess, metro), 30% for Wants (cafes, outings, movies), and 20% for Savings (Emergency fund, Goa trip). Even saving ₹500/month builds strong habits.'
  },
  {
    title: 'Budgeting 101 for Hostel Life',
    meta: '4 min read · Beginner',
    progress: 100,
    content: 'Track fixed bills first on the 1st of the month. Divide what remains by 30 days to find your daily Safe-to-Spend. That single number prevents running broke in week 3.'
  },
  {
    title: 'Student Credit Basics',
    meta: '6 min read · Beginner',
    progress: 0,
    content: 'Avoid BNPL (Buy Now Pay Later) traps for impulse shopping. If you use a student credit card, keep utilization under 30% and always pay the full statement balance on time.'
  },
  {
    title: 'Taxes, Stipends & Freelancing TDS',
    meta: '5 min read · Intermediate',
    progress: 0,
    content: 'Internship stipends or freelance gigs over ₹30,000 may have 10% TDS deducted under Section 194J. If your annual income is below the basic exemption limit, you can file an ITR to claim a full TDS refund.'
  },
  {
    title: 'Saving Habits & Micro-Goals',
    meta: '3 min read · Beginner',
    progress: 30,
    content: 'Automating or consenting to small ₹20–₹50 round-ups after payments feels painless and compounds over a semester.'
  }
];

const QUIZ_QUESTIONS = [
  {
    q: 'In the 50/30/20 budgeting rule, what does the 30% represent?',
    options: ['Wants & campus lifestyle', 'Fixed PG rent & mess needs', 'Emergency fund savings', 'Income tax'],
    correct: 0,
    exp: '50% goes to Needs, 30% to Wants (outings, coffee, entertainment), and 20% to Savings.'
  },
  {
    q: 'What is the main purpose of an Emergency Fund?',
    options: ['Buying concert tickets', 'Covering unexpected medical or urgent travel costs', 'Paying monthly Netflix', 'Increasing credit limit'],
    correct: 1,
    exp: 'An emergency fund prevents you from borrowing or panicking when an unexpected expense hits.'
  },
  {
    q: 'What does UPI stand for in India?',
    options: ['Universal Payment Index', 'Unified Payments Interface', 'United Pay India', 'Unique Payment ID'],
    correct: 1,
    exp: 'UPI stands for Unified Payments Interface, developed by NPCI for instant bank-to-bank transfers.'
  },
  {
    q: 'If 10% TDS is deducted from your freelance project, what can you do if your yearly income is below the tax slab?',
    options: ['Nothing, it is lost forever', 'File an ITR to claim a TDS refund', 'Ask your college principal', 'Pay 10% more'],
    correct: 1,
    exp: 'Filing an Income Tax Return (ITR) lets students claim back excess TDS deducted on internships or freelance work.'
  },
  {
    q: 'How is your daily Safe-to-Spend estimated?',
    options: ['Total annual fees ÷ 12', 'Remaining monthly budget ÷ remaining days in cycle', 'Total savings × 2', 'Last month food bill'],
    correct: 1,
    exp: 'Dividing your remaining budget by the days left in the month gives a clear daily spending guardrail.'
  }
];

const SOCIAL_OPTIONS = [
  { name: 'Campus Canteen', cost: 40, desc: 'Chai, Maggi & samosas with friends' },
  { name: 'Local Street Food', cost: 120, desc: 'Momos, chaat & cold coffee' },
  { name: 'Rooftop Café', cost: 250, desc: 'Pasta or shake at a student café' },
  { name: 'Movie + Snacks', cost: 420, desc: 'Evening show & popcorn' }
];

// State
let state = {
  txns: [],
  budget: 15000,
  goals: [],
  user: { ...DEFAULT_USER },
  prefs: { ...DEFAULT_PREFS },
  bills: [],
  splits: [],
  roomFund: 4200,
  notifs: [],
  lessonProgress: LESSONS.map(l => l.progress),
  activityTypeFilter: 'all',
  manualCategory: 'Food & Mess',
  splitMode: 'equal',
  splitParticipants: ['Aditi (You)', 'Priya Sharma', 'Rohit Kumar', 'Aryan Mehta'],
  socialSelected: SOCIAL_OPTIONS[1],
  socialGroupSize: 4,
  onboardStep: 1,
  quizIndex: 0,
  quizScore: 0,
  quizTimer: 45,
  quizInterval: null,
  quizAnswered: false,
  otpInterval: null,
  isRecordingVoice: false
};

// Persistence helpers
function loadState() {
  try {
    state.txns = JSON.parse(localStorage.getItem(STORAGE_KEYS.TXNS)) || [...DEFAULT_TXNS];
    state.budget = Number(localStorage.getItem(STORAGE_KEYS.BUDGET)) || 15000;
    state.goals = JSON.parse(localStorage.getItem(STORAGE_KEYS.GOALS)) || JSON.parse(JSON.stringify(DEFAULT_GOALS));
    state.user = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER)) || { ...DEFAULT_USER };
    state.prefs = { ...DEFAULT_PREFS, ...(JSON.parse(localStorage.getItem(STORAGE_KEYS.PREFS)) || {}) };
    state.bills = JSON.parse(localStorage.getItem(STORAGE_KEYS.BILLS)) || JSON.parse(JSON.stringify(DEFAULT_BILLS));
    state.splits = JSON.parse(localStorage.getItem(STORAGE_KEYS.SPLITS)) || JSON.parse(JSON.stringify(DEFAULT_SPLITS));
    state.roomFund = Number(localStorage.getItem(STORAGE_KEYS.ROOM_FUND)) || 4200;
    state.notifs = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFS)) || JSON.parse(JSON.stringify(DEFAULT_NOTIFS));
    state.lessonProgress = JSON.parse(localStorage.getItem(STORAGE_KEYS.LESSONS)) || LESSONS.map(l => l.progress);
  } catch (e) {
    console.warn('LocalStorage load fallback', e);
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEYS.TXNS, JSON.stringify(state.txns));
    localStorage.setItem(STORAGE_KEYS.BUDGET, String(state.budget));
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(state.goals));
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(state.user));
    localStorage.setItem(STORAGE_KEYS.PREFS, JSON.stringify(state.prefs));
    localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(state.bills));
    localStorage.setItem(STORAGE_KEYS.SPLITS, JSON.stringify(state.splits));
    localStorage.setItem(STORAGE_KEYS.ROOM_FUND, String(state.roomFund));
    localStorage.setItem(STORAGE_KEYS.NOTIFS, JSON.stringify(state.notifs));
    localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(state.lessonProgress));
  } catch (e) {}
}

function resetDemoData() {
  Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
  loadState();
  applyPreferences();
  renderAll();
  showToast('Demo data reset to defaults');
  showScreen('home');
}

// Formatting
function formatINR(num) {
  return '₹' + new Intl.NumberFormat('en-IN').format(Math.round(num));
}

function getMonthlySpent() {
  return state.txns
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);
}

function getRemainingDays() {
  return 12; // Consistent demo cycle remaining days
}

function getSafeToSpend() {
  const remaining = Math.max(0, state.budget - getMonthlySpent());
  return Math.round(remaining / getRemainingDays());
}

// Navigation
const NO_NAV_SCREENS = ['welcome', 'login', 'otp', 'onboard'];

function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById('screen-' + screenId);
  if (target) {
    target.classList.add('active');
    document.getElementById('screen-stage').scrollTop = 0;
  }

  // Bottom nav visibility & active tab
  const nav = document.getElementById('bottom-nav');
  if (NO_NAV_SCREENS.includes(screenId)) {
    nav.classList.add('hidden');
  } else {
    nav.classList.remove('hidden');
  }

  document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
  const tabMap = {
    home: 'home',
    activity: 'activity',
    goals: 'goals',
    more: 'more',
    living: 'more',
    social: 'more',
    learn: 'more',
    quiz: 'more',
    ai: 'more',
    profile: 'more',
    notifications: 'more',
    safety: 'more'
  };
  const activeTab = tabMap[screenId];
  if (activeTab) {
    const btn = document.querySelector(`.nav-item[data-tab="${activeTab}"]`);
    if (btn) btn.classList.add('active');
  }

  // Status bar theme for Safety Mode
  const statusBar = document.getElementById('status-bar');
  if (screenId === 'safety') {
    statusBar.classList.add('dark-mode');
  } else {
    statusBar.classList.remove('dark-mode');
  }

  // Flow switcher highlight
  document.querySelectorAll('.flow-pill').forEach(pill => {
    pill.classList.toggle('active', pill.dataset.screen === screenId);
  });

  // Screen-specific hooks
  if (screenId === 'home') renderHome();
  if (screenId === 'activity') renderActivity();
  if (screenId === 'goals') renderGoals();
  if (screenId === 'safety') renderSafetyMode();
  if (screenId === 'social') renderSocialHelper();
  if (screenId === 'split') renderSplitScreen();
  if (screenId === 'living') renderLivingHub();
  if (screenId === 'learn') renderLearn();
  if (screenId === 'notifications') renderNotifications();
  if (screenId === 'profile') renderProfile();
  if (screenId === 'ai') initAIChat();
  if (screenId === 'otp') startOTPTimer();
}

// Toast & Modal
let toastTimer = null;
function showToast(msg) {
  const el = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2500);
}

function openModal(html) {
  document.getElementById('modal-body').innerHTML = html;
  document.getElementById('modal-overlay').classList.add('open');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
}

// Auth & OTP
function handleGetOTP() {
  const phone = document.getElementById('login-phone').value.replace(/\D/g, '');
  const err = document.getElementById('login-error');
  if (phone.length !== 10) {
    err.style.display = 'block';
    return;
  }
  err.style.display = 'none';
  document.getElementById('otp-phone-display').textContent = `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`;
  showScreen('otp');
}

function initOTPInputs() {
  const inputs = document.querySelectorAll('.otp-input');
  inputs.forEach((inp, idx) => {
    inp.addEventListener('input', () => {
      inp.value = inp.value.replace(/\D/g, '').slice(0, 1);
      inp.classList.toggle('filled', inp.value !== '');
      if (inp.value && idx < inputs.length - 1) inputs[idx + 1].focus();
    });
    inp.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !inp.value && idx > 0) inputs[idx - 1].focus();
    });
  });
}

function handleVerifyOTP() {
  const vals = Array.from(document.querySelectorAll('.otp-input')).map(i => i.value);
  const err = document.getElementById('otp-error');
  if (vals.some(v => v === '')) {
    err.style.display = 'block';
    return;
  }
  err.style.display = 'none';
  showToast('Phone verified!');
  showScreen('onboard');
}

function startOTPTimer() {
  clearInterval(state.otpInterval);
  let sec = 59;
  const cd = document.getElementById('otp-countdown');
  const wrap = document.getElementById('otp-timer-wrap');
  const btn = document.getElementById('otp-resend-btn');
  wrap.style.display = 'inline';
  btn.style.display = 'none';
  state.otpInterval = setInterval(() => {
    sec--;
    cd.textContent = '00:' + String(sec).padStart(2, '0');
    if (sec <= 0) {
      clearInterval(state.otpInterval);
      wrap.style.display = 'none';
      btn.style.display = 'inline';
    }
  }, 1000);
}

function resetOTPTimer() {
  showToast('Demo OTP resent: 4829');
  startOTPTimer();
}

// Onboarding
function updateOnboardUI() {
  const step = state.onboardStep;
  document.getElementById('onboard-step-label').textContent = `Step ${step} of 5`;
  document.querySelectorAll('.onboard-step').forEach(el => {
    el.style.display = Number(el.dataset.step) === step ? 'block' : 'none';
  });
  document.querySelectorAll('.onboard-dot').forEach((dot, idx) => {
    dot.style.background = idx < step ? 'var(--primary)' : 'var(--border)';
  });
  const nextBtn = document.getElementById('onboard-next-btn');
  nextBtn.textContent = step === 5 ? 'Start Exploring' : 'Continue →';

  if (step === 5) {
    const name = document.getElementById('ob-name').value.trim() || 'Aditi';
    const budget = Number(document.getElementById('ob-budget-range').value) || 15000;
    const catCount = document.querySelectorAll('#ob-categories .chip.active').length;
    document.getElementById('ob-summary-name').textContent = name;
    document.getElementById('ob-summary-budget').textContent = formatINR(budget);
    document.getElementById('ob-summary-cats').textContent = `${catCount} selected`;
  }
}

function nextOnboardStep() {
  if (state.onboardStep < 5) {
    state.onboardStep++;
    updateOnboardUI();
  } else {
    state.user.name = document.getElementById('ob-name').value.trim() || 'Aditi';
    state.user.fullName = state.user.name + ' Sharma';
    state.user.campus = document.getElementById('ob-campus').value.trim() || 'NSUT · Delhi';
    state.budget = Number(document.getElementById('ob-budget-range').value) || 15000;
    saveState();
    state.onboardStep = 1;
    showToast('Welcome to Centpercent!');
    showScreen('home');
  }
}

function prevOnboardStep() {
  if (state.onboardStep > 1) {
    state.onboardStep--;
    updateOnboardUI();
  } else {
    showScreen('welcome');
  }
}

function updateOnboardBudgetPreview(val) {
  document.getElementById('ob-budget-val').textContent = formatINR(val);
  document.getElementById('ob-daily-preview').textContent = formatINR(Math.round(val / 30)) + ' / day';
}

// Home Dashboard
function renderHome() {
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  document.getElementById('home-greeting').textContent = `${greet}, ${state.user.name}`;
  document.getElementById('home-campus').textContent = state.user.campus;
  document.getElementById('home-avatar').textContent = state.user.name.slice(0, 2).toUpperCase();

  const spent = getMonthlySpent();
  const left = Math.max(0, state.budget - spent);
  const safeDaily = getSafeToSpend();
  const pctUsed = Math.min(100, Math.round((spent / state.budget) * 100));

  const hidden = state.prefs.hideBalance;
  document.getElementById('home-safe-amount').textContent = hidden ? '••••' : formatINR(safeDaily);
  document.getElementById('home-spent-val').textContent = hidden ? '••••' : formatINR(spent);
  document.getElementById('home-left-val').textContent = hidden ? '••••' : formatINR(left);
  document.getElementById('home-budget-bar').style.width = pctUsed + '%';

  const statusPill = document.getElementById('home-budget-status');
  const warningBanner = document.getElementById('home-safety-warning');
  if (pctUsed >= 70) {
    statusPill.textContent = 'Watch spending';
    warningBanner.style.display = 'block';
  } else {
    statusPill.textContent = 'On track';
    warningBanner.style.display = 'none';
  }

  // Unread notif dot
  const unread = state.notifs.some(n => !n.read);
  document.getElementById('home-notif-dot').style.display = unread ? 'block' : 'none';

  // Goal preview
  const goa = state.goals[0];
  if (goa) {
    const gPct = Math.min(100, Math.round((goa.saved / goa.target) * 100));
    document.getElementById('home-goal-title').textContent = goa.name;
    document.getElementById('home-goal-pct').textContent = `${gPct}% saved`;
    document.getElementById('home-goal-bar').style.width = gPct + '%';
    document.getElementById('home-goal-amounts').textContent = `${formatINR(goa.saved)} / ${formatINR(goa.target)}`;
  }

  // Recent 3 transactions
  const recentEl = document.getElementById('home-recent-list');
  recentEl.innerHTML = state.txns.slice(0, 3).map(renderTxnRow).join('');
}

function toggleBalance() {
  state.prefs.hideBalance = !state.prefs.hideBalance;
  saveState();
  renderHome();
  const prefCheck = document.getElementById('pref-hide-bal');
  if (prefCheck) prefCheck.checked = state.prefs.hideBalance;
}

function toggleBalanceFromPref(checked) {
  state.prefs.hideBalance = checked;
  saveState();
  renderHome();
}

function openSafeToSpendInfo() {
  const spent = getMonthlySpent();
  const left = Math.max(0, state.budget - spent);
  const days = getRemainingDays();
  const safe = getSafeToSpend();
  openModal(`
    <h3 style="font-size:18px; font-weight:700; margin-bottom:8px;">How Safe to Spend works</h3>
    <p style="font-size:13px; color:var(--text-muted); line-height:1.5; margin-bottom:14px;">
      This is a simple daily estimate (not a live bank balance) to help you pace your monthly budget.
    </p>
    <div class="card-pale" style="margin-bottom:14px; font-size:13px;">
      <div style="display:flex; justify-content:space-between; padding:4px 0;">
        <span>Remaining Monthly Budget</span>
        <strong>${formatINR(left)}</strong>
      </div>
      <div style="display:flex; justify-content:space-between; padding:4px 0;">
        <span>Days Left in Cycle</span>
        <strong>${days} days</strong>
      </div>
      <div style="display:flex; justify-content:space-between; padding:8px 0 2px; border-top:1px solid var(--border); margin-top:4px; color:var(--primary);">
        <strong>${formatINR(left)} &divide; ${days} days</strong>
        <strong>${formatINR(safe)} / day</strong>
      </div>
    </div>
    <button class="btn-primary" onclick="closeModal()">Got it</button>
  `);
}

// Transaction Row & Detail Modal
function getCatBadge(cat) {
  const map = {
    'Food & Mess': 'F',
    'PG Rent': 'R',
    'Travel': 'T',
    'Books & Printing': 'B',
    'Shopping': 'S',
    'Subscriptions': 'Sub',
    'Entertainment': 'E',
    'Transfer': '₹',
    'Income': '+'
  };
  return map[cat] || '•';
}

function renderTxnRow(t) {
  const isCredit = t.type === 'income';
  const sign = isCredit ? '+' : '−';
  return `
    <div class="txn-item" onclick="openTxnDetail(${t.id})">
      <div class="txn-left">
        <div class="txn-icon" style="font-family:'DM Sans'; font-size:13px; font-weight:700; color:var(--primary);">${getCatBadge(t.category)}</div>
        <div class="txn-details">
          <div class="txn-title">${t.title}</div>
          <div class="txn-meta">${t.category} &middot; ${t.date} &middot; ${t.method}</div>
        </div>
      </div>
      <div class="txn-amount ${isCredit ? 'credit' : 'debit'} tabular-nums">${sign}${formatINR(t.amount)}</div>
    </div>
  `;
}

function openTxnDetail(id) {
  const t = state.txns.find(x => x.id === id);
  if (!t) return;
  const isCredit = t.type === 'income';
  openModal(`
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
      <span class="pill ${isCredit ? 'pill-success' : 'pill-brand'}">${t.category}</span>
      <span style="font-size:12px; color:var(--text-muted);">${t.date}</span>
    </div>
    <h3 style="font-size:19px; font-weight:700;">${t.title}</h3>
    <div class="tabular-nums" style="font-family:'DM Sans'; font-size:28px; font-weight:700; margin:8px 0 14px; color:${isCredit ? 'var(--success)' : 'var(--text-primary)'};">
      ${isCredit ? '+' : '−'}${formatINR(t.amount)}
    </div>
    <div class="card" style="margin-bottom:14px; font-size:13px;">
      <div style="display:flex; justify-content:space-between; padding:5px 0;">
        <span style="color:var(--text-muted);">Payment Method</span>
        <strong>${t.method}</strong>
      </div>
      <div style="display:flex; justify-content:space-between; padding:5px 0;">
        <span style="color:var(--text-muted);">Note</span>
        <strong>${t.note || 'None'}</strong>
      </div>
    </div>
    <div style="display:flex; gap:8px;">
      <button class="btn-secondary" style="flex:1; color:var(--danger); border-color:#FECACA;" onclick="deleteTxn(${t.id})">Delete</button>
      <button class="btn-primary" style="flex:1;" onclick="closeModal()">Close</button>
    </div>
  `);
}

function deleteTxn(id) {
  state.txns = state.txns.filter(t => t.id !== id);
  saveState();
  closeModal();
  renderHome();
  renderActivity();
  showToast('Transaction removed');
}

// Add Expense (Voice, Receipt, Manual)
function switchAddTab(tab, btn) {
  document.querySelectorAll('#add-tabs .seg-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  ['voice', 'receipt', 'manual'].forEach(t => {
    document.getElementById('add-tab-' + t).style.display = t === tab ? 'block' : 'none';
  });
}

function selectManualChip(btn, cat) {
  document.querySelectorAll('#manual-categories .chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  state.manualCategory = cat;
}

function toggleVoiceRecording() {
  const mic = document.getElementById('voice-mic-btn');
  const waves = document.getElementById('voice-waves');
  const status = document.getElementById('voice-status');

  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRec && !state.isRecordingVoice) {
    const rec = new SpeechRec();
    rec.lang = 'en-IN';
    state.isRecordingVoice = true;
    mic.classList.add('recording');
    waves.classList.add('active');
    status.textContent = 'Listening... speak now';
    rec.onresult = (e) => {
      const text = e.results[0][0].transcript;
      stopVoiceUI();
      parseVoicePhrase(text);
    };
    rec.onerror = () => {
      stopVoiceUI();
      simulateVoicePhrase('I spent 140 rupees on coffee');
    };
    rec.start();
  } else if (!state.isRecordingVoice) {
    state.isRecordingVoice = true;
    mic.classList.add('recording');
    waves.classList.add('active');
    status.textContent = 'Listening (Demo)...';
    setTimeout(() => {
      stopVoiceUI();
      simulateVoicePhrase('I spent 140 rupees on coffee');
    }, 1500);
  } else {
    stopVoiceUI();
  }
}

function stopVoiceUI() {
  state.isRecordingVoice = false;
  document.getElementById('voice-mic-btn').classList.remove('recording');
  document.getElementById('voice-waves').classList.remove('active');
  document.getElementById('voice-status').textContent = 'Tap microphone to start';
}

function simulateVoicePhrase(phrase) {
  parseVoicePhrase(phrase);
}

function parseVoicePhrase(phrase) {
  const amtMatch = phrase.match(/(\d+)/);
  const amount = amtMatch ? Number(amtMatch[1]) : 140;
  const lower = phrase.toLowerCase();
  let category = 'Food & Mess';
  let title = 'Coffee';
  if (lower.includes('metro') || lower.includes('auto') || lower.includes('travel') || lower.includes('bus')) {
    category = 'Travel';
    title = 'Metro / Travel';
  } else if (lower.includes('book') || lower.includes('print')) {
    category = 'Books & Printing';
    title = 'Books & Printout';
  } else if (lower.includes('coffee')) {
    title = 'Campus Coffee';
  } else {
    title = phrase.slice(0, 26);
  }
  document.getElementById('voice-transcript').textContent = `"${phrase}"`;
  document.getElementById('voice-amount').value = amount;
  document.getElementById('voice-category').value = category;
  document.getElementById('voice-title').value = title;
  document.getElementById('voice-preview-card').style.display = 'block';
}

function handleReceiptUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = document.getElementById('receipt-img-preview');
    img.src = e.target.result;
    img.style.display = 'block';
    document.getElementById('receipt-sample-box').style.display = 'none';
    document.getElementById('receipt-scan-badge').textContent = 'Receipt Loaded — Verify Details';
    document.getElementById('receipt-amount').value = 240;
    document.getElementById('receipt-title').value = file.name.split('.')[0] || 'Scanned Receipt';
    document.getElementById('receipt-preview-card').style.display = 'block';
  };
  reader.readAsDataURL(file);
}

function simulateReceiptScan() {
  document.getElementById('receipt-img-preview').style.display = 'none';
  document.getElementById('receipt-sample-box').style.display = 'block';
  document.getElementById('receipt-scan-badge').textContent = 'Demo Extraction Ready';
  document.getElementById('receipt-amount').value = 185;
  document.getElementById('receipt-title').value = 'Campus Cafe & Books';
  document.getElementById('receipt-category').value = 'Food & Mess';
  document.getElementById('receipt-preview-card').style.display = 'block';
}

function confirmAddExpense(mode) {
  let amount = 0, title = '', category = 'Food & Mess', method = 'UPI', note = '';
  if (mode === 'voice') {
    amount = Number(document.getElementById('voice-amount').value);
    title = document.getElementById('voice-title').value.trim();
    category = document.getElementById('voice-category').value;
  } else if (mode === 'receipt') {
    amount = Number(document.getElementById('receipt-amount').value);
    title = document.getElementById('receipt-title').value.trim();
    category = document.getElementById('receipt-category').value;
  } else {
    amount = Number(document.getElementById('manual-amount').value);
    title = document.getElementById('manual-title').value.trim();
    category = state.manualCategory;
    method = document.getElementById('manual-method').value;
    note = document.getElementById('manual-note').value.trim();
  }

  if (!amount || amount <= 0) {
    showToast('Please enter a valid amount');
    return;
  }
  if (!title) {
    showToast('Please enter an expense title');
    return;
  }

  const newTxn = {
    id: Date.now(),
    title,
    category,
    amount,
    type: 'expense',
    date: 'Today',
    method,
    note
  };
  state.txns.unshift(newTxn);
  state.notifs.unshift({
    id: Date.now(),
    title: `Expense saved: ${title} ${formatINR(amount)}`,
    desc: `Categorized under ${category}.`,
    time: 'Just now',
    read: false,
    screen: 'activity'
  });
  saveState();

  // Reset forms
  if (mode === 'manual') {
    document.getElementById('manual-amount').value = '';
    document.getElementById('manual-title').value = '';
    document.getElementById('manual-note').value = '';
  } else if (mode === 'voice') {
    document.getElementById('voice-preview-card').style.display = 'none';
  } else {
    document.getElementById('receipt-preview-card').style.display = 'none';
  }

  showToast(`Saved ${formatINR(amount)} expense`);
  showScreen('home');
}

// Activity & Insights
function switchActivityTab(tab, btn) {
  btn.parentElement.querySelectorAll('.seg-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  ['transactions', 'timeline', 'insights'].forEach(t => {
    document.getElementById('act-tab-' + t).style.display = t === tab ? 'block' : 'none';
  });
  renderActivity();
}

function setActivityTypeFilter(type, btn) {
  state.activityTypeFilter = type;
  btn.parentElement.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  renderActivity();
}

function quickOpenAddTab(tab) {
  showScreen('add');
  const tabs = document.querySelectorAll('#add-tabs .seg-tab');
  const idx = tab === 'voice' ? 0 : tab === 'receipt' ? 1 : 2;
  if (tabs[idx]) switchAddTab(tab, tabs[idx]);
}

function renderActivity() {
  const totalIncome = state.txns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalSpent = state.txns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const incEl = document.getElementById('act-summary-income');
  const spEl = document.getElementById('act-summary-spent');
  if (incEl) incEl.textContent = formatINR(totalIncome);
  if (spEl) spEl.textContent = formatINR(totalSpent);

  const q = (document.getElementById('act-search')?.value || '').toLowerCase();
  const cat = document.getElementById('act-cat-filter')?.value || 'all';
  const dateF = document.getElementById('act-date-filter')?.value || 'all';

  const filtered = state.txns.filter(t => {
    if (state.activityTypeFilter !== 'all' && t.type !== state.activityTypeFilter) return false;
    if (cat !== 'all' && t.category !== cat) return false;
    if (dateF === 'today' && t.date !== 'Today') return false;
    if (dateF === 'week' && !['Today', 'Yesterday', '10 Nov', '8 Nov'].includes(t.date)) return false;
    if (q && !t.title.toLowerCase().includes(q) && !t.category.toLowerCase().includes(q)) return false;
    return true;
  });

  document.getElementById('activity-count-pill').textContent = `${filtered.length} txns`;

  const listEl = document.getElementById('act-transactions-list');
  listEl.innerHTML = filtered.length
    ? filtered.map(renderTxnRow).join('')
    : '<div style="text-align:center; padding:24px 0; color:var(--text-muted); font-size:13px;">No matching transactions found.</div>';

  // 7-day calendar strip on Timeline
  const stripEl = document.getElementById('timeline-calendar-strip');
  if (stripEl) {
    const days = [
      { d: 'Sun', n: '6', match: '7 Nov' },
      { d: 'Mon', n: '7', match: '7 Nov' },
      { d: 'Tue', n: '8', match: '8 Nov' },
      { d: 'Wed', n: '9', match: '10 Nov' },
      { d: 'Thu', n: '10', match: '10 Nov' },
      { d: 'Fri', n: '11', match: 'Yesterday' },
      { d: 'Sat', n: '12', match: 'Today', active: true }
    ];
    stripEl.innerHTML = days.map(item => `
      <div onclick="showToast('Viewing ${item.d} ${item.n} Nov')" style="text-align:center; padding:6px 2px; border-radius:10px; cursor:pointer; background:${item.active ? 'var(--primary)' : '#fff'}; color:${item.active ? '#fff' : 'var(--text-primary)'}; border:1px solid ${item.active ? 'var(--primary)' : 'var(--border)'};">
        <div style="font-size:10px; opacity:0.8;">${item.d}</div>
        <div style="font-family:'DM Sans'; font-size:13px; font-weight:700;">${item.n}</div>
      </div>
    `).join('');
  }

  // Timeline
  const groups = {};
  state.txns.forEach(t => {
    groups[t.date] = groups[t.date] || [];
    groups[t.date].push(t);
  });
  document.getElementById('act-timeline-list').innerHTML = Object.entries(groups).map(([date, items]) => `
    <div style="margin-bottom:14px;">
      <div style="font-size:12px; font-weight:700; color:var(--primary); margin-bottom:6px; display:flex; align-items:center; gap:6px;">
        <span style="width:8px; height:8px; border-radius:50%; background:var(--primary); display:inline-block;"></span>
        ${date}
      </div>
      <div class="card" style="padding:4px 14px;">${items.map(renderTxnRow).join('')}</div>
    </div>
  `).join('');

  // Insights Donut
  const expenses = state.txns.filter(t => t.type === 'expense');
  const totalExp = expenses.reduce((s, t) => s + t.amount, 0) || 1;
  const byCat = {};
  expenses.forEach(t => { byCat[t.category] = (byCat[t.category] || 0) + t.amount; });
  const sorted = Object.entries(byCat).sort((a, b) => b[1] - a[1]);
  const colors = ['#005A42', '#1F8A68', '#52B788', '#95D5B2', '#D8F3DC', '#718278'];

  let acc = 0;
  const stops = sorted.map(([, val], idx) => {
    const pct = (val / totalExp) * 100;
    const start = acc;
    acc += pct;
    return `${colors[idx % colors.length]} ${start.toFixed(1)}% ${acc.toFixed(1)}%`;
  }).join(', ');

  document.getElementById('insights-donut').style.background = `conic-gradient(${stops || '#005A42 0% 100%'})`;
  document.getElementById('insights-total').textContent = formatINR(totalExp);
  document.getElementById('insights-legend').innerHTML = sorted.slice(0, 5).map(([c, val], idx) => `
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <span style="display:flex; align-items:center; gap:6px;">
        <span style="width:8px; height:8px; border-radius:2px; background:${colors[idx % colors.length]};"></span>
        <span>${c}</span>
      </span>
      <strong class="tabular-nums">${Math.round((val / totalExp) * 100)}%</strong>
    </div>
  `).join('');
}

// Send Money & Payment Success
function selectRecipient(name) {
  document.getElementById('send-recipient').value = name;
}

function setSendAmount(amt, btn) {
  document.getElementById('send-amount').value = amt;
  btn.parentElement.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
}

function openSendReview() {
  const recipient = document.getElementById('send-recipient').value.trim();
  const amount = Number(document.getElementById('send-amount').value);
  const method = document.getElementById('send-method').value;
  const note = document.getElementById('send-note').value.trim();
  if (!recipient || !amount || amount <= 0) {
    showToast('Enter recipient and valid amount');
    return;
  }
  openModal(`
    <h3 style="font-size:18px; font-weight:700; margin-bottom:10px;">Confirm Demo Payment</h3>
    <div class="card-pale" style="margin-bottom:14px; font-size:13px;">
      <div style="display:flex; justify-content:space-between; padding:5px 0;">
        <span style="color:var(--text-muted);">To</span>
        <strong>${recipient}</strong>
      </div>
      <div style="display:flex; justify-content:space-between; padding:5px 0;">
        <span style="color:var(--text-muted);">Amount</span>
        <strong class="tabular-nums" style="font-size:16px; color:var(--primary);">${formatINR(amount)}</strong>
      </div>
      <div style="display:flex; justify-content:space-between; padding:5px 0;">
        <span style="color:var(--text-muted);">Method</span>
        <strong>${method}</strong>
      </div>
      ${note ? `<div style="display:flex; justify-content:space-between; padding:5px 0;"><span style="color:var(--text-muted);">Note</span><strong>${note}</strong></div>` : ''}
    </div>
    <p style="font-size:11.5px; color:var(--text-muted); margin-bottom:14px;">Simulated payment for prototype demonstration only.</p>
    <button class="btn-primary" onclick="executeSendPayment()">Confirm &amp; Send ${formatINR(amount)}</button>
  `);
}

function executeSendPayment() {
  const recipient = document.getElementById('send-recipient').value.trim();
  const amount = Number(document.getElementById('send-amount').value);
  const method = document.getElementById('send-method').value;
  const note = document.getElementById('send-note').value.trim();

  closeModal();
  state.txns.unshift({
    id: Date.now(),
    title: `Sent to ${recipient.split('(')[0].trim()}`,
    category: 'Transfer',
    amount,
    type: 'expense',
    date: 'Today',
    method,
    note
  });
  saveState();

  document.getElementById('success-amount').textContent = formatINR(amount);
  document.getElementById('success-recipient').textContent = `Sent to ${recipient}`;
  document.getElementById('success-txn-id').textContent = 'Demo Txn ID: CP-DEMO-' + Math.floor(100000 + Math.random() * 900000);
  document.getElementById('success-method').textContent = method;
  document.getElementById('success-nudge-card').style.display = 'block';
  showScreen('success');
}

function acceptSavingsNudge(amt) {
  addToGoal(1, amt);
  document.getElementById('success-nudge-card').style.display = 'none';
}

function dismissSavingsNudge() {
  document.getElementById('success-nudge-card').style.display = 'none';
  showToast('Skipped — no money deducted');
}

// Receive Money
function copyUPI() {
  copyText(state.user.upi);
}

function setRequestAmount() {
  const val = Number(document.getElementById('receive-req-amount').value);
  const tag = document.getElementById('receive-qr-amount-tag');
  if (!val || val <= 0) {
    tag.style.display = 'none';
    return;
  }
  tag.textContent = `Requesting ${formatINR(val)}`;
  tag.style.display = 'block';
  showToast(`QR updated for ${formatINR(val)}`);
}

// Split & Settle
function setSplitMode(mode) {
  state.splitMode = mode;
  document.getElementById('split-mode-equal').classList.toggle('active', mode === 'equal');
  document.getElementById('split-mode-custom').classList.toggle('active', mode === 'custom');
  recalculateSplit();
}

function toggleSplitParticipant(name) {
  if (state.splitParticipants.includes(name)) {
    if (state.splitParticipants.length <= 1) return;
    state.splitParticipants = state.splitParticipants.filter(n => n !== name);
  } else {
    state.splitParticipants.push(name);
  }
  recalculateSplit();
}

function renderSplitScreen() {
  recalculateSplit();
  const ledgerEl = document.getElementById('split-ledger-list');
  ledgerEl.innerHTML = state.splits.map(s => `
    <div class="card" style="padding:12px 14px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
        <strong style="font-size:13.5px;">${s.title}</strong>
        <span class="pill pill-brand">${formatINR(s.total)}</span>
      </div>
      <div style="font-size:11.5px; color:var(--text-muted); margin-bottom:8px;">Paid by ${s.payer} &middot; ${formatINR(s.perPerson)} / person</div>
      <div style="display:flex; flex-wrap:wrap; gap:6px;">
        ${s.participants.map(p => {
          const isPaid = p === s.payer || s.settled.includes(p);
          return `<button class="pill ${isPaid ? 'pill-success' : 'pill-warning'}" style="border:none; cursor:pointer;" onclick="toggleSplitSettled(${s.id}, '${p}')">${p.split(' ')[0]}: ${isPaid ? 'Paid' : 'Pending'}</button>`;
        }).join('')}
      </div>
    </div>
  `).join('');
}

function recalculateSplit() {
  const title = document.getElementById('split-title').value || 'Shared Bill';
  const total = Number(document.getElementById('split-total').value) || 0;
  const payer = document.getElementById('split-payer').value;
  const all = ['Aditi (You)', 'Priya Sharma', 'Rohit Kumar', 'Aryan Mehta'];
  const count = state.splitParticipants.length;
  const perPerson = count ? Math.round(total / count) : 0;

  document.getElementById('split-count-badge').textContent = `${count} people`;
  document.getElementById('split-preview-title').textContent = title;
  document.getElementById('split-preview-total').textContent = `Total: ${formatINR(total)}`;
  document.getElementById('split-per-person').textContent = formatINR(perPerson);

  const listEl = document.getElementById('split-participants-list');
  listEl.innerHTML = all.map(name => {
    const selected = state.splitParticipants.includes(name);
    const isPayer = name === payer;
    return `
      <div style="display:flex; justify-content:space-between; align-items:center; padding:6px 0; border-bottom:1px solid var(--border-light);">
        <label style="display:flex; align-items:center; gap:8px; font-size:13px; cursor:pointer;">
          <input type="checkbox" ${selected ? 'checked' : ''} onchange="toggleSplitParticipant('${name}')" style="accent-color:var(--primary); width:16px; height:16px;" />
          <span>${name} ${isPayer ? '<span class="pill pill-success" style="margin-left:4px;">Paid</span>' : ''}</span>
        </label>
        ${selected ? (state.splitMode === 'equal'
          ? `<strong class="tabular-nums" style="font-size:13px;">${formatINR(perPerson)}</strong>`
          : `<input type="number" class="input-field" value="${perPerson}" style="width:82px; height:32px; text-align:right; font-size:13px;" />`
        ) : '<span style="font-size:11.5px; color:var(--text-light);">Excluded</span>'}
      </div>
    `;
  }).join('');
}

function sendSplitRequests() {
  const title = document.getElementById('split-title').value.trim() || 'Shared Bill';
  const total = Number(document.getElementById('split-total').value) || 0;
  const payer = document.getElementById('split-payer').value;
  const perPerson = Math.round(total / state.splitParticipants.length);
  if (total <= 0) {
    showToast('Enter a valid total amount');
    return;
  }
  state.splits.unshift({
    id: Date.now(),
    title,
    total,
    payer,
    perPerson,
    participants: [...state.splitParticipants],
    settled: [payer]
  });
  saveState();
  renderSplitScreen();
  showToast('Demo payment requests sent!');
}

function toggleSplitSettled(splitId, person) {
  const s = state.splits.find(x => x.id === splitId);
  if (!s || person === s.payer) return;
  if (s.settled.includes(person)) {
    s.settled = s.settled.filter(p => p !== person);
  } else {
    s.settled.push(person);
  }
  saveState();
  renderSplitScreen();
}

// Student Living Hub
function renderLivingHub() {
  document.getElementById('living-bills-list').innerHTML = state.bills.map(b => `
    <div style="display:flex; justify-content:space-between; align-items:center; padding:6px 0; border-bottom:1px solid var(--border-light);">
      <div>
        <div style="font-size:13px; font-weight:600;">${b.name}</div>
        <div style="font-size:11.5px; color:var(--text-muted);">${b.paid ? 'Paid this month' : b.due}</div>
      </div>
      <div style="display:flex; align-items:center; gap:8px;">
        <strong class="tabular-nums" style="font-size:13px;">${formatINR(b.amount)}</strong>
        <button class="pill ${b.paid ? 'pill-success' : 'pill-warning'}" style="border:none; cursor:pointer;" onclick="toggleBillPaid('${b.id}')">${b.paid ? 'Paid ✓' : 'Mark Paid'}</button>
      </div>
    </div>
  `).join('');

  const pct = Math.min(100, Math.round((state.roomFund / 10000) * 100));
  document.getElementById('room-fund-total').textContent = `${formatINR(state.roomFund)} / ₹10,000`;
  document.getElementById('room-fund-bar').style.width = pct + '%';
}

function toggleBillPaid(id) {
  const b = state.bills.find(x => x.id === id);
  if (b) {
    b.paid = !b.paid;
    saveState();
    renderLivingHub();
    showToast(b.paid ? `${b.name} marked paid` : `${b.name} marked unpaid`);
  }
}

function contributeRoomFund() {
  state.roomFund += 200;
  saveState();
  renderLivingHub();
  showToast('Added ₹200 to Emergency Room Fund');
}

// Safety Mode
function renderSafetyMode() {
  const left = Math.max(0, state.budget - getMonthlySpent());
  const daily = getSafeToSpend();
  const food = Math.round(daily * 0.6);
  const transport = Math.round(daily * 0.25);
  const buffer = Math.max(0, daily - food - transport);

  document.getElementById('safety-protected-bal').textContent = formatINR(left);
  document.getElementById('safety-daily-limit').textContent = formatINR(daily);
  document.getElementById('safety-food').textContent = formatINR(food);
  document.getElementById('safety-transport').textContent = formatINR(transport);
  document.getElementById('safety-buffer').textContent = formatINR(buffer);
}

function toggleSafetyMode() {
  state.prefs.safetyMode = !state.prefs.safetyMode;
  saveState();
  showToast('Exited Safety Mode');
  showScreen('home');
}

// Social Helper
function renderSocialHelper() {
  const safe = getSafeToSpend();
  document.getElementById('social-safe-limit').textContent = formatINR(safe);

  document.getElementById('social-options-list').innerHTML = SOCIAL_OPTIONS.map(opt => {
    const fits = opt.cost <= safe;
    const isSel = state.socialSelected.name === opt.name;
    return `
      <div class="card" onclick="selectSocialOption('${opt.name}')" style="padding:12px 14px; cursor:pointer; border-color:${isSel ? 'var(--primary)' : 'var(--border)'}; background:${isSel ? 'var(--pale-green)' : '#fff'}; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div style="font-size:13.5px; font-weight:700;">${opt.name}</div>
          <div style="font-size:11.5px; color:var(--text-muted);">${opt.desc}</div>
        </div>
        <div style="text-align:right;">
          <div class="tabular-nums" style="font-weight:700; font-size:13.5px;">${formatINR(opt.cost)}</div>
          <span class="pill ${fits ? 'pill-success' : 'pill-warning'}">${fits ? 'Fits budget' : 'Tight'}</span>
        </div>
      </div>
    `;
  }).join('');

  document.getElementById('social-selected-label').textContent = state.socialSelected.name;
  document.getElementById('social-group-count').textContent = state.socialGroupSize;
  const total = state.socialSelected.cost * state.socialGroupSize;
  document.getElementById('social-group-total').textContent = `${formatINR(total)} (${formatINR(state.socialSelected.cost)} each)`;
}

function selectSocialOption(name) {
  state.socialSelected = SOCIAL_OPTIONS.find(o => o.name === name) || SOCIAL_OPTIONS[0];
  renderSocialHelper();
}

function changeSocialGroup(delta) {
  state.socialGroupSize = Math.max(1, Math.min(12, state.socialGroupSize + delta));
  renderSocialHelper();
}

function shareSocialPlan() {
  const msg = `Friday plan: ${state.socialSelected.name} (~${formatINR(state.socialSelected.cost)}/person for ${state.socialGroupSize} of us).`;
  copyText(msg);
}

// Goals
function renderGoals() {
  const totalSaved = state.goals.reduce((s, g) => s + g.saved, 0);
  document.getElementById('goals-total-saved').textContent = formatINR(totalSaved);

  document.getElementById('goals-list').innerHTML = state.goals.map((g, i) => {
    const pct = Math.min(100, Math.round((g.saved / g.target) * 100));
    const icons = [
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>',
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="2" y1="20" x2="22" y2="20"/></svg>'
    ];
    return `
      <div class="card" style="padding:14px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
          <div style="display:flex; align-items:center; gap:10px; cursor:pointer;" onclick="openGoalDetail(${g.id})">
            <div style="width:36px; height:36px; border-radius:10px; background:var(--pale-green); color:var(--primary); display:flex; align-items:center; justify-content:center; flex-shrink:0;">${icons[i % icons.length]}</div>
            <div>
              <div style="font-size:14.5px; font-weight:700;">${g.name}</div>
              <div style="font-size:11.5px; color:var(--text-muted);">Target: ${g.deadline}</div>
            </div>
          </div>
          <span class="pill pill-mint">${pct}%</span>
        </div>
        <div class="progress-track" style="margin:8px 0;">
          <div class="progress-fill" style="width:${pct}%;"></div>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span class="tabular-nums" style="font-size:12.5px; font-weight:600;">${formatINR(g.saved)} / ${formatINR(g.target)}</span>
          <button class="btn-primary btn-sm" onclick="addToGoal(${g.id}, 500)">+ Add ₹500</button>
        </div>
      </div>
    `;
  }).join('');

  const chBtn = document.getElementById('challenge-btn');
  const chPill = document.getElementById('challenge-status-pill');
  if (state.prefs.weekendChallenge) {
    chBtn.textContent = 'Active ✓';
    chPill.textContent = 'Joined';
  } else {
    chBtn.textContent = 'Join Challenge';
    chPill.textContent = 'Optional';
  }
}

function addToGoal(goalId, amount) {
  const g = state.goals.find(x => x.id === goalId);
  if (!g) return;
  g.saved = Math.min(g.target, g.saved + amount);
  g.history = g.history || [];
  g.history.unshift(`+${formatINR(amount)} today`);
  saveState();
  renderGoals();
  renderHome();
  showToast(`Added ${formatINR(amount)} to ${g.name}`);
}

function openGoalDetail(goalId) {
  const g = state.goals.find(x => x.id === goalId);
  if (!g) return;
  const pct = Math.min(100, Math.round((g.saved / g.target) * 100));
  openModal(`
    <h3 style="font-size:19px; font-weight:700; margin-bottom:4px;">${g.name}</h3>
    <p style="font-size:12px; color:var(--text-muted); margin-bottom:12px;">Deadline: ${g.deadline} &middot; ${pct}% complete</p>
    <div class="card-pale" style="margin-bottom:12px;">
      <div class="tabular-nums" style="font-family:'DM Sans'; font-size:22px; font-weight:700;">${formatINR(g.saved)} <span style="font-size:13px; color:var(--text-muted); font-weight:500;">/ ${formatINR(g.target)}</span></div>
      <div class="progress-track" style="margin-top:8px;"><div class="progress-fill" style="width:${pct}%;"></div></div>
    </div>
    <h4 style="font-size:13px; font-weight:700; margin-bottom:6px;">Contribution History</h4>
    <div style="font-size:12.5px; color:var(--text-muted); margin-bottom:14px;">
      ${(g.history || []).map(h => `<div style="padding:4px 0; border-bottom:1px solid var(--border-light);">${h}</div>`).join('') || 'No contributions yet'}
    </div>
    <button class="btn-primary" onclick="addToGoal(${g.id}, 500); closeModal();">+ Add ₹500 Now</button>
  `);
}

function openNewGoalModal() {
  openModal(`
    <h3 style="font-size:18px; font-weight:700; margin-bottom:12px;">Create New Savings Goal</h3>
    <label class="input-label">Goal Name</label>
    <input id="new-goal-name" type="text" class="input-field" placeholder="e.g. Semester Exchange" style="margin-bottom:10px;" />
    <label class="input-label">Target Amount (₹)</label>
    <input id="new-goal-target" type="number" class="input-field" placeholder="e.g. 15000" style="margin-bottom:10px;" />
    <label class="input-label">Target Date</label>
    <input id="new-goal-date" type="text" class="input-field" value="30 Mar 2027" style="margin-bottom:14px;" />
    <button class="btn-primary" onclick="createNewGoal()">Create Goal</button>
  `);
}

function createNewGoal() {
  const name = document.getElementById('new-goal-name').value.trim();
  const target = Number(document.getElementById('new-goal-target').value);
  const deadline = document.getElementById('new-goal-date').value.trim() || 'Soon';
  if (!name || !target || target <= 0) {
    showToast('Enter goal name and target');
    return;
  }
  state.goals.push({ id: Date.now(), name, saved: 0, target, deadline, history: [] });
  saveState();
  closeModal();
  renderGoals();
  showToast('New goal created!');
}

function toggleWeekendChallenge() {
  state.prefs.weekendChallenge = !state.prefs.weekendChallenge;
  saveState();
  renderGoals();
  showToast(state.prefs.weekendChallenge ? 'Joined No-Spend Weekend Challenge!' : 'Left challenge');
}

// Money School & Quiz
function renderLearn() {
  document.getElementById('learn-lessons-list').innerHTML = LESSONS.map((l, idx) => {
    const prog = state.lessonProgress[idx] || 0;
    return `
      <div class="card" style="padding:13px 14px; cursor:pointer;" onclick="openLessonModal(${idx})">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
          <div>
            <div style="font-size:13.5px; font-weight:700;">${l.title}</div>
            <div style="font-size:11.5px; color:var(--text-muted);">${l.meta}</div>
          </div>
          <span class="pill ${prog === 100 ? 'pill-success' : 'pill-brand'}">${prog === 100 ? 'Done ✓' : prog + '%'}</span>
        </div>
        <div class="progress-track"><div class="progress-fill" style="width:${prog}%;"></div></div>
      </div>
    `;
  }).join('');
}

function openLessonModal(idx) {
  const l = LESSONS[idx];
  openModal(`
    <span class="pill pill-brand" style="margin-bottom:8px;">${l.meta}</span>
    <h3 style="font-size:19px; font-weight:700; margin-bottom:10px;">${l.title}</h3>
    <p style="font-size:13.5px; line-height:1.6; color:var(--text-primary); margin-bottom:16px;">${l.content}</p>
    <button class="btn-primary" onclick="completeLesson(${idx})">Mark Lesson Complete</button>
  `);
}

function completeLesson(idx) {
  state.lessonProgress[idx] = 100;
  saveState();
  closeModal();
  renderLearn();
  showToast('Lesson completed!');
}

function startQuiz() {
  state.quizIndex = 0;
  state.quizScore = 0;
  document.getElementById('quiz-question-view').style.display = 'block';
  document.getElementById('quiz-complete-view').style.display = 'none';
  showScreen('quiz');
  renderQuizQuestion();
}

function renderQuizQuestion() {
  clearInterval(state.quizInterval);
  state.quizAnswered = false;
  state.quizTimer = 45;
  const qObj = QUIZ_QUESTIONS[state.quizIndex];

  document.getElementById('quiz-progress-text').textContent = `Question ${state.quizIndex + 1} of ${QUIZ_QUESTIONS.length}`;
  document.getElementById('quiz-progress-bar').style.width = `${((state.quizIndex + 1) / QUIZ_QUESTIONS.length) * 100}%`;
  document.getElementById('quiz-question-text').textContent = qObj.q;
  document.getElementById('quiz-feedback').style.display = 'none';
  document.getElementById('quiz-next-btn').style.display = 'none';

  document.getElementById('quiz-options').innerHTML = qObj.options.map((opt, idx) => `
    <div class="card quiz-opt" style="padding:12px 14px; cursor:pointer; display:flex; align-items:center; gap:10px;" onclick="selectQuizOption(${idx}, this)">
      <div style="width:26px; height:26px; border-radius:50%; border:1.5px solid var(--border); display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; flex-shrink:0;">${String.fromCharCode(65 + idx)}</div>
      <span style="font-size:13.5px; font-weight:600;">${opt}</span>
    </div>
  `).join('');

  const timerEl = document.getElementById('quiz-timer');
  timerEl.textContent = '00:45';
  state.quizInterval = setInterval(() => {
    state.quizTimer--;
    timerEl.textContent = '00:' + String(Math.max(0, state.quizTimer)).padStart(2, '0');
    if (state.quizTimer <= 0) {
      clearInterval(state.quizInterval);
      if (!state.quizAnswered) {
        state.quizAnswered = true;
        document.getElementById('quiz-feedback').innerHTML = `<strong>Time's up!</strong> ${qObj.exp}`;
        document.getElementById('quiz-feedback').style.display = 'block';
        document.getElementById('quiz-next-btn').style.display = 'block';
      }
    }
  }, 1000);
}

function selectQuizOption(idx, el) {
  if (state.quizAnswered) return;
  state.quizAnswered = true;
  clearInterval(state.quizInterval);
  const qObj = QUIZ_QUESTIONS[state.quizIndex];
  const opts = document.querySelectorAll('.quiz-opt');

  if (idx === qObj.correct) {
    state.quizScore++;
    el.style.borderColor = 'var(--success)';
    el.style.background = 'var(--success-bg)';
  } else {
    el.style.borderColor = 'var(--danger)';
    el.style.background = 'var(--danger-bg)';
    opts[qObj.correct].style.borderColor = 'var(--success)';
    opts[qObj.correct].style.background = 'var(--success-bg)';
  }

  const fb = document.getElementById('quiz-feedback');
  fb.innerHTML = `<strong>${idx === qObj.correct ? 'Correct!' : 'Not quite.'}</strong> ${qObj.exp}`;
  fb.style.display = 'block';
  const nextBtn = document.getElementById('quiz-next-btn');
  nextBtn.textContent = state.quizIndex === QUIZ_QUESTIONS.length - 1 ? 'See Final Score' : 'Next Question →';
  nextBtn.style.display = 'block';
}

function nextQuizQuestion() {
  if (state.quizIndex < QUIZ_QUESTIONS.length - 1) {
    state.quizIndex++;
    renderQuizQuestion();
  } else {
    document.getElementById('quiz-question-view').style.display = 'none';
    document.getElementById('quiz-complete-view').style.display = 'block';
    document.getElementById('quiz-final-score').textContent = `You scored ${state.quizScore} / ${QUIZ_QUESTIONS.length}`;
  }
}

// AI Financial Assistant
let aiInitialized = false;
function initAIChat() {
  if (aiInitialized) return;
  aiInitialized = true;
  const safe = getSafeToSpend();
  const wrap = document.getElementById('ai-chat-messages');
  wrap.innerHTML = `
    <div class="chat-bubble ai">Hi ${state.user.name}! Your Safe-to-Spend today is <strong>${formatINR(safe)}</strong>. Ask me anything about your budget, outings, or savings goals.</div>
  `;
}

function askAIPreset(q) {
  document.getElementById('ai-input').value = q;
  sendAIMessage();
}

function sendAIMessage() {
  const input = document.getElementById('ai-input');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';

  const wrap = document.getElementById('ai-chat-messages');
  wrap.innerHTML += `<div class="chat-bubble user">${text}</div>`;

  const reply = generateAIReply(text);
  setTimeout(() => {
    wrap.innerHTML += `<div class="chat-bubble ai">${reply}</div>`;
    document.getElementById('screen-stage').scrollTop = document.getElementById('screen-stage').scrollHeight;
  }, 220);
}

function generateAIReply(q) {
  const lower = q.toLowerCase();
  const safe = getSafeToSpend();
  const spent = getMonthlySpent();
  const left = Math.max(0, state.budget - spent);
  const goa = state.goals[0];

  if (lower.includes('apr')) {
    return `<strong>APR (Annual Percentage Rate)</strong> is the yearly interest cost of borrowing (like on a credit card or loan). Lower APR = cheaper borrowing!`;
  }
  if (lower.includes('afford') || lower.includes('dinner') || lower.includes('outing')) {
    return `Your Safe-to-Spend today is <strong>${formatINR(safe)}</strong>. A campus canteen or street food dinner (~₹120–₹200) fits comfortably, while keeping ${formatINR(Math.max(0, safe - 180))} buffer.`;
  }
  if (lower.includes('where') || lower.includes('most') || lower.includes('spent')) {
    return `You've spent <strong>${formatINR(spent)}</strong> out of ${formatINR(state.budget)} this month. PG Rent and Food & Mess are your top categories. Cutting 2 food deliveries could save ~₹350/week.`;
  }
  if (lower.includes('goa') || lower.includes('goal')) {
    const pct = goa ? Math.round((goa.saved / goa.target) * 100) : 70;
    return `Your <strong>${goa ? goa.name : 'Goa Trip'}</strong> is <strong>${pct}%</strong> funded (${formatINR(goa.saved)} / ${formatINR(goa.target)}). Saving ₹500/week keeps you right on schedule!`;
  }
  if (lower.includes('save') || lower.includes('week')) {
    return `With ${formatINR(left)} left for the month, try the <strong>No-Spend Weekend</strong> or save ₹150–₹250 this week toward your Goa goal.`;
  }
  return `You have <strong>${formatINR(left)}</strong> left in your monthly budget (${formatINR(safe)}/day). Try asking about dinner affordability, top spending categories, or your Goa goal!`;
}

// Notifications
function renderNotifications() {
  document.getElementById('notifications-list').innerHTML = state.notifs.map(n => `
    <div class="card" onclick="openNotification(${n.id})" style="padding:12px 14px; cursor:pointer; background:${n.read ? '#fff' : 'var(--pale-green)'}; border-color:${n.read ? 'var(--border)' : 'var(--primary)'};">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:3px;">
        <strong style="font-size:13px;">${n.title}</strong>
        <span style="font-size:11px; color:var(--text-muted);">${n.time}</span>
      </div>
      <div style="font-size:12px; color:var(--text-muted);">${n.desc}</div>
    </div>
  `).join('');
}

function openNotification(id) {
  const n = state.notifs.find(x => x.id === id);
  if (n) {
    n.read = true;
    saveState();
    showScreen(n.screen || 'home');
  }
}

function markAllNotificationsRead() {
  state.notifs.forEach(n => { n.read = true; });
  saveState();
  renderNotifications();
  showToast('All notifications marked read');
}

// Profile & Accessibility
function renderProfile() {
  document.getElementById('profile-avatar').textContent = state.user.name.slice(0, 2).toUpperCase();
  document.getElementById('profile-name').textContent = state.user.fullName;
  document.getElementById('profile-campus').textContent = `${state.user.campus} · B.Tech CSE`;
  document.getElementById('profile-budget-input').value = state.budget;
  document.getElementById('pref-hide-bal').checked = state.prefs.hideBalance;
  document.getElementById('pref-hc').checked = state.prefs.highContrast;
  const cbSel = document.getElementById('pref-cb-select');
  if (cbSel) cbSel.value = state.prefs.cbPreset || (state.prefs.colorBlind ? 'cb-mode' : 'none');
  document.getElementById('widget-safe-preview').textContent = formatINR(getSafeToSpend());
}

function setColorBlindPreset(preset) {
  state.prefs.cbPreset = preset;
  state.prefs.colorBlind = preset !== 'none';
  saveState();
  applyPreferences();
  showToast(`Vision mode: ${preset === 'none' ? 'Default' : preset}`);
}

function filterLearnCategory(cat, btn) {
  btn.parentElement.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  renderLearn(cat);
}

function updateMonthlyBudget() {
  const val = Number(document.getElementById('profile-budget-input').value);
  if (!val || val < 1000) {
    showToast('Enter a budget of at least ₹1,000');
    return;
  }
  state.budget = val;
  saveState();
  renderProfile();
  renderHome();
  showToast(`Monthly budget updated to ${formatINR(val)}`);
}

function toggleAccessibility(cls, enabled) {
  if (cls === 'hc-mode') state.prefs.highContrast = enabled;
  if (cls === 'cb-mode') state.prefs.colorBlind = enabled;
  saveState();
  applyPreferences();
}

function setTextSize(size, btn) {
  state.prefs.textSize = size;
  btn.parentElement.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  saveState();
  applyPreferences();
}

function applyPreferences() {
  const phone = document.getElementById('phone-screen');
  phone.classList.toggle('hc-mode', state.prefs.highContrast);
  phone.classList.toggle('cb-mode', Boolean(state.prefs.colorBlind));
  phone.style.filter = state.prefs.cbPreset === 'achromatopsia' ? 'grayscale(100%)' : 'none';
  phone.classList.remove('text-sm', 'text-md', 'text-lg');
  phone.classList.add('text-' + (state.prefs.textSize || 'md'));
}

// Utility
function copyText(txt) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(txt).catch(() => {});
  }
  showToast('Copied to clipboard!');
}

function renderAll() {
  renderHome();
  renderActivity();
  renderGoals();
  renderLivingHub();
  renderLearn();
  renderNotifications();
  renderProfile();
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  applyPreferences();
  initOTPInputs();
  const dateInput = document.getElementById('manual-date');
  if (dateInput) dateInput.valueAsDate = new Date();
  renderAll();
});

// ==========================================
// 1-CLICK FEATURE SIMULATOR (FOR DEMO)
// ==========================================
let simInterval = null;
let simStepIndex = 0;

function setSimStatus(msg) {
  const el = document.getElementById('sim-status-text');
  if (!el) return;
  if (msg) {
    el.textContent = msg;
    el.classList.add('active');
  } else {
    el.textContent = '';
    el.classList.remove('active');
  }
}

function simVoiceExpense() {
  showScreen('add');
  const voiceTabBtn = document.querySelector('#add-tabs .seg-tab');
  if (voiceTabBtn) switchAddTab('voice', voiceTabBtn);
  simulateVoicePhrase('I spent 140 rupees on coffee');
  showToast('Simulated voice expense parsed: ₹140 Coffee');
}

function simPaymentNudge() {
  showScreen('send');
  document.getElementById('send-recipient').value = 'Priya Sharma (priya.sharma@okaxis)';
  document.getElementById('send-amount').value = 500;
  executeSendPayment();
  showToast('Simulated ₹500 payment + Goa goal nudge');
}

function simLowBudget() {
  state.txns.unshift({
    id: Date.now(),
    title: 'Semester Exam Fee & Lab Kit',
    category: 'Books & Printing',
    amount: 3200,
    type: 'expense',
    date: 'Today',
    method: 'UPI',
    note: 'Simulated high spend'
  });
  saveState();
  showScreen('home');
  showToast('Budget >70% used — Early Warning triggered!');
}

function toggleAutoSimulator() {
  const btn = document.getElementById('sim-toggle-btn');
  if (simInterval) {
    clearInterval(simInterval);
    simInterval = null;
    btn.innerHTML = '&#9654; Simulate All Features';
    btn.classList.remove('running');
    setSimStatus('');
    return;
  }

  const steps = [
    { label: 'Step 1/15: Welcome Screen', run: () => showScreen('welcome') },
    { label: 'Step 2/15: Student Login (+91)', run: () => showScreen('login') },
    { label: 'Step 3/15: OTP Verification', run: () => showScreen('otp') },
    { label: 'Step 4/15: Student Onboarding', run: () => { state.onboardStep = 1; updateOnboardUI(); showScreen('onboard'); } },
    { label: 'Step 5/15: Home Dashboard & Safe-to-Spend', run: () => showScreen('home') },
    { label: 'Step 6/15: Voice Expense Logging (₹140 Coffee)', run: () => simVoiceExpense() },
    { label: 'Step 7/15: Saving Expense & Activity Insights', run: () => { confirmAddExpense('voice'); showScreen('activity'); } },
    { label: 'Step 8/15: Send Money + Optional Goa Nudge', run: () => simPaymentNudge() },
    { label: 'Step 9/15: Accepting ₹20 Goa Round-Up & Goals', run: () => { acceptSavingsNudge(20); showScreen('goals'); } },
    { label: 'Step 10/15: Split & Settle (Flat 402 — ₹2,400)', run: () => showScreen('split') },
    { label: 'Step 11/15: Student Living Hub & Room Fund', run: () => showScreen('living') },
    { label: 'Step 12/15: Safety Mode (Essentials-Only)', run: () => showScreen('safety') },
    { label: 'Step 13/15: Social Helper (Outing Budget)', run: () => showScreen('social') },
    { label: 'Step 14/15: Money School & Lessons', run: () => showScreen('learn') },
    { label: 'Step 15/15: AI Financial Assistant', run: () => { showScreen('ai'); askAIPreset('Can I afford dinner outside today?'); } }
  ];

  simStepIndex = 0;
  btn.innerHTML = '&#9632; Stop Simulator';
  btn.classList.add('running');

  const runNext = () => {
    const step = steps[simStepIndex];
    setSimStatus(`Auto-Demo Running — ${step.label}`);
    step.run();
    simStepIndex++;
    if (simStepIndex >= steps.length) {
      clearInterval(simInterval);
      simInterval = null;
      setTimeout(() => {
        btn.innerHTML = '&#9654; Simulate All Features';
        btn.classList.remove('running');
        setSimStatus('Simulation complete! Tap any pill or button to explore.');
      }, 2200);
    }
  };

  runNext();
  simInterval = setInterval(runNext, 2600);
}
