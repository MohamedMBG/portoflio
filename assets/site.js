/* Site behaviour: theme, navigation, scroll affordances, reveals. */
(() => {
  'use strict';

  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---- Theme ---------------------------------------------------------- */

  const THEME_KEY = 'mb-theme';
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

  const readStoredTheme = () => {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch {
      return null;
    }
  };

  const effectiveTheme = () => root.dataset.theme || (systemDark.matches ? 'dark' : 'light');

  // Keep the browser UI colour in step with the painted background.
  const syncThemeColor = () => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) return;
    meta.setAttribute('content', effectiveTheme() === 'dark' ? '#0c110e' : '#f1f0e8');
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

  // Follow the OS while the visitor has not made an explicit choice.
  systemDark.addEventListener('change', () => {
    if (!readStoredTheme()) applyTheme(null);
  });

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



  /* ---- Footer year ------------------------------------------------------ */

  const year = String(new Date().getFullYear());
  document.querySelectorAll('[data-year]').forEach((node) => {
    node.textContent = year;
  });
})();
