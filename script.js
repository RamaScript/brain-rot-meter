/* =============================================
   BRAIN ROT METER — script.js
   Particles · Animations · Counters · Carousel
   ============================================= */

'use strict';

// ── Particles Canvas ──────────────────────────
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles;

  const COLORS = ['#8B4513', '#F4D7A1', '#FFC98B', '#a0522d'];
  const COUNT = window.innerWidth < 768 ? 40 : 80;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x:     Math.random() * W,
      y:     Math.random() * H,
      vx:    (Math.random() - 0.5) * 0.4,
      vy:    (Math.random() - 0.5) * 0.4 - 0.15,
      r:     Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.5 + 0.1,
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
  window.addEventListener('resize', () => { resize(); });
})();


// ── Navbar Scroll State ───────────────────────
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('nav-toggle');
  const links  = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  toggle && toggle.addEventListener('click', () => {
    links.classList.toggle('open');
    const spans = toggle.querySelectorAll('span');
    const isOpen = links.classList.contains('open');
    spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px, 5px)' : '';
    spans[1].style.opacity   = isOpen ? '0' : '1';
    spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px, -5px)' : '';
  });

  // Close menu on link click
  links && links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.querySelectorAll('span').forEach(s => {
        s.style.transform = '';
        s.style.opacity   = '1';
      });
    });
  });
})();


// ── Hero Brain Stages Cycle ───────────────────
(function initHeroBrain() {
  const brainEmoji  = document.getElementById('brain-emoji');
  const heroCounter = document.getElementById('hero-counter');
  const stageLabel  = document.getElementById('stage-label');

  const stages = [
    { emoji: '🧠', label: 'Healthy',        count: 0   },
    { emoji: '😐', label: 'Distracted',     count: 10  },
    { emoji: '🌫️', label: 'Brain Fog',      count: 25  },
    { emoji: '😴', label: 'Tired',          count: 45  },
    { emoji: '⚡', label: 'Overstimulated', count: 70  },
    { emoji: '🍳', label: 'Fried',          count: 100 },
    { emoji: '💀', label: 'Damaged',        count: 140 },
    { emoji: '🦠', label: 'Rotting',        count: 190 },
    { emoji: '☢️', label: 'Critical',       count: 250 },
    { emoji: '⬛', label: 'Dead Brain',     count: 320 },
  ];

  let current = 0;
  let displayCount = 0;
  let counterInterval;

  function animateCount(target) {
    clearInterval(counterInterval);
    const step = Math.max(1, Math.ceil(Math.abs(target - displayCount) / 20));
    counterInterval = setInterval(() => {
      if (Math.abs(displayCount - target) <= step) {
        displayCount = target;
        heroCounter.textContent = displayCount;
        clearInterval(counterInterval);
      } else {
        displayCount += displayCount < target ? step : -step;
        heroCounter.textContent = displayCount;
      }
    }, 30);
  }

  function goToStage(idx) {
    const s = stages[idx];
    brainEmoji.style.transform = 'scale(0.85) rotate(-5deg)';
    brainEmoji.style.filter    = 'blur(4px) drop-shadow(0 0 20px rgba(244,215,161,0.4))';

    setTimeout(() => {
      brainEmoji.textContent = s.emoji;
      brainEmoji.style.transform = '';
      brainEmoji.style.filter    = 'drop-shadow(0 0 30px rgba(244,215,161,0.4))';
    }, 250);

    stageLabel.style.opacity = '0';
    setTimeout(() => {
      stageLabel.textContent = `Stage ${idx + 1} – ${s.label}`;
      stageLabel.style.opacity = '0.8';
    }, 200);

    animateCount(s.count);
  }

  // Auto-cycle through stages
  setInterval(() => {
    current = (current + 1) % stages.length;
    goToStage(current);
  }, 2200);

  goToStage(0);
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
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

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
      const dur    = 1600;
      const start  = performance.now();

      function update(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / dur, 1);
        // easeOutExpo
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        el.textContent = Math.floor(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(update);
      }

      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.4 });

  nums.forEach(el => observer.observe(el));
})();


// ── Carousel ──────────────────────────────────
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
    const gap   = parseInt(style.gap) || 32;
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

  // Touch swipe
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) go(dx < 0 ? current + 1 : current - 1);
  });

  // Autoplay
  let autoplay = setInterval(() => go(current + 1), 4000);

  [prev, next].forEach(btn => {
    btn && btn.addEventListener('click', () => {
      clearInterval(autoplay);
      autoplay = setInterval(() => go(current + 1), 4000);
    });
  });
})();


// ── FAQ Accordion ─────────────────────────────
(function initFAQ() {
  const items = document.querySelectorAll('.faq-item');

  items.forEach(item => {
    const btn    = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      items.forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-answer').style.maxHeight = '0';
      });

      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
})();


// ── Smooth Parallax on Mouse Move ────────────
(function initParallax() {
  const heroContent = document.querySelector('.hero-content');
  const heroVisual  = document.querySelector('.hero-visual');

  if (!heroContent || window.innerWidth < 768) return;

  window.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    heroContent.style.transform = `translate(${dx * -6}px, ${dy * -4}px)`;
    heroVisual.style.transform  = `translate(${dx * 10}px, ${dy * 6}px)`;
  });
})();


// ── Download Button Sparkle ───────────────────
(function initDownloadSparkle() {
  const btn = document.querySelector('.btn-large');
  if (!btn) return;

  btn.addEventListener('click', (e) => {
    const rect = btn.getBoundingClientRect();
    const cx   = e.clientX - rect.left;
    const cy   = e.clientY - rect.top;

    for (let i = 0; i < 10; i++) {
      const spark = document.createElement('span');
      const angle = (i / 10) * Math.PI * 2;
      const dist  = 40 + Math.random() * 40;

      spark.style.cssText = `
        position: absolute;
        pointer-events: none;
        width: 6px; height: 6px;
        border-radius: 50%;
        background: #F4D7A1;
        left: ${cx}px; top: ${cy}px;
        transform: translate(-50%,-50%);
        animation: spark-fly 0.6s ease forwards;
        --tx: ${Math.cos(angle) * dist}px;
        --ty: ${Math.sin(angle) * dist}px;
        z-index: 100;
      `;
      btn.appendChild(spark);
      setTimeout(() => spark.remove(), 700);
    }
  });

  // Inject keyframe
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spark-fly {
      0%   { transform: translate(-50%,-50%) scale(1); opacity: 1; }
      100% { transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(0); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
})();


// ── Active Nav Link Highlight ─────────────────
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks  = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(a => {
          a.style.color = a.getAttribute('href') === `#${id}`
            ? 'var(--accent)'
            : '';
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(s => observer.observe(s));
})();


// ── Cursor Glow ───────────────────────────────
(function initCursorGlow() {
  if (window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches) return;

  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    width: 300px; height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(244,215,161,0.06) 0%, transparent 70%);
    transform: translate(-50%,-50%);
    transition: opacity 0.3s;
    top: 0; left: 0;
  `;
  document.body.appendChild(glow);

  let mx = -999, my = -999;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    glow.style.left = mx + 'px';
    glow.style.top  = my + 'px';
  });

  document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { glow.style.opacity = '1'; });
})();
