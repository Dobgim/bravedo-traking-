/*
 * Lazy-loads the inline background photos further down the home page (blog
 * cards, service cards, testimonial avatars). Browsers fetch CSS background
 * images as soon as the element is rendered, even far off-screen, so these
 * ~2 MB of photos competed with the first screen. Each one now loads when it
 * comes within ~800px of the viewport.
 *
 * Call it before the browser paints (useLayoutEffect) and before the theme
 * scripts run. Elements the theme's parallax scripts read are left alone.
 */
const SELECTOR = '.pxl-holder, .bgr, .pxl-item--bg, .pxl-item--avatar';

export function deferBackgrounds(root) {
  if (!root || typeof IntersectionObserver === 'undefined') return () => {};

  const deferred = [];
  root.querySelectorAll(SELECTOR).forEach((el) => {
    if (el.closest('[data-parallax], .jarallax')) return;
    const bg = el.style.backgroundImage;
    if (!bg || bg === 'none') return;
    el.dataset.lazyBg = bg;
    el.style.backgroundImage = 'none';
    deferred.push(el);
  });
  if (!deferred.length) return () => {};

  // Carousels clone their slides (attributes included), so restore every
  // element waiting on the same image, not just the one that came into view.
  const restore = (bg) => {
    root.querySelectorAll('[data-lazy-bg]').forEach((el) => {
      if (bg && el.dataset.lazyBg !== bg) return;
      el.style.backgroundImage = el.dataset.lazyBg;
      delete el.dataset.lazyBg;
      io.unobserve(el);
    });
  };
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target.dataset.lazyBg) restore(entry.target.dataset.lazyBg);
      });
    },
    // horizontal margin too, so carousel slides just off to the side load early
    { rootMargin: '800px 800px' }
  );
  deferred.forEach((el) => io.observe(el));

  // Safety net: once the first screen is done, load whatever is left.
  const fallback = setTimeout(() => restore(null), 8000);
  return () => {
    clearTimeout(fallback);
    io.disconnect();
  };
}
