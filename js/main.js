/**
 * Snapwork — main.js
 * Handles: nav scroll state, mobile menu, scroll reveal, counter animations
 */

'use strict';

/* ============================================
   NAV — scroll state
   ============================================ */
(function () {
  const nav = document.getElementById('nav');
  if (!nav) return;

  let ticking = false;

  function updateNav() {
    if (window.scrollY > 12) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(updateNav);
      ticking = true;
    }
  }, { passive: true });
})();


/* ============================================
   MOBILE MENU
   ============================================ */
(function () {
  const btn       = document.getElementById('menuBtn');
  const menu      = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (!btn || !menu) return;

  let isOpen = false;

  function openMenu() {
    isOpen = true;
    menu.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';

    // Animate hamburger → X
    const spans = btn.querySelectorAll('span');
    if (spans.length === 3) {
      spans[0].style.cssText = 'transform: translateY(6.5px) rotate(45deg)';
      spans[1].style.cssText = 'opacity: 0; transform: scaleX(0)';
      spans[2].style.cssText = 'transform: translateY(-6.5px) rotate(-45deg)';
    }
  }

  function closeMenu() {
    isOpen = false;
    menu.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';

    const spans = btn.querySelectorAll('span');
    if (spans.length === 3) {
      spans[0].style.cssText = '';
      spans[1].style.cssText = '';
      spans[2].style.cssText = '';
    }
  }

  btn.addEventListener('click', function () {
    if (isOpen) { closeMenu(); } else { openMenu(); }
  });

  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen) closeMenu();
  });
})();


/* ============================================
   SCROLL REVEAL
   ============================================ */
(function () {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  if (!('IntersectionObserver' in window)) {
    // Fallback: show everything
    elements.forEach(function (el) { el.classList.add('visible'); });
    return;
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -48px 0px',
    }
  );

  elements.forEach(function (el) { observer.observe(el); });
})();


/* ============================================
   COUNTER ANIMATION (stat numbers)
   ============================================ */
(function () {
  var stats = document.querySelectorAll('.why__stat-number');
  if (!stats.length) return;

  function parseValue(str) {
    // e.g. "40+", "8", "99.7%", "3×"
    var match = str.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : null;
  }

  function getSuffix(str) {
    return str.replace(/[\d.]+/, '');
  }

  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function animateCounter(el) {
    var original = el.textContent.trim();
    var target   = parseValue(original);
    var suffix   = getSuffix(original);

    if (target === null) return;

    var duration = 1200;
    var start    = null;
    var isFloat  = original.includes('.');

    function step(timestamp) {
      if (!start) start = timestamp;
      var elapsed  = timestamp - start;
      var progress = Math.min(elapsed / duration, 1);
      var eased    = easeOutExpo(progress);
      var current  = target * eased;

      el.textContent = (isFloat ? current.toFixed(1) : Math.floor(current)) + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = original;
      }
    }

    requestAnimationFrame(step);
  }

  if (!('IntersectionObserver' in window)) return;

  var statsObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  stats.forEach(function (el) { statsObserver.observe(el); });
})();


/* ============================================
   METRIC VALUE ANIMATION (case study)
   ============================================ */
(function () {
  var metrics = document.querySelectorAll('.case-study__metric-value');
  if (!metrics.length || !('IntersectionObserver' in window)) return;

  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function animateMetric(el) {
    // Only animate the <span> inside
    var spans = el.querySelectorAll('span');
    spans.forEach(function (span) {
      var original = span.textContent.trim();
      var match    = original.match(/[\d.]+/);
      if (!match) return;

      var target   = parseFloat(match[0]);
      var prefix   = original.slice(0, original.indexOf(match[0]));
      var suffix   = original.slice(original.indexOf(match[0]) + match[0].length);
      var duration = 1400;
      var start    = null;
      var isFloat  = original.includes('.');

      function step(ts) {
        if (!start) start = ts;
        var t = Math.min((ts - start) / duration, 1);
        var v = target * easeOutExpo(t);

        span.textContent = prefix + (isFloat ? v.toFixed(1) : Math.floor(v)) + suffix;

        if (t < 1) {
          requestAnimationFrame(step);
        } else {
          span.textContent = original;
        }
      }

      requestAnimationFrame(step);
    });
  }

  var metricsObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateMetric(entry.target);
          metricsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  metrics.forEach(function (el) { metricsObserver.observe(el); });
})();


/* ============================================
   SMOOTH ANCHOR SCROLLING
   ============================================ */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#') return;

      var target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      var navHeight = 64;
      var top       = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;

      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });
})();


/* ============================================
   PROCESS STEP HOVER (subtle)
   ============================================ */
(function () {
  document.querySelectorAll('.process__step').forEach(function (step) {
    step.addEventListener('mouseenter', function () {
      this.style.cursor = 'default';
    });
  });
})();
