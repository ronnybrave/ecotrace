/* ============================================
   ECOTRACE — Main JavaScript
   ============================================ */

// ── Nav scroll behavior ──────────────────────
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

// ── Mobile menu ──────────────────────────────
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileClose = document.querySelector('.mobile-close');
hamburger?.addEventListener('click', () => mobileMenu.classList.add('open'));
mobileClose?.addEventListener('click', () => mobileMenu.classList.remove('open'));
document.querySelectorAll('.mobile-menu a').forEach(a => {
  a.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ── Dark mode toggle ──────────────────────────
const darkToggle = document.querySelector('.dark-toggle');
let dark = false;
darkToggle?.addEventListener('click', () => {
  dark = !dark;
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : '');
  darkToggle.textContent = dark ? '☀️' : '🌙';
});

// ── AOS (Scroll animations) ───────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.getAttribute('data-delay') || 0;
      setTimeout(() => entry.target.classList.add('aos-animate'), parseInt(delay));
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));

// ── Counter animation ─────────────────────────
function animateCounter(el, target, duration = 2000, suffix = '') {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.floor(current).toLocaleString() + suffix;
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.counted) {
      entry.target.dataset.counted = 'true';
      const target = parseInt(entry.target.dataset.target);
      const suffix = entry.target.dataset.suffix || '';
      animateCounter(entry.target, target, 2000, suffix);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

// ── Satellite comparison slider ───────────────
function initComparisonSliders() {
  document.querySelectorAll('.comparison-slider-wrap').forEach(wrap => {
    const after = wrap.querySelector('.comp-after');
    const line = wrap.querySelector('.comp-line');
    let dragging = false;

    function setPosition(x) {
      const rect = wrap.getBoundingClientRect();
      const pct = Math.min(Math.max((x - rect.left) / rect.width * 100, 5), 95);
      after.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
      line.style.left = `${pct}%`;
    }

    wrap.addEventListener('mousedown', e => { dragging = true; setPosition(e.clientX); });
    window.addEventListener('mousemove', e => { if (dragging) setPosition(e.clientX); });
    window.addEventListener('mouseup', () => { dragging = false; });
    wrap.addEventListener('touchstart', e => { dragging = true; setPosition(e.touches[0].clientX); });
    window.addEventListener('touchmove', e => { if (dragging) setPosition(e.touches[0].clientX); });
    window.addEventListener('touchend', () => { dragging = false; });
  });

  // Hero satellite comparison
  const heroSlider = document.querySelector('.sat-divider');
  const heroAfter = document.querySelector('.sat-img-after');
  if (heroSlider && heroAfter) {
    let dragging = false;
    const wrap = document.querySelector('.sat-img-compare');

    function setHeroPos(x) {
      const rect = wrap.getBoundingClientRect();
      const pct = Math.min(Math.max((x - rect.left) / rect.width * 100, 5), 95);
      heroAfter.style.clipPath = `inset(0 0 0 ${pct}%)`;
      heroSlider.style.left = `${pct}%`;
    }

    wrap.addEventListener('mousedown', e => { dragging = true; setHeroPos(e.clientX); });
    window.addEventListener('mousemove', e => { if (dragging) setHeroPos(e.clientX); });
    window.addEventListener('mouseup', () => { dragging = false; });
    wrap.addEventListener('touchstart', e => { dragging = true; setHeroPos(e.touches[0].clientX); });
    window.addEventListener('touchmove', e => { if (dragging) setHeroPos(e.touches[0].clientX); });
    window.addEventListener('touchend', () => { dragging = false; });
  }
}

// ── Load group cards from JSON ────────────────
async function loadGroups() {
  try {
    const res = await fetch('data/mock-data.json');
    const data = await res.json();
    renderGroups(data.groups);
    updateHeroStats(data.stats);
    return data;
  } catch (e) {
    console.warn('Could not load mock data, using inline data');
    return null;
  }
}

function renderGroups(groups) {
  const container = document.getElementById('group-cards');
  if (!container) return;
  container.innerHTML = groups.map(g => `
    <div class="group-card" data-aos="fade-up" data-delay="${(groups.indexOf(g) % 3) * 100}">
      <div class="group-card-header">
        <div class="group-avatar">${getGroupEmoji(g.id)}</div>
        <div>
          <div class="group-name">${g.name}</div>
          <div class="group-location">📍 ${g.location}</div>
        </div>
        <span class="group-status status-${g.status}">${g.status}</span>
      </div>
      <div class="group-metrics">
        <div class="group-metric">
          <div class="group-metric-val">${formatNum(g.treesPlanted)}</div>
          <div class="group-metric-key">Trees</div>
        </div>
        <div class="group-metric">
          <div class="group-metric-val">${g.areaCovered}</div>
          <div class="group-metric-key">Area</div>
        </div>
        <div class="group-metric">
          <div class="group-metric-val">${g.members}</div>
          <div class="group-metric-key">Members</div>
        </div>
      </div>
      <div class="group-progress">
        <div class="group-progress-label">
          <span>Green Cover Increase</span>
          <span>${g.greenIncrease}%</span>
        </div>
        <div class="progress-bar-outer">
          <div class="progress-bar-inner" style="width: 0%" data-width="${g.greenIncrease}%"></div>
        </div>
      </div>
    </div>
  `).join('');

  // Animate progress bars after render
  setTimeout(() => {
    document.querySelectorAll('.progress-bar-inner').forEach(bar => {
      bar.style.width = bar.dataset.width;
    });
  }, 300);

  // Re-observe new cards
  document.querySelectorAll('.group-card[data-aos]').forEach(el => observer.observe(el));
}

function getGroupEmoji(id) {
  const emojis = ['🌳', '🌿', '🌲', '🌱', '🍃', '🌴'];
  return emojis[(id - 1) % emojis.length];
}

function formatNum(n) {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
}

function updateHeroStats(stats) {
  const els = {
    'stat-trees': stats.totalTrees,
    'stat-ngos': stats.ngosRegistered,
    'stat-cities': stats.citiesCovered
  };
  // Will be picked up by counter observer
}

// ── Leaflet Map ───────────────────────────────
function initMap(groups) {
  if (!window.L || !document.getElementById('plantation-map')) return;

  const map = L.map('plantation-map', {
    center: [20.5937, 78.9629],
    zoom: 5,
    zoomControl: true,
    attributionControl: false
  });

  // Dark tile layer
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19
  }).addTo(map);

  // Custom marker
  const greenIcon = L.divIcon({
    className: '',
    html: `<div style="width:12px;height:12px;background:#22c55e;border-radius:50%;
           box-shadow:0 0 12px rgba(34,197,94,0.8),0 0 24px rgba(34,197,94,0.4);
           border:2px solid #86efac;"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6]
  });

  const mockGroups = groups || [
    { name: 'Green Roots India', location: 'Bengaluru, Karnataka', lat: 12.9716, lng: 77.5946, treesPlanted: 45200, status: 'active' },
    { name: 'Forest Brigade Delhi', location: 'New Delhi', lat: 28.6139, lng: 77.2090, treesPlanted: 67500, status: 'active' },
    { name: 'EcoWarriors Pune', location: 'Pune, Maharashtra', lat: 18.5204, lng: 73.8567, treesPlanted: 31800, status: 'active' },
    { name: 'Mumbai Greens', location: 'Mumbai', lat: 19.0760, lng: 72.8777, treesPlanted: 28900, status: 'monitoring' },
    { name: 'Hyderabad TreeForce', location: 'Hyderabad', lat: 17.3850, lng: 78.4867, treesPlanted: 52100, status: 'active' },
    { name: 'Chennai Canopy', location: 'Chennai', lat: 13.0827, lng: 80.2707, treesPlanted: 19400, status: 'active' }
  ];

  mockGroups.forEach(g => {
    const marker = L.marker([g.lat, g.lng], { icon: greenIcon }).addTo(map);
    marker.bindPopup(`
      <div class="map-popup">
        <div class="map-popup-title">${g.name}</div>
        <div class="map-popup-row">📍 ${g.location}</div>
        <div class="map-popup-row">🌳 <strong>${g.treesPlanted?.toLocaleString()}</strong> trees planted</div>
        <div class="map-popup-row">🔬 AI Analysis: <span style="color:#22c55e">Active</span></div>
        <div class="map-popup-row" style="margin-top:8px">
          <span style="background:#22c55e22;color:#22c55e;padding:2px 8px;border-radius:10px;font-size:0.7rem;font-weight:600;">${g.status?.toUpperCase()}</span>
        </div>
      </div>
    `);
  });
}

// ── Chart.js charts ───────────────────────────
function initCharts() {
  if (!window.Chart) return;

  // Growth chart
  const growthCtx = document.getElementById('growth-chart');
  if (growthCtx) {
    new Chart(growthCtx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov', 'Dec'],
        datasets: [{
          label: 'Green Cover %',
          data: [5, 12, 22, 31, 38, 44, 48],
          borderColor: '#22c55e',
          backgroundColor: 'rgba(34,197,94,0.08)',
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#22c55e',
          pointRadius: 4,
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: 'rgba(255,255,255,0.4)', font: { size: 10 } } },
          y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: 'rgba(255,255,255,0.4)', font: { size: 10 } } }
        }
      }
    });
  }

  // Survival doughnut
  const survivalCtx = document.getElementById('survival-chart');
  if (survivalCtx) {
    new Chart(survivalCtx, {
      type: 'doughnut',
      data: {
        labels: ['Survived', 'Lost', 'Monitoring'],
        datasets: [{
          data: [76, 12, 12],
          backgroundColor: ['#22c55e', '#f87171', '#fbbf24'],
          borderWidth: 0,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        cutout: '72%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: 'rgba(255,255,255,0.5)', font: { size: 10 }, padding: 12, boxWidth: 10 }
          }
        }
      }
    });
  }
}

// ── Impact Calculator ─────────────────────────
function initCalculator() {
  const treeInput = document.getElementById('calc-trees');
  const areaInput = document.getElementById('calc-area');
  const treeVal = document.getElementById('calc-tree-val');
  const areaVal = document.getElementById('calc-area-val');
  const co2El = document.getElementById('calc-co2');
  const o2El = document.getElementById('calc-o2');
  const tempEl = document.getElementById('calc-temp');

  function calculate() {
    const trees = parseInt(treeInput?.value || 100);
    const area = parseInt(areaInput?.value || 5);
    if (treeVal) treeVal.textContent = trees.toLocaleString();
    if (areaVal) areaVal.textContent = area;
    // Avg tree absorbs ~22kg CO2/year
    const co2 = (trees * 22 / 1000).toFixed(1);
    // Each tree produces ~100kg O2/year
    const o2 = (trees * 100 / 1000).toFixed(1);
    // 0.1°C per 1000 trees rough estimate
    const temp = (trees * 0.0001).toFixed(2);
    if (co2El) co2El.textContent = co2 + 't';
    if (o2El) o2El.textContent = o2 + 't';
    if (tempEl) tempEl.textContent = temp + '°C';
  }

  treeInput?.addEventListener('input', calculate);
  areaInput?.addEventListener('input', calculate);
  calculate();
}

// ── Form validation ───────────────────────────
function initForm() {
  const form = document.getElementById('register-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    form.querySelectorAll('[required]').forEach(field => {
      const err = field.nextElementSibling;
      if (!field.value.trim()) {
        field.classList.add('error');
        if (err?.classList.contains('form-error')) { err.style.display = 'block'; }
        valid = false;
      } else {
        field.classList.remove('error');
        if (err?.classList.contains('form-error')) { err.style.display = 'none'; }
      }
    });

    // Email validation
    const emailField = form.querySelector('[type="email"]');
    if (emailField?.value && !/\S+@\S+\.\S+/.test(emailField.value)) {
      emailField.classList.add('error');
      valid = false;
    }

    if (valid) {
      const btn = form.querySelector('.form-submit');
      btn.textContent = '✅ Registration Submitted!';
      btn.style.background = '#22c55e';
      setTimeout(() => { btn.textContent = 'Register Your Group'; btn.style.background = ''; }, 3000);
      form.reset();
    }
  });
}

// ── Progress bars on scroll ───────────────────
const progressObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.progress-bar-inner').forEach(bar => {
        bar.style.width = bar.dataset.width || bar.style.width;
      });
    }
  });
}, { threshold: 0.3 });

// ── Mini bar chart for dashboard ─────────────
function initMiniChart() {
  const values = [42, 68, 55, 82, 91, 74, 88, 95, 78, 86, 93, 99];
  const months = ['J','F','M','A','M','J','J','A','S','O','N','D'];
  const container = document.getElementById('mini-bar-chart');
  if (!container) return;

  const max = Math.max(...values);
  container.innerHTML = values.map((v, i) => `
    <div class="bar-col" style="height:${(v/max)*100}%;" data-val="${months[i]}" title="${months[i]}: ${v}K trees"></div>
  `).join('');
}

// ── Init all ──────────────────────────────────
window.addEventListener('DOMContentLoaded', async () => {
  const data = await loadGroups();
  const groups = data?.groups;
  
  initComparisonSliders();
  initCalculator();
  initForm();
  initMiniChart();

  // Load Leaflet dynamically
  if (!window.L) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => initMap(groups);
    document.head.appendChild(script);
  } else {
    initMap(groups);
  }

  // Load Chart.js dynamically
  if (!window.Chart) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
    script.onload = initCharts;
    document.head.appendChild(script);
  } else {
    initCharts();
  }
});
