/* Site behaviour: theme, navigation, scroll affordances, reveals. */
(() => {
  'use strict';

  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---- Theme ---------------------------------------------------------- */

  const THEME_KEY = 'mb-theme';

  const readStoredTheme = () => {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch {
      return null;
    }
  };

  // Dark is the house default; only an explicit choice switches to light.
  const effectiveTheme = () => root.dataset.theme || 'dark';

  // Keep the browser UI colour in step with the painted background.
  const syncThemeColor = () => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) return;
    meta.setAttribute('content', effectiveTheme() === 'dark' ? '#141414' : '#fafafa');
  };

  const applyTheme = (theme) => {
    if (theme === 'dark' || theme === 'light') {
      root.dataset.theme = theme;
    } else {
      delete root.dataset.theme;
    }
    syncThemeColor();
    document.querySelectorAll('.theme-toggle').forEach((button) => {
      const dark = effectiveTheme() === 'dark';
      button.setAttribute('aria-pressed', String(dark));
      button.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    });
  };

  applyTheme(readStoredTheme());

  document.querySelectorAll('.theme-toggle').forEach((button) => {
    button.addEventListener('click', () => {
      const next = effectiveTheme() === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch {
        /* private mode: theme still applies for this page view */
      }
      applyTheme(next);
    });
  });

  /* ---- Mobile navigation ---------------------------------------------- */

  const menuButton = document.querySelector('.menu-button');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (menuButton && mobileMenu) {
    const setMenu = (open) => {
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      mobileMenu.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    };

    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') !== 'true';
      setMenu(open);
      if (open) mobileMenu.querySelector('a')?.focus();
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setMenu(false));
    });

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      if (menuButton.getAttribute('aria-expanded') !== 'true') return;
      setMenu(false);
      menuButton.focus();
    });

    // Keep tab focus inside the overlay while it is open.
    mobileMenu.addEventListener('keydown', (event) => {
      if (event.key !== 'Tab') return;
      const stops = [menuButton, ...mobileMenu.querySelectorAll('a')];
      const first = stops[0];
      const last = stops[stops.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  }

  // Mark the current page in the mobile menu, which has no server-rendered state.
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.mobile-menu a').forEach((link) => {
    if (link.getAttribute('href') === here) link.setAttribute('aria-current', 'page');
  });

  /* ---- Scroll affordances --------------------------------------------- */

  const header = document.querySelector('.site-header');
  const progress = document.querySelector('.scroll-progress');
  let ticking = false;

  const onScroll = () => {
    ticking = false;
    const y = window.scrollY;

    if (header) header.classList.toggle('is-scrolled', y > 24);

    if (progress) {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = scrollable > 0 ? Math.min(y / scrollable, 1) : 0;
      progress.style.setProperty('--progress', ratio.toFixed(4));
    }
  };

  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(onScroll);
    },
    { passive: true }
  );

  onScroll();

  /* ---- Reveal on enter ------------------------------------------------- */

  const revealTargets = document.querySelectorAll('.reveal');

  if (reduceMotion.matches || !('IntersectionObserver' in window)) {
    revealTargets.forEach((element) => element.classList.add('visible'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Anything already above the viewport — a restored scroll position, a
          // deep link, a refresh mid-page — must show without waiting to be
          // scrolled into view again, or it stays blank for good.
          const alreadyPassed = entry.boundingClientRect.bottom < 0;
          if (!entry.isIntersecting && !alreadyPassed) return;
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -30px' }
    );

    revealTargets.forEach((element) => revealObserver.observe(element));
  }

  /* ---- Pointer glow on principle cards --------------------------------- */

  if (!reduceMotion.matches && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.principle').forEach((card) => {
      let frame = 0;
      card.addEventListener('pointermove', (event) => {
        if (frame) return;
        frame = requestAnimationFrame(() => {
          frame = 0;
          const bounds = card.getBoundingClientRect();
          card.style.setProperty('--x', `${event.clientX - bounds.left}px`);
          card.style.setProperty('--y', `${event.clientY - bounds.top}px`);
        });
      });
    });
  }

  /* ---- Copy to clipboard ----------------------------------------------- */

  document.querySelectorAll('[data-copy]').forEach((button) => {
    const value = button.dataset.copy;
    const status = document.querySelector(button.dataset.copyStatus || '');
    const label = button.querySelector('[data-copy-label]') || button;
    const resting = label.textContent;

    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(value);
      } catch {
        if (status) status.textContent = `Copy failed — the address is ${value}`;
        return;
      }
      label.textContent = 'Copied';
      button.dataset.copied = 'true';
      if (status) status.textContent = `${value} copied to clipboard`;
      setTimeout(() => {
        label.textContent = resting;
        delete button.dataset.copied;
        if (status) status.textContent = '';
      }, 2400);
    });
  });



  /* ---- Hero word rotator ----------------------------------------------- */

  document.querySelectorAll('.hero-rotator[data-words]').forEach((rotator) => {
    const words = rotator.dataset.words.split('|');
    const word = rotator.querySelector('.hero-word');
    // Screen readers get the whole list once instead of a changing word.
    rotator.setAttribute('aria-label', words.join(', '));
    word.setAttribute('aria-hidden', 'true');
    if (reduceMotion.matches || words.length < 2) return;

    let index = 0;
    setInterval(() => {
      word.classList.remove('is-in');
      word.classList.add('is-out');
      word.addEventListener('animationend', () => {
        index = (index + 1) % words.length;
        word.textContent = words[index];
        word.classList.remove('is-out');
        word.classList.add('is-in');
      }, { once: true });
    }, 2600);
  });

  /* ---- Hero photo: colour follows the pointer -------------------------- */

  const hero = document.querySelector('.home-hero');
  const heroColor = hero?.querySelector('.home-hero-color');

  if (heroColor && !reduceMotion.matches && window.matchMedia('(hover: hover)').matches) {
    const RADIUS = 260;
    // Current values ease toward targets each frame so the spotlight trails the pointer.
    let x = 0, y = 0, r = 0, tx = 0, ty = 0, tr = 0, running = false;

    const tick = () => {
      x += (tx - x) * 0.14;
      y += (ty - y) * 0.14;
      r += (tr - r) * 0.1;
      heroColor.style.setProperty('--mx', `${x.toFixed(1)}px`);
      heroColor.style.setProperty('--my', `${y.toFixed(1)}px`);
      heroColor.style.setProperty('--r', r.toFixed(1));
      if (Math.abs(tx - x) + Math.abs(ty - y) + Math.abs(tr - r) > 0.5) {
        requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };

    const kick = () => {
      if (running) return;
      running = true;
      requestAnimationFrame(tick);
    };

    hero.addEventListener('pointermove', (event) => {
      const box = heroColor.getBoundingClientRect();
      tx = event.clientX - box.left;
      ty = event.clientY - box.top;
      const inside = tx >= 0 && ty >= 0 && tx <= box.width && ty <= box.height;
      // Open where the pointer enters instead of sliding in from the last spot.
      if (r < 1) { x = tx; y = ty; }
      tr = inside ? RADIUS : 0;
      hero.classList.toggle('is-lit', inside);
      kick();
    });
    hero.addEventListener('pointerleave', () => {
      tr = 0;
      hero.classList.remove('is-lit');
      kick();
    });
  }

  /* ---- Statement scrub: words light up as the paragraph scrolls past ---- */

  const scrubs = [...document.querySelectorAll('[data-scrub]')].map((element) => {
    const text = element.textContent.trim();
    const label = document.createElement('span');
    label.className = 'visually-hidden';
    label.textContent = text;
    element.replaceChildren(label);
    text.split(/\s+/).forEach((w) => {
      const span = document.createElement('span');
      span.className = 'w';
      span.setAttribute('aria-hidden', 'true');
      span.textContent = w;
      element.append(span, ' ');
    });
    return { element, words: element.querySelectorAll('.w') };
  });

  if (scrubs.length && !reduceMotion.matches) {
    let scrubTicking = false;
    const scrub = () => {
      scrubTicking = false;
      const vh = window.innerHeight;
      scrubs.forEach(({ element, words }) => {
        const box = element.getBoundingClientRect();
        const ratio = Math.min(Math.max((vh * 0.85 - box.top) / (box.height + vh * 0.25), 0), 1);
        const lit = Math.round(ratio * words.length);
        words.forEach((w, i) => w.classList.toggle('on', i < lit));
      });
    };
    window.addEventListener('scroll', () => {
      if (scrubTicking) return;
      scrubTicking = true;
      requestAnimationFrame(scrub);
    }, { passive: true });
    scrub();
  }

  /* ---- Footer year ------------------------------------------------------ */

  const year = String(new Date().getFullYear());
  document.querySelectorAll('[data-year]').forEach((node) => {
    node.textContent = year;
  });
})();
