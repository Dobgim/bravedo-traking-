import { useLayoutEffect, useRef } from 'react';
import { deferBackgrounds } from '../lazyBackgrounds.js';

/*
 * The page frame every theme section expects. The theme's stylesheets are
 * written against this exact nesting (#pxl-main ... .elementor.elementor-18),
 * so any page built from the home page's sections must sit inside it.
 * `before` / `after` render above / below the sections (page title banner,
 * hand-written blocks that are not theme markup).
 */
export default function ThemePage({ before = null, after = null, children }) {
  const mainRef = useRef(null);
  // before paint, and before the theme scripts (App's effect) start
  useLayoutEffect(() => deferBackgrounds(mainRef.current), []);

  return (
    <div id="pxl-main" ref={mainRef}>
      {before}
      <div className="elementor-container">
        <div className="row pxl-content-wrap no-sidebar">
          <div id="pxl-content-area" className="pxl-content-area pxl-content-page col-12">
            <main id="pxl-content-main">
              <article id="pxl-post-18" className="post-18 page type-page status-publish hentry">
                <div className="pxl-entry-content clearfix">
                  <div
                    data-elementor-type="wp-page"
                    data-elementor-id="18"
                    className="elementor elementor-18"
                    data-elementor-post-type="page"
                  >
                    {children}
                  </div>
                </div>
              </article>
            </main>
          </div>
        </div>
      </div>
      {after}
    </div>
  );
}
