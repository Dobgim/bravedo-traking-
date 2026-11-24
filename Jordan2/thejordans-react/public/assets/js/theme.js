; (function ($) {

    "use strict";

    var pxl_scroll_top;
    var pxl_window_height;
    var pxl_window_width;
    var pxl_scroll_status = '';
    var pxl_last_scroll_top = 0;
    var pxl_post_slip = false;

    let lastHeight = 0;
    let animating = false;
    let currentActiveId = null;
    $(window).on('load', function () {
        setTimeout(function () {
            $(".pxl-loader").addClass("is-loaded");
        }, 60);
        $('.pxl-swiper-slider, .pxl-header-mobile-elementor').css('opacity', '1');
        $('.pxl-gallery-scroll').parents('body').addClass('body-overflow').addClass('body-visible-sm');


        ///
        var svgIcon_blockquote = `<svg class="icon-blockquote" xmlns="http://www.w3.org/2000/svg" width="29" height="24" viewBox="0 0 29 24" fill="none">
  <path d="M5.40966 1.53104C5.62632 0.632873 6.43001 1.56919e-05 7.35394 3.79617e-05L10.6087 0.000116414C11.7133 0.000143037 12.6087 0.895566 12.6087 2.00012V21.9565C12.6087 23.0611 11.7133 23.9565 10.6087 23.9565H2.53982C1.2455 23.9565 0.292073 22.7457 0.595593 21.4875L5.40966 1.53104Z" fill="#FE000B"/>
  <path d="M21.8008 1.53104C22.0174 0.632873 22.8211 1.56919e-05 23.745 3.79617e-05L26.9999 0.000116414C28.1044 0.000143037 28.9998 0.895566 28.9998 2.00012V21.9565C28.9998 23.0611 28.1044 23.9565 26.9998 23.9565H18.9309C17.6366 23.9565 16.6832 22.7457 16.9867 21.4875L21.8008 1.53104Z" fill="#FE000B"/>
</svg>`;
        $('blockquote').append(svgIcon_blockquote);


        var svgIcon_arrow_right = `<span class="icon">
							<svg xmlns="http://www.w3.org/2000/svg" width="11" height="9" viewBox="0 0 11 9" fill="none">
								<path d="M9.97801 4.69883L6.32176 8.35508C6.20728 8.46956 6.05201 8.53387 5.89012 8.53387C5.72822 8.53387 5.57296 8.46956 5.45848 8.35508C5.344 8.2406 5.27969 8.08534 5.27969 7.92344C5.27969 7.76154 5.344 7.60628 5.45848 7.4918L8.07422 4.87707H0.609375C0.447759 4.87707 0.292762 4.81287 0.178482 4.69859C0.0642018 4.58431 0 4.42931 0 4.2677C0 4.10608 0.0642018 3.95108 0.178482 3.8368C0.292762 3.72252 0.447759 3.65832 0.609375 3.65832H8.07422L5.45949 1.04207C5.34501 0.927595 5.2807 0.772329 5.2807 0.610432C5.2807 0.448535 5.34501 0.29327 5.45949 0.178791C5.57397 0.0643131 5.72924 1.70586e-09 5.89113 0C6.05303 -1.70586e-09 6.20829 0.0643131 6.32277 0.178791L9.97902 3.83504C10.0358 3.89173 10.0809 3.95909 10.1116 4.03324C10.1423 4.10739 10.1581 4.18688 10.158 4.26715C10.1579 4.34741 10.142 4.42686 10.1111 4.50095C10.0802 4.57503 10.035 4.64228 9.97801 4.69883Z" fill="white"></path>
							</svg>
						</span>`;
        $('.price_slider_amount button').append(svgIcon_arrow_right);
        ///

        pxl_window_width = $(window).width();
        pxl_window_height = $(window).height();
        carryon_header_sticky();
        carryon_header_mobile();
        carryon_scroll_to_top();
        scrollToggleActive();
        carryon_footer_fixed();
        carryon_image_effect_parallax();
        carryon_shop_quantity();
        carryon_init_pxl_menu_hover();
        carryon_submenu_responsive();
        carryon_panel_anchor_toggle();
        //carryon_shop_view_layout();
        carryon_equal_height_testimonial_desc();
        carryon_menu_divider_move();
        carryon_fit_to_screen();
        carryon_el_parallax();
        carryon_track_order();
    });

    $(window).on('scroll', function () {
        pxl_scroll_top = $(window).scrollTop();
        pxl_window_height = $(window).height();
        pxl_window_width = $(window).width();
        if (pxl_scroll_top < pxl_last_scroll_top) {
            pxl_scroll_status = 'up';
        } else {
            pxl_scroll_status = 'down';
        }
        pxl_last_scroll_top = pxl_scroll_top;
        carryon_header_sticky();
        carryon_scroll_to_top();
        carryon_footer_fixed();
        var scrollTop = $(this).scrollTop();
        var windowHeightStart = $(window).height();

        if (scrollTop >= windowHeightStart) {
            $(".px-header--fixed").addClass("bg-blur");
        } else {
            $(".px-header--fixed").removeClass("bg-blur");
        }
        carryon_ptitle_scroll_opacity();
        if (pxl_scroll_top < 100) {
            $('.elementor > .pin-spacer').removeClass('scroll-top-active');
        }
        /////

        ////
        let newActiveId = null;

        $('.elementor-element[id]').each(function () {
            const $section = $(this);
            const sectionId = $section.attr('id');

            const sectionTop = $section.offset().top;
            const sectionHeight = $section.outerHeight();
            const sectionBottom = sectionTop + sectionHeight;

            const scrollTop = $(window).scrollTop();
            const windowHeight = $(window).height();
            const windowBottom = scrollTop + windowHeight;

            // Kiểm tra nếu section nằm hoàn toàn trong viewport
            if (sectionTop >= scrollTop && sectionBottom <= windowBottom) {
                newActiveId = sectionId;
                return false; // Dừng loop khi tìm thấy section đầu tiên nằm trọn
            }
        });

        // Nếu tìm thấy một section mới nằm trọn và khác với section hiện tại
        if (newActiveId && newActiveId !== currentActiveId) {
            if (currentActiveId) {
                $('a[href="#' + currentActiveId + '"]').removeClass('active');
            }
            // Thêm class active mới
            $('a[href="#' + newActiveId + '"]').addClass('active');
            currentActiveId = newActiveId;
        }
        ////
        if ($('.pxl_line_scroll').length) {
            let scrollTop = $(window).scrollTop();
            let windowHeight = $(window).height();
            let scrollElement = $(".pxl_line_scroll");
            let elementTop = scrollElement.offset().top;
            let elementHeight = scrollElement.outerHeight();
            let lineElement = $(".pxl_line_scroll .line .line-change");
            let dotElements = $('.pxl_line_scroll .line > .dot');
            dotElements.each(function () {
                let dot = $(this);
                let dotTop = dot.offset().top;
                let isActive = dot.hasClass('active');

                if (scrollTop + windowHeight * 0.8 >= dotTop && scrollTop <= dotTop + dot.outerHeight()) {
                    dot.addClass('active');
                } else {
                    dot.removeClass('active');
                }
            });

            let beforeHeight = (scrollTop + windowHeight * 0.8) - elementTop;
            beforeHeight = Math.max(0, beforeHeight);

            $({ height: lastHeight }).animate({ height: beforeHeight }, {
                duration: 300,
                step: function (now) {
                    lineElement[0].style.setProperty("height", now + "px");
                }
            });

            lastHeight = beforeHeight;
        }

    });


    $(window).on('resize', function () {
        pxl_window_height = $(window).height();
        pxl_window_width = $(window).width();
        carryon_submenu_responsive();
        carryon_header_mobile();
        carryon_fit_to_screen();
        setTimeout(function () {
            carryon_menu_divider_move();
        }, 500);
    });

    $(document).ready(function () {
        carryon_button_parallax();
        carryon_backtotop_progess_bar();
        carryon_type_file_upload();
        carryon_text_parallax();
        //carryon_zoom_point();
        /////
        $('.pxl-grid-inner').each(function () {
            var $wrap = $(this);
            var $items = $wrap.find('.pxl-grid-item');
            var $images = $wrap.find('.bgr-list .image-item');
            $images.removeClass('active preactive').first().addClass('active');

            $items.each(function (index) {
                $(this).on('mouseenter', function () {
                    var $target = $images.eq(index);
                    var $currentActive = $images.filter('.active');

                    if (!$target.is($currentActive)) {
                        $images.removeClass('preactive');
                        $currentActive.removeClass('active').addClass('preactive');
                        $target.removeClass('preactive').addClass('active');
                    }
                });
            });
        });



        /////

        let previousValue = $('.your-value .ctf7-total').attr('data-number');
        $('.your-value  .value').text(previousValue);

        setInterval(function () {
            const currentValue = $('.your-value .ctf7-total').attr('data-number');
            if (currentValue !== previousValue) {
                previousValue = currentValue;
                $('.your-value  .value').text(currentValue);
            }
        }, 1);
        ///
        $('a[href^="#"]:not(.tabs a)').on('click', function (e) {
            e.preventDefault();

            const target = $(this.getAttribute('href'));

            if (target.length) {
                $('html, body').animate(
                    {
                        scrollTop: target.offset().top,
                    },
                    600
                );
            }
        });
        /* Hover Active button */
        ///menu custom

        ///screen image change
        $(".pxl-screen .pxl-screen-wrapper .wrap-img img:first-child").addClass("active");
        $(".pxl-screen .pxl-item--button:first-child").addClass("active");
        $(".pxl-screen .pxl-item--button").on('click', function () {
            $(".pxl-screen .pxl-item--button").removeClass("active");
            $(this).addClass("active");
            let index = $(this).index();

            let $targetImg = $(".pxl-screen .wrap-img img").eq(index);
            $targetImg.addClass("active");
            $(".pxl-screen .wrap-img img").not($targetImg).removeClass("active");
        });

        ////

        ////

        /* Start Menu Mobile */
        $('.pxl-header-menu li.menu-item-has-children').append('<span class="pxl-menu-toggle"></span>');
        $('.pxl-menu-toggle').on('click', function () {
            if ($(this).hasClass('active')) {
                $(this).closest('ul').find('.pxl-menu-toggle.active').toggleClass('active');
                $(this).closest('ul').find('.sub-menu.active').toggleClass('active').slideToggle();
            } else {
                $(this).closest('ul').find('.pxl-menu-toggle.active').toggleClass('active');
                $(this).closest('ul').find('.sub-menu.active').toggleClass('active').slideToggle();
                $(this).toggleClass('active');
                $(this).parent().find('> .sub-menu').toggleClass('active');
                $(this).parent().find('> .sub-menu').slideToggle();
            }
        });

        $(document).on("mouseenter mouseleave", "li.pxl-megamenu", function (e) {
            $(this).parents('.elementor-element').toggleClass('section-mega-active', e.type === 'mouseenter');
        });


        $("#pxl-nav-mobile, .pxl-anchor-mobile-menu").on('click', function () {
            $(this).toggleClass('active');
            $('body').toggleClass('body-overflow');
            $('.pxl-header-menu').toggleClass('active');
        });

        $(".pxl-menu-close, .pxl-header-menu-backdrop, #pxl-header-mobile .pxl-menu-primary a.is-one-page").on('click', function () {
            $(this).parents('.pxl-header-main').find('.pxl-header-menu').removeClass('active');
            $('#pxl-nav-mobile').removeClass('active');
            $('body').toggleClass('body-overflow');
        });
        /* End Menu Mobile */

        /* Menu Vertical */
        $('.pxl-nav-vertical li.menu-item-has-children > a').append('<span class="pxl-arrow-toggle"><i class="flaticon-right-up"></i></span>');
        $('.pxl-nav-vertical li.menu-item-has-children > a').on('click', function () {
            if ($(this).hasClass('active')) {
                $(this).next().toggleClass('active').slideToggle();
            } else {
                $(this).closest('ul').find('.sub-menu.active').toggleClass('active').slideToggle();
                $(this).closest('ul').find('a.active').toggleClass('active');
                $(this).find('.pxl-menu-toggle.active').toggleClass('active');
                $(this).toggleClass('active');
                $(this).next().toggleClass('active').slideToggle();
            }
        });

        /* Mega Menu Max Height */
        var m_h_mega = $('li.pxl-megamenu > .sub-menu > .pxl-mega-menu-elementor').outerHeight();
        var w_h_mega = $(window).height();
        var w_h_mega_css = w_h_mega - 120;
        if (m_h_mega > w_h_mega) {
            $('li.pxl-megamenu > .sub-menu > .pxl-mega-menu-elementor').css('max-height', w_h_mega_css + 'px');
            $('li.pxl-megamenu > .sub-menu > .pxl-mega-menu-elementor').css('overflow-x', 'scroll');
        }
        // Active Mega Menu Hover
        $(document).on("mouseenter mouseleave", "li.pxl-megamenu", function (e) {
            $(this).parents('.elementor-section').toggleClass('section-mega-active', e.type === 'mouseenter');
        });

        /* End Mega Menu Max Height */
        /* Search Popup */
        var $search_wrap_init = $("#pxl-search-popup");
        var search_field = $('#pxl-search-popup .search-field');
        var $body = $('body');

        $(".pxl-search-popup-button").on('click', function (e) {
            if (!$search_wrap_init.hasClass('active')) {
                $search_wrap_init.addClass('active');
                setTimeout(function () { search_field.get(0).focus(); }, 500);
            } else if (search_field.val() === '') {
                $search_wrap_init.removeClass('active');
                search_field.get(0).focus();
            }
            e.preventDefault();
            return false;
        });

        $(".pxl-subscribe-popup .pxl-item--overlay, .pxl-subscribe-popup .pxl-item--close").on('click', function (e) {
            $(this).parents('.pxl-subscribe-popup').removeClass('pxl-active');
            e.preventDefault();
            return false;
        });

        $("#pxl-search-popup .pxl-item--overlay, #pxl-search-popup .pxl-item--close").on('click', function (e) {
            $body.addClass('pxl-search-out-anim');
            setTimeout(function () {
                $body.removeClass('pxl-search-out-anim');
            }, 800);
            setTimeout(function () {
                $search_wrap_init.removeClass('active');
            }, 800);
            e.preventDefault();
            return false;
        });
        $(document).on('click', '.pxl-button.pxl-atc-popup > .btn ', function (e) {
            $('.pxl-page-popup').removeClass('active');
            e.preventDefault();
            e.stopPropagation();
            var target = $(this).attr('data-target');
            $(target).toggleClass('active');
            $('body').addClass('body-overflow');
        });
        $('.pxl-page-popup').each(function () {
            var $popup = $(this);
            if ($popup.find('.pxl-popup--conent .pxl-close-popup').length > 0) {
                $popup.children('.pxl-close-popup').remove();
            }
        });
        /* Scroll To Top */
        $('.pxl-scroll-top,.pxl-scroll-top-custom').on('click', function () {
            $('html, body').animate({ scrollTop: 0 }, 1200);
            $(this).parents('.pxl-wapper').find('.elementor > .pin-spacer').addClass('scroll-top-active');
            return false;
        });
        /* Tab Custom */

        ////


        var section_carousel = $('.pxl-carousel-nav').parents('.elementor-element').addClass('pxl--hide-pagination');
        setTimeout(function () {
            $('.elementor-element').each(function () {
                const $element = $(this);
                const $source = $element.find('.pxl-swiper-slider .swiper-pagination-progressbar-fill');
                const $target = $element.find('.pxl-carousel-nav .swiper-pagination-fill-custom');
                if ($source.length && $target.length) {
                    let lastTransform = $source.css('transform');
                    let lastDuration = $source.css('transition-duration');

                    function syncStyles() {
                        const currentTransform = $source.css('transform');
                        const currentDuration = $source.css('transition-duration');
                        if (currentTransform !== lastTransform || currentDuration !== lastDuration) {
                            $target.css({
                                'transform': currentTransform,
                                //'transition-duration': currentDuration
                            });

                            lastTransform = currentTransform;
                            lastDuration = currentDuration;
                        }
                    }
                    setInterval(syncStyles, 50);
                }
            });
        }, 100);

        /* Animate Time Delay */

        $('.pxl-grid-masonry').each(function () {
            var eltime = 80;
            var elt_inner = $(this).children().length;
            var _elt = elt_inner - 1;
            $(this).find('> .pxl-grid-item > .wow').each(function (index, obj) {
                $(this).css('animation-delay', eltime + 'ms');
                if (_elt === index) {
                    eltime = 80;
                    _elt = _elt + elt_inner;
                } else {
                    eltime = eltime + 80;
                }
            });
        });

        $('.btn-text-nina').each(function () {
            var eltime = 0.045;
            var elt_inner = $(this).children().length;
            var _elt = elt_inner - 1;
            $(this).find('> .pxl--btn-text > span').each(function (index, obj) {
                $(this).css('transition-delay', eltime + 's');
                eltime = eltime + 0.045;
            });
        });

        $('.btn-text-nanuk').each(function () {
            var eltime = 0.05;
            var elt_inner = $(this).children().length;
            var _elt = elt_inner - 1;
            $(this).find('> .pxl--btn-text > span').each(function (index, obj) {
                $(this).css('animation-delay', eltime + 's');
                eltime = eltime + 0.05;
            });
        });

        $('.btn-text-smoke').each(function () {
            var eltime = 0.05;
            var elt_inner = $(this).children().length;
            var _elt = elt_inner - 1;
            $(this).find('> .pxl--btn-text > span > span > span').each(function (index, obj) {
                $(this).css('--d', eltime + 's');
                eltime = eltime + 0.05;
            });
        });

        $('.btn-text-reverse .pxl-text--front, .btn-text-reverse .pxl-text--back').each(function () {
            var eltime = 0.05;
            var elt_inner = $(this).children().length;
            var _elt = elt_inner - 1;
            $(this).find('.pxl-text--inner > span').each(function (index, obj) {
                $(this).css('transition-delay', eltime + 's');
                eltime = eltime + 0.05;
            });
        });

        /* End Animate Time Delay */

        $('.label-text-fillter').on('click', function () {
            $(this).parents('.pxl-grid-filter').addClass('active');
        });
        $('.filter-item').on('click', function () {
            $('.pxl-grid-filter').removeClass('active');
        });
        $(document).on('click', '.mfp-iframe', function (e) {
            e.preventDefault();
        });

        /* Lightbox Popup */
        $('.pxl-action-popup').magnificPopup({
            type: 'iframe',
            mainClass: 'mfp-fade',
            removalDelay: 160,
            preloader: false,
            fixedContentPos: false
        });

        $('.pxl-gallery-lightbox').each(function () {
            $(this).magnificPopup({
                delegate: 'a.lightbox',
                type: 'image',
                gallery: {
                    enabled: true
                },
                mainClass: 'mfp-fade',
            });
        });

        /* Page Title Parallax */
        if ($('#pxl-page-title-default').hasClass('pxl--parallax')) {
            $(this).stellar();
        }
        ///

        /* Cart Sidebar Popup */
        $(".pxl-cart-sidebar-button").on('click', function () {
            $('body').addClass('body-overflow');
            $('#pxl-cart-sidebar').addClass('active');
        });
        $("#pxl-cart-sidebar .pxl-popup--overlay, #pxl-cart-sidebar .pxl-item--close").on('click', function () {
            $('body').removeClass('body-overflow');
            $('#pxl-cart-sidebar').removeClass('active');
        });
        $(".pxl-accordion1.style2 .pxl-accordion--content").find("br").remove();
        /* Hover Active Item */
        // $('.pxl-icon-box3 .pxl-item').each(function () {
        //     $(this).hover(function () {
        //         $(this).parents('.pxl-icon-box3').find('.pxl-item').removeClass('active');
        //         $(this).addClass('active');
        //     });
        // });

        /* Start Icon Bounce */
        var boxEls = $('.el-bounce, .pxl-image-effect1, .el-effect-zigzag');
        $.each(boxEls, function (boxIndex, boxEl) {
            loopToggleClass(boxEl, 'active');
        });

        function loopToggleClass(el, toggleClass) {
            el = $(el);
            let counter = 0;
            if (el.hasClass(toggleClass)) {
                waitFor(function () {
                    counter++;
                    return counter == 2;
                }, function () {
                    counter = 0;
                    el.removeClass(toggleClass);
                    loopToggleClass(el, toggleClass);
                }, 'Deactivate', 1000);
            } else {
                waitFor(function () {
                    counter++;
                    return counter == 3;
                }, function () {
                    counter = 0;
                    el.addClass(toggleClass);
                    loopToggleClass(el, toggleClass);
                }, 'Activate', 1000);
            }
        }

        function waitFor(condition, callback, message, time) {
            if (message == null || message == '' || typeof message == 'undefined') {
                message = 'Timeout';
            }
            if (time == null || time == '' || typeof time == 'undefined') {
                time = 100;
            }
            var cond = condition();
            if (cond) {
                callback();
            } else {
                setTimeout(function () {
                    waitFor(condition, callback, message, time);
                }, time);
            }
        }
        ////

        /////
        /* End Icon Bounce */




        /* Image Effect */
        if ($('.pxl-image-tilt').length) {
            $('.pxl-image-tilt').parents('.elementor-top-section').addClass('pxl-image-tilt-active');
            $('.pxl-image-tilt').each(function () {
                var pxl_maxtilt = $(this).data('maxtilt'),
                    pxl_speedtilt = $(this).data('speedtilt'),
                    pxl_perspectivetilt = $(this).data('perspectivetilt');
                VanillaTilt.init(this, {
                    max: pxl_maxtilt,
                    speed: pxl_speedtilt,
                    perspective: pxl_perspectivetilt
                });
            });
        }

        /* Select Theme Style */
        $('.widget.widget_search input').attr('required', true);
        $('.wpcf7-select').each(function () {
            var $this = $(this), numberOfOptions = $(this).children('option').length;

            $this.addClass('pxl-select-hidden');
            $this.wrap('<div class="pxl-select"></div>');
            $this.after('<div class="pxl-select-higthlight"></div>');

            var $styledSelect = $this.next('div.pxl-select-higthlight');
            $styledSelect.text($this.children('option').eq(0).text());

            var $list = $('<ul />', {
                'class': 'pxl-select-options'
            }).insertAfter($styledSelect);

            for (var i = 0; i < numberOfOptions; i++) {
                $('<li />', {
                    text: $this.children('option').eq(i).text(),
                    rel: $this.children('option').eq(i).val()
                }).appendTo($list);
            }

            var $listItems = $list.children('li');

            $styledSelect.on('click', function (e) {
                e.stopPropagation();
                $('div.pxl-select-higthlight.active').not(this).each(function () {
                    $(this).removeClass('active').next('ul.pxl-select-options').addClass('pxl-select-lists-hide');
                });
                $(this).toggleClass('active');
            });

            $listItems.on('click', function (e) {
                e.stopPropagation();
                $styledSelect.text($(this).text()).removeClass('active');
                $this.val($(this).attr('rel'));
            });

            $(document).on('click', function () {
                $styledSelect.removeClass('active');
            });

        });
        ////svg comment

        ///
        /* Nice Select */
        $('.woocommerce-ordering .orderby, #pxl-sidebar-area select, .variations_form.cart .variations select, .pxl-open-table select, .pxl-nice-select').each(function () {
            $(this).niceSelect();
        });

        $('.pxl-post-list .nice-select').each(function () {
            $(this).niceSelect();
        });

        /* Typewriter */
        if ($('.pxl-title--typewriter').length) {
            $(function () {
                var $items = $('.pxl-title--typewriter .pxl-item--text');
                var index = 0;

                // set active ban đầu
                $items.removeClass('is-active');
                $items.eq(index).addClass('is-active');

                setInterval(function () {
                    // remove current
                    $items.eq(index).removeClass('is-active');

                    // next index
                    index++;
                    if (index >= $items.length) {
                        index = 0;
                    }

                    // add active mới
                    $items.eq(index).addClass('is-active');

                }, 4000);
            });
        }
        /* End Typewriter */


        /* Get checked input - Mailchimpp */
        $('.mc4wp-form input:checkbox').change(function () {
            if ($(this).is(":checked")) {
                $('.mc4wp-form').addClass("pxl-input-checked");
            } else {
                $('.mc4wp-form').removeClass("pxl-input-checked");
            }
        });

        /* Scroll to content */
        $('.pxl-link-to-section .btn').on('click', function (e) {
            var id_scroll = $(this).attr('href');
            var offsetScroll = $('.pxl-header-elementor-sticky').outerHeight();
            e.preventDefault();
            $("html, body").animate({ scrollTop: $(id_scroll).offset().top - offsetScroll }, 600);
        });

        //Some Widget Default
        //$('.widget .cat-item a, .widget_archive li a').append('<span class="pxl-item--divider"></span>');
        $('.pxl-anchor-button').on('click', function (e) {
            $(this).parent().toggleClass('active');
            //$('body').toggleClass('body-overflow');
        });
        /* Social Button Click */
        $('.pxl-social--button').on('click', function () {
            $(this).toggleClass('active');
        });
        $(document).on('click', function (e) {
            if (e.target.className == 'pxl-social--button active')
                $('.pxl-social--button').removeClass('active');
        });



    });

    jQuery(document).ajaxComplete(function (event, xhr, settings) {
        carryon_shop_quantity();

    });

    jQuery(document).on('updated_wc_div', function () {
        carryon_shop_quantity();
    });

    /* Header Sticky */
    function carryon_header_sticky() {
        if ($('#pxl-header-elementor').hasClass('is-sticky')) {
            if (pxl_scroll_top > 100) {
                $('.pxl-header-elementor-sticky.pxl-sticky-stb').addClass('pxl-header-fixed');
                $('#pxl-header-mobile').addClass('pxl-header-mobile-fixed');
            } else {
                $('.pxl-header-elementor-sticky.pxl-sticky-stb').removeClass('pxl-header-fixed');
                $('#pxl-header-mobile').removeClass('pxl-header-mobile-fixed');
            }

            if (pxl_scroll_status == 'up' && pxl_scroll_top > 100) {
                $('.pxl-header-elementor-sticky.pxl-sticky-stt').addClass('pxl-header-fixed');
            } else {
                $('.pxl-header-elementor-sticky.pxl-sticky-stt').removeClass('pxl-header-fixed');
            }
        }

        $('.pxl-header-elementor-sticky').parents('body').addClass('pxl-header-sticky');
    }
    //Login
    $('.pxl-icon--users .icon-user').on('click', function () {
        if ($(this).parent().hasClass('active')) {
            $(this).parent().removeClass('active');
        } else {
            $(this).parent().addClass('active');
        }
    });
    $('.pxl-icon--users .btn-action').on('click', function () {
        $(this).parent().addClass('deactive');
    });
    $('.pxl-icon--users .btn-action.act-login').on('click', function () {
        $(this).parent().parent().find('.pxl-user-login').removeClass('hide');
        $(this).parent().parent().find('.wrap-form-action').removeClass('hide');
    });
    $('.pxl-icon--users .btn-action.act-register').on('click', function () {
        $(this).parent().parent().find('.pxl-user-register').removeClass('hide');
        $(this).parent().parent().find('.wrap-form-action').removeClass('hide');
    });
    $('.btn-sign-up').on('click', function () {
        $(this).parents('.wrap-form-action').find('.pxl-user-register').removeClass('hide');
        $(this).parents('.wrap-form-action').find('.pxl-user-login').addClass('hide');
    });
    $('.btn-sign-in').on('click', function () {
        $(this).parents('.wrap-form-action').find('.pxl-user-login').removeClass('hide');
        $(this).parents('.wrap-form-action').find('.pxl-user-register').addClass('hide');
    });
    /* Header Mobile */
    function carryon_header_mobile() {
        var h_header_mobile = $('#pxl-header-elementor').outerHeight();
        if (pxl_window_width < 1199) {
            $('#pxl-header-elementor').css('    ', h_header_mobile + 'px');
        }
    }
    function carryon_equal_height_testimonial_desc() {
        const $descs = jQuery(
            '.pxl-testimonial-carousel1 .pxl-swiper-slide .pxl-item--description'
        );
        if (!$descs.length) return;

        let maxHeight = 0;

        // reset trước để đo đúng
        $descs.css('min-height', '');

        $descs.each(function () {
            const h = jQuery(this).outerHeight();
            if (h > maxHeight) maxHeight = h;
        });

        $descs.css('min-height', maxHeight + 'px');
    }

    function carryon_init_pxl_menu_hover($context) {
        const $root = $context && $context.length ? $context : $(document);

        $root.find('.pxl-nav-menu.fr-style-divider').not('.js-pxl-menu-hovered').each(function () {
            const $menu = $(this).addClass('js-pxl-menu-hovered');
            const $items = $menu.find('.pxl-menu-primary > li');
            if (!$items.length) return;

            // Cache: đánh dấu li nào có submenu
            $items.each(function () {
                if ($(this).children('.sub-menu').length) $(this).addClass('has-sub');
            });

            // Active ban đầu: ưu tiên cái đã active/current, không có thì lấy cái đầu
            let $initial = $items.filter('.active, .current-menu-item').first();
            if (!$initial.length) $initial = $items.first();
            $items.removeClass('active');
            $initial.addClass('active');

            // Gỡ listener cũ theo namespace rồi bind lại (tránh trùng)
            $menu.off('.pxlMenuHover')
                // Chỉ đổi active khi hover vào li có submenu
                .on('mouseenter.pxlMenuHover', '.pxl-menu-primary > li.has-sub', function () {
                    const $li = $(this);
                    if (!$li.hasClass('active')) {
                        $items.removeClass('active');
                        $li.addClass('active');
                    }
                })
                // Khi rời toàn menu → khôi phục trạng thái ban đầu
                .on('mouseleave.pxlMenuHover', function () {
                    $items.removeClass('active');
                    $initial.addClass('active');
                });
        });
    }

    /* Scroll To Top */
    function carryon_scroll_to_top() {
        if (pxl_scroll_top < pxl_window_height) {
            $('.pxl-scroll-top').addClass('pxl-off').removeClass('pxl-on');
        }
        if (pxl_scroll_top > pxl_window_height) {
            $('.pxl-scroll-top').addClass('pxl-on').removeClass('pxl-off');
        }
    }

    /* Footer Fixed */
    function carryon_footer_fixed() {
        setTimeout(function () {
            var h_footer = $('.pxl-footer-fixed #pxl-footer-elementor').outerHeight() - 1;
            $('.pxl-footer-fixed #pxl-main').css('margin-bottom', h_footer + 'px');
        }, 600);
    }

    /* WooComerce Quantity */
    function carryon_shop_quantity() {
        "use strict";
        $('#pxl-wapper .quantity').append('<span class="quantity-icon quantity-down pxl-icon--minus"></span><span class="quantity-icon quantity-up pxl-icon--plus"></span>');
        $('.quantity-up').on('click', function () {
            $(this).parents('.quantity').find('input[type="number"]').get(0).stepUp();
            $(this).parents('.woocommerce-cart-form').find('.actions .button').removeAttr('disabled');
        });
        $('.quantity-down').on('click', function () {
            $(this).parents('.quantity').find('input[type="number"]').get(0).stepDown();
            $(this).parents('.woocommerce-cart-form').find('.actions .button').removeAttr('disabled');
        });
        $('.quantity-icon').on('click', function () {
            var quantity_number = $(this).parents('.quantity').find('input[type="number"]').val();
            var add_to_cart_button = $(this).parents(".product, .woocommerce-product-inner").find(".add_to_cart_button");
            add_to_cart_button.attr('data-quantity', quantity_number);
            add_to_cart_button.attr("href", "?add-to-cart=" + add_to_cart_button.attr("data-product_id") + "&quantity=" + quantity_number);
        });
        $('.woocommerce-cart-form .actions .button').removeAttr('disabled');
    }

    /* Menu Responsive Dropdown */
    function carryon_submenu_responsive() {
        var $carryon_menu = $('.pxl-header-elementor-main, .pxl-header-elementor-sticky');
        $carryon_menu.find('.pxl-menu-primary li').each(function () {
            var $carryon_submenu = $(this).find('> ul.sub-menu');
            if ($carryon_submenu.length == 1) {
                if (($carryon_submenu.offset().left + $carryon_submenu.width() + 0) > $(window).width()) {
                    $carryon_submenu.addClass('pxl-sub-reverse');
                }
            }
        });
    }
    function carryon_image_effect_parallax() {
        const els = $('.pxl-image-scale-parallax');
        if (!els.length) return;
        $(els).on({
            mousemove(e) {
                const img = $(this).find('img');
                if (!img.length) return;
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const moveX = (x - rect.width / 2) * 0.15;
                const moveY = (y - rect.height / 2) * 0.15;
                gsap.to(img, {
                    x: moveX,
                    y: moveY,
                    scale: 1.1,
                    duration: 0.25,
                    ease: "none",
                });
            },
            mouseleave() {
                const img = $(this).find('img');
                if (!img.length) return;
                gsap.to(img, {
                    x: 0,
                    y: 0,
                    scale: 1,
                    duration: 0.25,
                    ease: "none",
                });
            },
        });
    }
    function carryon_panel_anchor_toggle() {
        'use strict';
        $(document).on('click', '.pxl-anchor-button', function (e) {
            e.preventDefault();
            e.stopPropagation();
            var target = $(this).attr('data-target');
            $(target).toggleClass('active');
            $('body').toggleClass('body-overflow');
            $('.pxl-popup--conent .wow').addClass('animated').removeClass('aniOut');
            $('.pxl-popup--conent .fadeInPopup').removeClass('aniOut');
            if ($(target).find('.pxl-search-form').length > 0) {
                setTimeout(function () {
                    $(target).find('.pxl-search-form .pxl-search-field').focus();
                }, 1000);
            }
        });

        $('.pxl-anchor-button').each(function () {
            var t_target = $(this).attr('data-target');
            var t_delay = $(this).attr('data-delay-hover');
            $(t_target).find('.pxl-popup--conent').css('transition-delay', t_delay + 'ms');
            $(t_target).find('.pxl-popup--overlay').css('transition-delay', t_delay + 'ms');
        });

        $(".pxl-hidden-panel-popup .pxl-popup--overlay, .pxl-hidden-panel-popup .pxl-close-popup").on('click', function () {
            $('body').removeClass('body-overflow');
            $('.pxl-hidden-panel-popup').removeClass('active');
            $('.pxl-popup--conent .wow').addClass('aniOut').removeClass('animated');
            $('.pxl-popup--conent .fadeInPopup').addClass('aniOut');
            $('.pxl-anchor-button').parent().removeClass('active');
        });


        $(".pxl-popup--close").on('click', function () {
            $('body').removeClass('body-overflow');
            $(this).parent().removeClass('active');
        });
        $(".pxl-close-popup").on('click', function () {
            $('body').removeClass('body-overflow');
            $('.pxl-page-popup').removeClass('active');
        });
    }

    /* Page Title Scroll Opacity */
    function carryon_ptitle_scroll_opacity() {
        var divs = $('#pxl-page-title-elementor.pxl-scroll-opacity .elementor-widget'),
            limit = $('#pxl-page-title-elementor.pxl-scroll-opacity').outerHeight();
        if (pxl_scroll_top <= limit) {
            divs.css({ 'opacity': (1 - pxl_scroll_top / limit) });
        }
    }






    /* Button Parallax */
    function carryon_button_parallax() {
        $('.btn-text-parallax, .pxl-blog-style2, .pxl-hover-parallax').on('mouseenter', function () {
            $(this).addClass('hovered');
        });

        $('.btn-text-parallax, .pxl-blog-style2, .pxl-hover-parallax').on('mouseleave', function () {
            $(this).removeClass('hovered');
        });

        $('.btn-text-parallax').on('mousemove', function (e) {
            const bounds = this.getBoundingClientRect();
            const centerX = bounds.left + bounds.width / 2;
            const centerY = bounds.top + bounds.height;
            const deltaX = Math.floor((centerX - e.clientX)) * 0.222;
            const deltaY = Math.floor((centerY - e.clientY)) * 0.333;
            $(this).find('.pxl--btn-text').css({
                transform: 'translate3d(' + deltaX * 0.32 + 'px, ' + deltaY * 0.32 + 'px, 0px)'
            });
        });

        $('.pxl-blog-style2 .pxl-post--featured, .pxl-hover-parallax').on('mousemove', function (e) {
            const bounds = this.getBoundingClientRect();
            const centerX = bounds.left + bounds.width / 2;
            const centerY = bounds.top + bounds.height;
            const deltaX = Math.floor((centerX - e.clientX)) * 0.222;
            const deltaY = Math.floor((centerY - e.clientY)) * 0.333;
            $(this).find('.pxl-item-parallax, .pxl-post--button').css({
                transform: 'translate3d(' + deltaX * 0.32 + 'px, ' + deltaY * 0.32 + 'px, 0px)'
            });
        });
    }

    function carryon_el_parallax() {
        $('.el-parallax-wrap').on({
            mouseenter: function () {
                const $this = $(this);
                $this.addClass('hovered');
                $this.find('.el-parallax-item').css({
                    transition: 'none'
                });
            },
            mouseleave: function () {
                const $this = $(this);
                $this.removeClass('hovered');
                $this.find('.el-parallax-item').css({
                    transition: 'transform 0.5s ease',
                    transform: 'translate3d(0px, 0px, 0px)'
                });
            },
            mousemove: function (e) {
                const $this = $(this);
                const bounds = this.getBoundingClientRect();
                const centerX = bounds.left + bounds.width / 2;
                const centerY = bounds.top + bounds.height / 2;
                const deltaX = (centerX - e.clientX) * 0.07104;
                const deltaY = (centerY - e.clientY) * 0.10656;

                requestAnimationFrame(() => {
                    $this.find('.el-parallax-item').css({
                        transform: `translate3d(${deltaX}px, ${deltaY}px, 0px)`
                    });
                });
            }
        });
    }
    /* Button Parallax */
    function carryon_text_parallax() {
        const $buttons = $('.btn-style-4,.pxl-anchor-button');
        if ($buttons.length === 0) {
            return;
        }
        $buttons.on('mouseenter', function () {
            const $text = $(this).find('svg');
            if ($text.length === 0) {
                return;
            }
            gsap.set($text, {
                transformOrigin: "50% 50%"
            });
        });
        $buttons.on('mousemove', function (e) {
            const $btn = $(this);
            const $text = $btn.find('.pxl--btn-text,.pxl-anchor-divider');

            if ($text.length === 0) {
                return;
            }
            const { left, top, width, height } = this.getBoundingClientRect();
            const centerX = left + width / 2;
            const centerY = top + height / 2;
            const deltaX = (e.clientX - centerX) * 0.444;
            const deltaY = (e.clientY - centerY) * 0.444;
            gsap.to([$btn, $text], {
                duration: 0.8,
                x: deltaX,
                y: deltaY,
                ease: "power3.out"
            });
        });
        $buttons.on('mouseleave', function () {
            const $btn = $(this);
            const $text = $btn.find('.pxl--btn-text,.pxl-anchor-divider');
            if ($text.length === 0) {
                return;
            }
            gsap.to([$btn, $text], {
                duration: 0.8,
                x: 0,
                y: 0,
                ease: "elastic.out(1, 0.3)"
            });
        });
    }
    /* Menu Divider Move */
    function carryon_menu_divider_move() {
        $('.pxl-nav-menu1.fr-style-box, .pxl-nav-menu1.fr-style-box2').each(function () {
            var current = $(this).find('.pxl-menu-primary > .current-menu-item, .pxl-menu-primary > .current-menu-parent, .pxl-menu-primary > .current-menu-ancestor');
            if (current.length > 0) {
                var marker = $(this).find('.pxl-divider-move');
                marker.css({
                    left: current.position().left,
                    width: current.outerWidth(),
                    display: "block"
                });
                marker.addClass('active');
                current.addClass('pxl-shape-active');
                if (Modernizr.csstransitions) {
                    $(this).find('.pxl-menu-primary > li').mouseover(function () {
                        var self = $(this),
                            offsetLeft = self.position().left,
                            width = self.outerWidth() || current.outerWidth(),
                            left = offsetLeft == 0 ? 0 : offsetLeft || current.position().left;
                        marker.css({
                            left: left,
                            width: width,
                        });
                        marker.addClass('active');
                        current.removeClass('pxl-shape-active');
                    });
                    $(this).find('.pxl-menu-primary').mouseleave(function () {
                        marker.css({
                            left: current.position().left,
                            width: current.outerWidth()
                        });
                        current.addClass('pxl-shape-active');
                    });
                }
            } else {
                var marker = $(this).find('.pxl-divider-move');
                var current = $(this).find('.pxl-menu-primary > li:nth-child(1)');
                marker.css({
                    left: current.position().left,
                    width: current.outerWidth(),
                    display: "block"
                });
                if (Modernizr.csstransitions) {
                    $(this).find('.pxl-menu-primary > li').mouseover(function () {
                        var self = $(this),
                            offsetLeft = self.position().left,
                            width = self.outerWidth() || current.outerWidth(),
                            left = offsetLeft == 0 ? 0 : offsetLeft || current.position().left;
                        marker.css({
                            left: left,
                            width: width,
                        });
                        marker.addClass('active');
                    });
                    $(this).find('.pxl-menu-primary').mouseleave(function () {
                        marker.css({
                            left: current.position().left,
                            width: current.outerWidth()
                        });
                        marker.removeClass('active');
                    });
                }
            }
        });
    }
    function carryon_tab_divider_move() {
        $('.pxl-tabs2').each(function () {
            var current = $(this).find('.pxl-tabs--title > .pxl-item--title.active');
            if (current.length > 0) {
                var marker = $(this).find('.pxl-divider-move');
                marker.css({
                    left: current.position().left,
                    width: current.outerWidth(),
                    display: "block"
                });
                marker.addClass('active');
                current.addClass('pxl-shape-active');
                if (Modernizr.csstransitions) {
                    $(this).find('.pxl-menu-primary > li').mouseover(function () {
                        var self = $(this),
                            offsetLeft = self.position().left,
                            width = self.outerWidth() || current.outerWidth(),
                            left = offsetLeft == 0 ? 0 : offsetLeft || current.position().left;
                        marker.css({
                            left: left,
                            width: width,
                        });
                        marker.addClass('active');
                        current.removeClass('pxl-shape-active');
                    });
                    $(this).find('.pxl-menu-primary').mouseleave(function () {
                        marker.css({
                            left: current.position().left,
                            width: current.outerWidth()
                        });
                        current.addClass('pxl-shape-active');
                    });
                }
            } else {
                var marker = $(this).find('.pxl-divider-move');
                var current = $(this).find('.pxl-menu-primary > li:nth-child(1)');
                marker.css({
                    left: current.position().left,
                    width: current.outerWidth(),
                    display: "block"
                });
                if (Modernizr.csstransitions) {
                    $(this).find('.pxl-menu-primary > li').mouseover(function () {
                        var self = $(this),
                            offsetLeft = self.position().left,
                            width = self.outerWidth() || current.outerWidth(),
                            left = offsetLeft == 0 ? 0 : offsetLeft || current.position().left;
                        marker.css({
                            left: left,
                            width: width,
                        });
                        marker.addClass('active');
                    });
                    $(this).find('.pxl-menu-primary').mouseleave(function () {
                        marker.css({
                            left: current.position().left,
                            width: current.outerWidth()
                        });
                        marker.removeClass('active');
                    });
                }
            }
        });
    }

    /* Back To Top Progress Bar */
    function carryon_backtotop_progess_bar() {
        if ($('.pxl-scroll-top').length > 0) {
            var progressPath = document.querySelector('.pxl-scroll-top path');
            var pathLength = progressPath.getTotalLength();
            progressPath.style.transition = progressPath.style.WebkitTransition = 'none';
            progressPath.style.strokeDasharray = pathLength + ' ' + pathLength;
            progressPath.style.strokeDashoffset = pathLength;
            progressPath.getBoundingClientRect();
            progressPath.style.transition = progressPath.style.WebkitTransition = 'stroke-dashoffset 10ms linear';
            var updateProgress = function () {
                var scroll = $(window).scrollTop();
                var height = $(document).height() - $(window).height();
                var progress = pathLength - (scroll * pathLength / height);
                progressPath.style.strokeDashoffset = progress;
            }
            updateProgress();
            $(window).scroll(updateProgress);
            var offset = 50;
            var duration = 550;
            $(window).on('scroll', function () {
                if ($(this).scrollTop() > offset) {
                    $('.pxl-scroll-top').addClass('active-progress');
                } else {
                    $('.pxl-scroll-top').removeClass('active-progress');
                }
            });
        }
    }
    function carryon_track_order(prefix) {
        $('#goBtn').on('click', function (e) {
            e.preventDefault();

            var prefix = $(this).data('prefix');
            var $input = $('#slug');
            var value = $input.val().trim();
            if (value === '') {
                $input.focus();
                $input.addClass('error');
                return false;
            }
            $input.removeClass('error');

            var finalUrl = prefix + encodeURIComponent(value);
            window.open(finalUrl, '_blank');
        });

        $('#slug').on('keypress', function (e) {
            if (e.which === 13) {
                $('#goBtn').trigger('click');
            }
        });
    }

    function scrollToggleActive() {
        let lastScrollTop = 0;
        $(window).on("scroll", function () {
            let currentScrollTop = $(this).scrollTop();

            if (currentScrollTop < lastScrollTop) {
                $(".fr-style-scroll").addClass("active");
            } else {
                $(".fr-style-scroll").removeClass("active");
            }

            lastScrollTop = currentScrollTop;
        });
    }
    /* Custom Type File Upload*/
    function carryon_type_file_upload() {

        var multipleSupport = typeof $('<input/>')[0].multiple !== 'undefined',
            isIE = /msie/i.test(navigator.userAgent);

        $.fn.pxl_custom_type_file = function () {

            return this.each(function () {

                var $file = $(this).addClass('pxl-file-upload-hidden'),
                    $wrap = $('<div class="pxl-file-upload-wrapper">'),
                    $button = $('<button type="button" class="pxl-file-upload-button">Choose File</button>'),
                    $input = $('<input type="text" class="pxl-file-upload-input" placeholder="No File Choose" />'),
                    $label = $('<label class="pxl-file-upload-button" for="' + $file[0].id + '">Choose File</label>');
                $file.css({
                    position: 'absolute',
                    opacity: '0',
                    visibility: 'hidden'
                });

                $wrap.insertAfter($file)
                    .append($file, $input, (isIE ? $label : $button));

                $file.attr('tabIndex', -1);
                $button.attr('tabIndex', -1);

                $button.on('click', function () {
                    $file.focus().click();
                });

                $file.change(function () {

                    var files = [], fileArr, filename;

                    if (multipleSupport) {
                        fileArr = $file[0].files;
                        for (var i = 0, len = fileArr.length; i < len; i++) {
                            files.push(fileArr[i].name);
                        }
                        filename = files.join(', ');
                    } else {
                        filename = $file.val().split('\\').pop();
                    }

                    $input.val(filename)
                        .attr('title', filename)
                        .focus();
                });

                $input.on({
                    blur: function () { $file.trigger('blur'); },
                    keydown: function (e) {
                        if (e.which === 13) {
                            if (!isIE) {
                                $file.trigger('click');
                            }
                        } else if (e.which === 8 || e.which === 46) {
                            $file.replaceWith($file = $file.clone(true));
                            $file.trigger('change');
                            $input.val('');
                        } else if (e.which === 9) {
                            return;
                        } else {
                            return false;
                        }
                    }
                });

            });

        };
        $('.wpcf7-file[type=file]').pxl_custom_type_file();
    }


    // Fit to Screen
    function carryon_fit_to_screen() {
        $('.pxl-gallery-scroll.h-fit-to-screen').each(function () {
            var h_adminbar = 0;
            var h_section_header = 0;
            var h_section_footer = 0;
            if ($('#wpadminbar').length == 1) {
                h_adminbar = $('#wpadminbar').outerHeight();
            }
            if ($('#pxl-header-elementor').length == 1) {
                h_section_header = $('#pxl-header-elementor').outerHeight();
            }
            if ($('#pxl-footer-elementor').length == 1) {
                h_section_footer = $('#pxl-footer-elementor').outerHeight();
            }
            var h_total = pxl_window_height - (h_adminbar + h_section_header + h_section_footer);
            $(this).css('height', h_total + 'px');
        });
    }

})(jQuery);
