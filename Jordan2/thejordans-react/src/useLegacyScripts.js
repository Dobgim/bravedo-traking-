import { useEffect } from 'react';
import { LEGACY_SCRIPTS } from './legacyScripts.js';

/**
 * The original theme ships jQuery, Elementor, Swiper, GSAP, WOW and the
 * carryon theme scripts. They expect to run against finished markup, so we
 * load them - in the exact order the original document used - once React has
 * committed the page.
 *
 * Start-up order matters. On the original page every script had loaded before
 * jQuery's "ready" fired, and Elementor initialises its widgets on ready: the
 * theme's widget scripts (carousels, counters, accordions...) register with
 * Elementor on the way in, so they must all be present first. Loading scripts
 * after the page has finished loading would let ready fire straight away, so
 * we hold it (jQuery.holdReady) from the moment jQuery arrives until the last
 * script has loaded, then replay DOMContentLoaded / ready / load in order.
 */
// Guard against React 18 StrictMode running the effect twice in development:
// the theme scripts are not safe to evaluate more than once.
let started = false;

export default function useLegacyScripts() {
  useEffect(() => {
    if (started) return undefined;
    started = true;
    let cancelled = false;
    let readyHeld = false;

    const loadScript = (src) =>
      new Promise((resolve) => {
        const el = document.createElement('script');
        el.src = src;
        el.async = false;
        el.dataset.legacy = 'true';
        el.addEventListener('load', () => {
          // (async=false scripts fire load right after each one executes)
          // runs synchronously after jQuery executes - before its queued ready
          if (window.jQuery && !readyHeld) {
            window.jQuery.holdReady(true);
            readyHeld = true;
          }
          resolve();
        });
        el.addEventListener('error', () => {
          console.warn('[legacy] failed to load', src);
          resolve();
        });
        document.body.appendChild(el);
      });

    const fireLoad = () => {
      window.dispatchEvent(new Event('load'));
      window.dispatchEvent(new Event('resize'));
      window.dispatchEvent(new Event('scroll'));
    };

    (async () => {
      // jQuery first, so ready can be held before anything registers with it.
      // Then every other script is requested at once: async=false scripts
      // download in parallel but still execute in insertion order, so the
      // original document order is kept without a 70-request waterfall.
      const [first, ...rest] = LEGACY_SCRIPTS;
      await loadScript(first);
      if (cancelled) return;
      await Promise.all(rest.map(loadScript));
      if (cancelled) return;

      // plain-JS libraries waiting for DOMContentLoaded (reaches window too)
      document.dispatchEvent(new Event('DOMContentLoaded', { bubbles: true }));

      const $ = window.jQuery;
      if (!$) {
        fireLoad();
        return;
      }
      // registered last, so it runs after every other ready handler - as the
      // real window load always follows ready
      $(() => setTimeout(fireLoad, 0));
      if (readyHeld) $.holdReady(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);
}
