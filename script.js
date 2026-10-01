/* ==========================================================================
   BRAIN ROT METER — script.js
   Dynamic Simulator · Interactive 10 Stages Spotlight · Carousel · FAQ
   ========================================================================== */

'use strict';

// ── Particle Canvas Animation ──────────────────────────
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles;
  const COLORS = ['#F59E0B', '#FBBF24', '#D97706', '#EA580C'];
  const COUNT = window.innerWidth < 768 ? 25 : 55;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x:     Math.random() * W,
      y:     Math.random() * H,
      vx:    (Math.random() - 0.5) * 0.3,
      vy:    (Math.random() - 0.5) * 0.3 - 0.1,
      r:     Math.random() * 1.8 + 0.6,
      alpha: Math.random() * 0.35 + 0.08,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };
  }

  function init() {
    particles = Array.from({ length: COUNT }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle   = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      p.x += p.vx;
      p.y += p.vy;

      if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
    });

    requestAnimationFrame(draw);
  }

  resize();
  init();
  draw();
  window.addEventListener('resize', () => { resize(); }, { passive: true });
})();


// ── Navbar Scroll & Mobile Toggle ──────────────────────
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('nav-toggle');
  const links  = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 30);
    }
  }, { passive: true });

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      const spans = toggle.querySelectorAll('span');
      const isOpen = links.classList.contains('open');
      if (spans.length >= 3) {
        spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px, 5px)' : '';
        spans[1].style.opacity   = isOpen ? '0' : '1';
        spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px, -5px)' : '';
      }
    });

    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        const spans = toggle.querySelectorAll('span');
        if (spans.length >= 3) {
          spans[0].style.transform = '';
          spans[1].style.opacity   = '1';
          spans[2].style.transform = '';
        }
      });
    });
  }
})();


// ── 10 Brain Stages Master Data ────────────────────────
const STAGES_DATA = [
  {
    num: 1,
    name: 'Perfectly Healthy',
    range: '0–10 reels',
    tierText: 'STAGE 01 OF 10 · 0–10 REELS TODAY',
    desc: 'Your brain is thriving. Natural focus is intact, attention spans are long, and cognitive vitality is at its peak. Keep it up!',
    count: 0,
    img: 'assets/brains/stage1.png',
    color: '#22C55E',
    halo: 'rgba(34, 197, 94, 0.4)',
    percent: 10
  },
  {
    num: 2,
    name: 'Slightly Distracted',
    range: '11–25 reels',
    tierText: 'STAGE 02 OF 10 · 11–25 REELS TODAY',
    desc: 'A few reels won’t hurt... probably. Minor dopamine craving begins, but work concentration remains recoverable.',
    count: 18,
    img: 'assets/brains/stage2.png',
    color: '#4ADE80',
    halo: 'rgba(74, 222, 128, 0.4)',
    percent: 20
  },
  {
    num: 3,
    name: 'Brain Fog',
    range: '26–50 reels',
    tierText: 'STAGE 03 OF 10 · 26–50 REELS TODAY',
    desc: 'The brain fog has started rolling in. Reading long sentences requires rereading, and short-term working memory blurs.',
    count: 38,
    img: 'assets/brains/stage3.png',
    color: '#FACC15',
    halo: 'rgba(250, 204, 21, 0.4)',
    percent: 30
  },
  {
    num: 4,
    name: 'Sleepy Mode',
    range: '51–75 reels',
    tierText: 'STAGE 04 OF 10 · 51–75 REELS TODAY',
    desc: 'Your attention span is getting sleepy. Heavy eyelids, glazed stare, and involuntary thumb swipes replace conscious browsing.',
    count: 65,
    img: 'assets/brains/stage4.png',
    color: '#F59E0B',
    halo: 'rgba(245, 158, 11, 0.4)',
    percent: 40
  },
  {
    num: 5,
    name: 'Overstimulated',
    range: '76–100 reels',
    tierText: 'STAGE 05 OF 10 · 76–100 REELS TODAY',
    desc: 'Too much dopamine, not enough focus. Your mind jumps between fragmented thoughts every 3 seconds.',
    count: 90,
    img: 'assets/brains/stage5.png',
    color: '#FB923C',
    halo: 'rgba(251, 146, 60, 0.45)',
    percent: 50
  },
  {
    num: 6,
    name: 'Fried',
    range: '101–150 reels',
    tierText: 'STAGE 06 OF 10 · 101–150 REELS TODAY',
    desc: 'Officially fried. Concentration unavailable. You close Instagram only to immediately tap and reopen it by reflex.',
    count: 130,
    img: 'assets/brains/stage6.png',
    color: '#EA580C',
    halo: 'rgba(234, 88, 12, 0.45)',
    percent: 60
  },
  {
    num: 7,
    name: 'Damaged',
    range: '151–250 reels',
    tierText: 'STAGE 07 OF 10 · 151–250 REELS TODAY',
    desc: 'Brain damage detected. Touching grass recommended immediately. Severe dopamine burnout and time blindness in effect.',
    count: 210,
    img: 'assets/brains/stage7.png',
    color: '#EF4444',
    halo: 'rgba(239, 68, 68, 0.5)',
    percent: 70
  },
  {
    num: 8,
    name: 'Rotting',
    range: '251–400 reels',
    tierText: 'STAGE 08 OF 10 · 251–400 REELS TODAY',
    desc: 'The rot is spreading rapidly. Half a workday spent watching strangers dance and loop 7-second audio clips.',
    count: 340,
    img: 'assets/brains/stage8.png',
    color: '#DC2626',
    halo: 'rgba(220, 38, 38, 0.55)',
    percent: 80
  },
  {
    num: 9,
    name: 'Critical',
    range: '401–600 reels',
    tierText: 'STAGE 09 OF 10 · 401–600 REELS TODAY',
    desc: 'Critical condition. Seek sunlight immediately. Hours have evaporated, phone is boiling hot, eyes are dry and stinging.',
    count: 520,
    img: 'assets/brains/stage9.png',
    color: '#E11D48',
    halo: 'rgba(225, 29, 72, 0.55)',
    percent: 90
  },
  {
    num: 10,
    name: 'Dead Brain',
    range: '601+ reels',
    tierText: 'STAGE 10 OF 10 · 601+ REELS TODAY',
    desc: 'Brain status: deceased. Scroll status: active. Consciousness uploaded. You are the content; the content is you.',
    count: 720,
    img: 'assets/brains/stage10.png',
    color: '#A855F7',
    halo: 'rgba(168, 85, 247, 0.6)',
    percent: 100
  },
];

// Preload stage artwork to avoid flicker
STAGES_DATA.forEach(s => {
  const im = new Image();
  im.src = s.img;
});


// ── Hero Simulator Engine ──────────────────────────────
(function initSimulator() {
  const brainImg    = document.getElementById('sim-brain-img');
  const counterEl   = document.getElementById('sim-counter');
  const stageNameEl = document.getElementById('sim-stage-name');
  const stageRangeEl= document.getElementById('sim-stage-range');
  const haloEl      = document.getElementById('sim-halo');
  const scrubber    = document.getElementById('sim-scrubber');

  if (!brainImg || !counterEl || !stageNameEl) return;

  let current = 0;
  let displayCount = 0;
  let counterInterval;
  let cycleTimer;

  function animateCounter(target) {
    clearInterval(counterInterval);
    const step = Math.max(1, Math.ceil(Math.abs(target - displayCount) / 16));
    counterInterval = setInterval(() => {
      if (Math.abs(displayCount - target) <= step) {
        displayCount = target;
        counterEl.textContent = displayCount;
        clearInterval(counterInterval);
      } else {
        displayCount += displayCount < target ? step : -step;
        counterEl.textContent = displayCount;
      }
    }, 25);
  }

  function applyStage(idx) {
    current = idx;
    const s = STAGES_DATA[idx];

    // Smooth image transition
    brainImg.style.transform = 'scale(0.9)';
    brainImg.style.opacity   = '0.4';

    setTimeout(() => {
      brainImg.src = s.img;
      brainImg.alt = `Stage ${s.num}: ${s.name}`;
      brainImg.style.transform = '';
      brainImg.style.opacity   = '1';
    }, 150);

    // Text updates
    stageNameEl.textContent = `Stage ${s.num} · ${s.name}`;
    stageNameEl.style.color = s.color;
    if (stageRangeEl) stageRangeEl.textContent = s.range;

    // Halo glow
    if (haloEl) {
      haloEl.style.background = `radial-gradient(circle, ${s.halo} 0%, transparent 70%)`;
    }

    // Pips in scrubber
    if (scrubber) {
      const pips = scrubber.querySelectorAll('.scrub-pip');
      pips.forEach((p, i) => {
        p.classList.toggle('active', i === idx);
      });
    }

    animateCounter(s.count);
  }

  function startCycle() {
    clearInterval(cycleTimer);
    cycleTimer = setInterval(() => {
      current = (current + 1) % STAGES_DATA.length;
      applyStage(current);
    }, 3200);
  }

  window.selectSimulatorStage = function(idx) {
    if (idx >= 0 && idx < STAGES_DATA.length) {
      applyStage(idx);
      startCycle();
    }
  };

  applyStage(0);
  startCycle();
})();


// ── 10 Stages Spotlight Viewer ─────────────────────────
(function initSpotlight() {
  const spotlightImg  = document.getElementById('spotlight-img');
  const spotlightHalo = document.getElementById('spotlight-halo');
  const tierEl        = document.getElementById('spotlight-tier');
  const nameEl        = document.getElementById('spotlight-name');
  const descEl        = document.getElementById('spotlight-desc');
  const fillEl        = document.getElementById('spotlight-fill');
  const railCards     = document.querySelectorAll('.stage-pip-card');

  if (!spotlightImg || !nameEl) return;

  window.setSpotlightStage = function(idx) {
    if (idx < 0 || idx >= STAGES_DATA.length) return;
    const s = STAGES_DATA[idx];

    // Image transition
    spotlightImg.style.transform = 'scale(0.92)';
    spotlightImg.style.opacity   = '0.35';

    setTimeout(() => {
      spotlightImg.src = s.img;
      spotlightImg.alt = s.name;
      spotlightImg.style.transform = '';
      spotlightImg.style.opacity   = '1';
    }, 140);

    // Text updates
    if (tierEl) tierEl.textContent = s.tierText;
    nameEl.textContent = s.name;
    nameEl.style.color = s.color;
    if (descEl) descEl.textContent = s.desc;

    // Meter bar
    if (fillEl) {
      fillEl.style.width = `${s.percent}%`;
      fillEl.style.background = s.color;
    }

    // Halo glow
    if (spotlightHalo) {
      spotlightHalo.style.background = `radial-gradient(circle, ${s.halo} 0%, transparent 70%)`;
    }

    // Rail cards active state
    railCards.forEach((c, i) => {
      c.classList.toggle('active', i === idx);
    });
  };
})();


// ── Animated Stat Counters ─────────────────────────────
(function initStatCounters() {
  const nums = document.querySelectorAll('.stat-num[data-target]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      const dur    = 1400;
      const start  = performance.now();

      function update(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / dur, 1);
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        el.textContent = Math.floor(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(update);
      }

      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.35 });

  nums.forEach(el => observer.observe(el));
})();


// ── Phone Mockups Carousel ─────────────────────────────
(function initCarousel() {
  const track  = document.getElementById('carousel-track');
  const prev   = document.getElementById('carousel-prev');
  const next   = document.getElementById('carousel-next');
  const dotsEl = document.getElementById('carousel-dots');

  if (!track) return;

  const cards = track.querySelectorAll('.phone-mockup');
  const total = cards.length;
  let current = 0;

  dotsEl.innerHTML = '';
  cards.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', `Go to slide ${i + 1}`);
    d.addEventListener('click', () => go(i));
    dotsEl.appendChild(d);
  });

  function getCardWidth() {
    const card = cards[0];
    const style = getComputedStyle(track);
    const gap = parseInt(style.gap) || 32;
    return card.offsetWidth + gap;
  }

  function go(idx) {
    current = ((idx % total) + total) % total;
    const offset = -current * getCardWidth();
    track.style.transform = `translateX(${offset}px)`;

    dotsEl.querySelectorAll('.carousel-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  prev && prev.addEventListener('click', () => go(current - 1));
  next && next.addEventListener('click', () => go(current + 1));

  // Touch swipes
  let touchStartX = 0;
  track.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) {
      go(dx < 0 ? current + 1 : current - 1);
    }
  });

  // Autoplay
  let autoplay = setInterval(() => go(current + 1), 4500);

  [prev, next].forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        clearInterval(autoplay);
        autoplay = setInterval(() => go(current + 1), 4500);
      });
    }
  });
})();


// ── FAQ Accordion ──────────────────────────────────────
(function initFAQ() {
  const items = document.querySelectorAll('.faq-item');

  items.forEach(item => {
    const btn    = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      items.forEach(i => {
        i.classList.remove('open');
        const ans = i.querySelector('.faq-answer');
        if (ans) ans.style.maxHeight = '0';
      });

      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
})();


// ── Scroll Reveal Observer ─────────────────────────────
(function initReveal() {
  const items = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || 0);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => observer.observe(el));
})();
