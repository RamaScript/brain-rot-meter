/* =============================================
   BRAIN ROT METER — script.js
   Dynamic 10-Stage Simulator · Hugeicons Integration · Interactive UX
   ============================================= */

'use strict';

// ── Particles Canvas ──────────────────────────
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles;

  const COLORS = ['#8B4513', '#C4873A', '#F4D7A1', '#FFC98B', '#a0522d'];
  const COUNT = window.innerWidth < 768 ? 35 : 70;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x:     Math.random() * W,
      y:     Math.random() * H,
      vx:    (Math.random() - 0.5) * 0.35,
      vy:    (Math.random() - 0.5) * 0.35 - 0.12,
      r:     Math.random() * 2 + 0.6,
      alpha: Math.random() * 0.45 + 0.1,
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


// ── Navbar Scroll State & Mobile Menu ─────────
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

    // Close menu when a link is clicked
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


// ── Hero 10-Stage Brain Cycle & Simulator ─────
(function initHeroBrain() {
  const brainImg    = document.getElementById('hero-brain-img');
  const heroCounter = document.getElementById('hero-counter');
  const stageLabel  = document.getElementById('stage-label');
  const stageSub    = document.getElementById('stage-sub');
  const brainGlow   = document.getElementById('hero-brain-glow');

  if (!brainImg || !heroCounter || !stageLabel) return;

  const stages = [
    { num: 1,  label: 'Perfectly Healthy', count: 0,   img: 'assets/brains/stage1.png',  range: '0–10 reels today',   glow: 'rgba(76, 175, 80, 0.45)',   color: '#4CAF50' },
    { num: 2,  label: 'Slightly Distracted', count: 18, img: 'assets/brains/stage2.png', range: '11–25 reels today',  glow: 'rgba(102, 187, 106, 0.45)', color: '#66BB6A' },
    { num: 3,  label: 'Brain Fog',          count: 38,  img: 'assets/brains/stage3.png', range: '26–50 reels today',  glow: 'rgba(253, 216, 53, 0.45)',  color: '#FDD835' },
    { num: 4,  label: 'Sleepy Mode',        count: 65,  img: 'assets/brains/stage4.png', range: '51–75 reels today',  glow: 'rgba(255, 179, 0, 0.45)',   color: '#FFB300' },
    { num: 5,  label: 'Overstimulated',     count: 90,  img: 'assets/brains/stage5.png', range: '76–100 reels today', glow: 'rgba(251, 140, 0, 0.5)',    color: '#FB8C00' },
    { num: 6,  label: 'Fried',              count: 130, img: 'assets/brains/stage6.png', range: '101–150 reels today', glow: 'rgba(244, 81, 30, 0.5)',   color: '#F4511E' },
    { num: 7,  label: 'Damaged',            count: 210, img: 'assets/brains/stage7.png', range: '151–250 reels today', glow: 'rgba(229, 57, 53, 0.55)',  color: '#E53935' },
    { num: 8,  label: 'Rotting',            count: 340, img: 'assets/brains/stage8.png', range: '251–400 reels today', glow: 'rgba(211, 47, 47, 0.6)',   color: '#D32F2F' },
    { num: 9,  label: 'Critical',           count: 520, img: 'assets/brains/stage9.png', range: '401–600 reels today', glow: 'rgba(194, 24, 91, 0.6)',   color: '#C2185B' },
    { num: 10, label: 'Dead Brain',         count: 720, img: 'assets/brains/stage10.png', range: '601+ reels today',  glow: 'rgba(156, 39, 176, 0.65)', color: '#9C27B0' },
  ];

  // Preload stage artwork to guarantee instantaneous transitions
  stages.forEach(s => {
    const im = new Image();
    im.src = s.img;
  });

  let current = 0;
  let displayCount = 0;
  let counterInterval;
  let cycleTimer;

  function animateCount(target) {
    clearInterval(counterInterval);
    const step = Math.max(1, Math.ceil(Math.abs(target - displayCount) / 18));
    counterInterval = setInterval(() => {
      if (Math.abs(displayCount - target) <= step) {
        displayCount = target;
        heroCounter.textContent = displayCount;
        clearInterval(counterInterval);
      } else {
        displayCount += displayCount < target ? step : -step;
        heroCounter.textContent = displayCount;
      }
    }, 25);
  }

  function goToStage(idx) {
    current = idx;
    const s = stages[idx];

    // Subtle breathing transition
    brainImg.style.transform = 'scale(0.88)';
    brainImg.style.opacity   = '0.4';

    setTimeout(() => {
      brainImg.src = s.img;
      brainImg.alt = `Stage ${s.num}: ${s.label}`;
      brainImg.style.transform = '';
      brainImg.style.opacity   = '1';
    }, 180);

    // Update Stage Label & Subtext
    stageLabel.style.opacity = '0';
    setTimeout(() => {
      stageLabel.textContent = `Stage ${s.num} · ${s.label}`;
      stageLabel.style.color = s.color;
      stageLabel.style.opacity = '1';
      if (stageSub) {
        stageSub.textContent = s.range;
      }
    }, 150);

    // Update Ambient Glow Color
    if (brainGlow) {
      brainGlow.style.background = `radial-gradient(circle, ${s.glow} 0%, transparent 70%)`;
    }

    animateCount(s.count);
  }

  function startCycle() {
    clearInterval(cycleTimer);
    cycleTimer = setInterval(() => {
      current = (current + 1) % stages.length;
      goToStage(current);
    }, 2800);
  }

  // Global selector for stage cards click
  window.selectStage = function(idx) {
    if (idx >= 0 && idx < stages.length) {
      goToStage(idx);
      // Restart timer so user has time to view the chosen stage
      startCycle();
      const heroEl = document.getElementById('hero');
      if (heroEl && window.innerWidth < 768) {
        heroEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  goToStage(0);
  startCycle();
})();


// ── Scroll Reveal ─────────────────────────────
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


// ── Animated Stat Counters ────────────────────
(function initStatCounters() {
  const nums = document.querySelectorAll('.stat-num[data-target]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      const dur    = 1500;
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


// ── Phone Mockups Carousel ────────────────────
(function initCarousel() {
  const track  = document.getElementById('carousel-track');
  const prev   = document.getElementById('carousel-prev');
  const next   = document.getElementById('carousel-next');
  const dotsEl = document.getElementById('carousel-dots');

  if (!track) return;

  const cards  = track.querySelectorAll('.phone-mockup');
  const total  = cards.length;
  let current  = 0;

  // Build dots
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
    const gap   = parseInt(style.gap) || 24;
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

  // Touch swipe support
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


// ── FAQ Accordion ─────────────────────────────
(function initFAQ() {
  const items = document.querySelectorAll('.faq-item');

  items.forEach(item => {
    const btn    = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all other items
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


// ── Subtle Parallax on Desktop ────────────────
(function initParallax() {
  const heroContent = document.querySelector('.hero-content');
  const heroVisual  = document.querySelector('.hero-visual');

  if (!heroContent || window.innerWidth < 800) return;

  window.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    heroContent.style.transform = `translate(${dx * -5}px, ${dy * -3}px)`;
    heroVisual.style.transform  = `translate(${dx * 8}px, ${dy * 5}px)`;
  });
})();
