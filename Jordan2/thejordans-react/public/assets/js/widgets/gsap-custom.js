(function ($) {
    function carryon_split_text($scope) {
        var st = $scope.find(".pxl-split-text");
        if (!st.length) return;

        gsap.registerPlugin(SplitText, ScrollTrigger);

        st.each(function (index, el) {

            var $el = $(el);
            var els = $el.find('p').length ? $el.find('p')[0] : el;
            if (!els) return;

            var pxl_split = new SplitText(els, {
                type: "lines,words,chars",
                lineThreshold: 0.5,
                linesClass: "split-line"
            });

            var split_type_set = pxl_split.chars;
            if (!split_type_set || !split_type_set.length) return;

            gsap.set(els, { perspective: 400 });

            var settings = {
                scrollTrigger: {
                    trigger: els,
                    start: "top 86%",
                    toggleActions: "play none none none",
                    once: true
                },
                duration: 0.8,
                stagger: 0.02,
                ease: "linear"
            };

            if ($el.hasClass('split-in-fade')) {
                settings.opacity = 0;
            }

            if ($el.hasClass('split-in-right')) {
                settings.opacity = 0;
                settings.x = 50;
            }

            if ($el.hasClass('split-in-left')) {
                settings.opacity = 0;
                settings.x = -50;
            }

            if ($el.hasClass('split-in-up')) {
                settings.opacity = 0;
                settings.y = 80;
            }

            if ($el.hasClass('split-in-down')) {
                settings.opacity = 0;
                settings.y = -80;
            }

            if ($el.hasClass('split-in-rotate')) {
                settings.opacity = 0;
                settings.rotateX = 50;
            }

            if ($el.hasClass('split-in-scale')) {
                settings.opacity = 0;
                settings.scale = 0.5;
            }

            if ($el.hasClass('split-lines-transform')) {

                pxl_split.split({ type: "lines" });
                split_type_set = pxl_split.lines;

                settings.opacity = 0;
                settings.yPercent = 100;
                settings.stagger = 0.1;
            }

            if ($el.hasClass('split-lines-rotation-x')) {

                pxl_split.split({ type: "lines" });
                split_type_set = pxl_split.lines;

                settings.opacity = 0;
                settings.rotationX = -120;
                settings.transformOrigin = "top center -50";
                settings.stagger = 0.1;
            }

            if ($el.hasClass('PXLfadeInUp3')) {

                pxl_split.split({ type: "words" });
                split_type_set = pxl_split.words;

                if (!split_type_set.length) return;

                gsap.set(split_type_set, {
                    opacity: 0,
                    y: 50,
                    filter: "blur(15px)",
                    force3D: true
                });

                gsap.to(split_type_set, {
                    scrollTrigger: {
                        trigger: el,
                        start: "top 86%",
                        toggleActions: "play none none none"
                    },
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    duration: 0.6,
                    ease: "power2.out",
                    stagger: 0.05
                });

                return;
            }

            if ($el.hasClass('split-words-scale')) {

                pxl_split.split({ type: "words" });
                split_type_set = pxl_split.words;

                if (!split_type_set.length) return;

                gsap.set(split_type_set, {
                    opacity: 0,
                    scale: (i) => i % 2 === 0 ? 0 : 2,
                    force3D: true
                });

                gsap.to(split_type_set, {
                    scrollTrigger: {
                        trigger: el,
                        start: "top 86%",
                        toggleActions: "play none none none"
                    },
                    scale: 1,
                    opacity: 1,
                    stagger: 0.02
                });

                return;
            }

            if (!split_type_set.length) return;

            var pxl_anim = gsap.from(split_type_set, settings);

            if ($el.hasClass('hover-split-text')) {
                $el.on('mouseenter', function () {
                    pxl_anim.restart();
                });
            }

        });
    }

    // function carryon_scroll_trigger($scope) {

    //     $scope.find(".pxl-icon-box2").each(function () {

    //         const $container = $(this).find(".pxl-item");
    //         if (!$container.length) return;

    //         gsap.fromTo(
    //             $container[0],
    //             {
    //                 width: "20%",
    //                 height: "10%",
    //             },
    //             {
    //                 width: "100%",
    //                 height: "100%",
    //                 borderRadius: 0,
    //                 ease: "power1.out",
    //                 duration: 2,
    //                 scrollTrigger: {
    //                     trigger: $container[0],
    //                     pin: $(this)[0],
    //                     start: "bottom 60%",
    //                     end: "top top",
    //                     scrub: true,
    //                     immediateRender: false
    //                 }
    //             }
    //         );
    //     });
    // }

    function carryon_show_hide_elementor($scope) {
        if (window.innerWidth <= 1025) {
            return;
        }
        $scope.find(".show-container").each(function () {
            var $container = $(this);

            gsap.fromTo(
                $container[0], {
                opacity: 0,
            },
                {
                    opacity: 1,
                    y: 0,
                    scrollTrigger: {
                        trigger: $container[0],
                        toggleActions: "play pause reverse pause",
                        start: "top 40%",
                        end: "top 40%",
                        scrub: 1,
                    }
                }
            );
        });
    }


    function carryon_scroll_fixed_section() {
        const fixed_section_top = $('.pxl-section-fix-top');
        if (fixed_section_top.length > 0) {
            ScrollTrigger.matchMedia({
                "(min-width: 991px)": function () {
                    const pinnedSections = ['.pxl-section-fix-top'];
                    pinnedSections.forEach(className => {
                        gsap.to(".pxl-section-fix-bottom", {
                            scrollTrigger: {
                                trigger: ".pxl-section-fix-bottom",
                                scrub: true,
                                pin: className,
                                pinSpacing: false,
                                start: 'top bottom',
                                end: "bottom top",
                            },
                        });
                        gsap.to(".pxl-section-fix-bottom .pxl-section-overlay-color", {
                            scrollTrigger: {
                                trigger: ".pxl-section-fix-bottom",
                                scrub: true,
                                pin: className,
                                pinSpacing: false,
                                start: 'top bottom',
                                end: "bottom top",
                            },
                        });
                    });
                }
            });
        }

        const section_overlay_color = $('.pxl-section-overlay-color');
        if (section_overlay_color.length > 0) {
            const space_top = section_overlay_color.data('space-top');
            const space_left = section_overlay_color.data('space-left');
            const space_right = section_overlay_color.data('space-right');
            const space_bottom = section_overlay_color.data('space-bottom');

            const radius_top = section_overlay_color.data('radius-top');
            const radius_left = section_overlay_color.data('radius-left');
            const radius_right = section_overlay_color.data('radius-right');
            const radius_bottom = section_overlay_color.data('radius-bottom');

            const overlay_radius = radius_top + 'px ' + radius_right + 'px ' + radius_bottom + 'px ' + radius_left + 'px ';

            ScrollTrigger.matchMedia({
                "(min-width: 991px)": function () {
                    const pinnedSections = ['.pxl-bg-color-scroll'];
                    pinnedSections.forEach(className => {
                        gsap.to(".overlay-type-scroll", {
                            scrollTrigger: {
                                trigger: ".pxl-bg-color-scroll",
                                scrub: true,
                                pinSpacing: false,
                                start: 'top bottom',
                                end: "bottom top",
                            },
                            left: space_left + "px",
                            right: space_right + "px",
                            top: space_top + "px",
                            bottom: space_bottom + "px",
                            borderRadius: overlay_radius,
                        });
                    });
                }
            });
        }
    }


    function carryon_scroll_sticky_hide($scope) {
        const $items = $scope.find('.pxl-sticky-effect-scroll .elementor-widget-container');
        const $inners = $scope.find('.pxl-sticky-effect-scroll');
        const $endTrigger = $scope.find('.pxl-sticky-effect-scroll .elementor-widget-container');

        if ($scope.find('.pxl-sticky-effect-scroll').length > 0) {
            window.scrollTo({ top: 0, behavior: 'instant' });
        }

        if ($items.length > 0) {
            $items.each(function (index, item) {
                gsap.to(item, {
                    opacity: 0,
                    scale: 0.8,
                    scrollTrigger: {
                        trigger: item,
                        start: "top top",
                        end: "bottom top",
                        scrub: true,
                    }
                });

                if (index < $items.length - 1) {
                    gsap.to(item, {
                        scrollTrigger: {
                            trigger: item,
                            start: "top top",
                            end: "bottom bottom+=10",
                            endTrigger: $endTrigger[0],
                            scrub: true,
                            pin: true,
                            pinSpacing: false,
                        }
                    });
                }
            });
        }

        $inners.each(function (index, inner) {
            if (index < $inners.length - 1) {
                gsap.to(inner, {
                    yPercent: -30,
                    scale: 1,
                    ease: "Linear.easeNone",
                    scrollTrigger: {
                        trigger: inner,
                        start: "top top",
                        end: "bottom top",
                        scrub: true,
                    }
                });
            }
        });
    }
    function carryon_scroll_text($scope) {
        if ($scope.find(".pxl-item--title.style-scroll-bg").length == 0) return;
        $scope.find(".pxl-item--title.style-scroll-bg").each(function () {
            var $container = $(this);

            var text = new SplitText($container[0], { type: 'words, chars' });

            $(text.words).children().first().addClass("first-char");

            gsap.fromTo(text.chars,
                {
                    position: 'relative',
                    display: 'inline-block',
                    opacity: 0.2,
                    x: -5,
                },
                {
                    opacity: 1,
                    x: 0,
                    stagger: 0.1,
                    scrollTrigger: {
                        trigger: $container[0],
                        toggleActions: "play pause reverse pause",
                        start: "top 70%",
                        end: "top 40%",
                        scrub: 0.7,
                    }
                }
            );
        });
    }

    function carryon_scroll_divider($scope) {
        if ($scope.find(".pxl-el-divider .pxl-item--image").length == 0) return;
        $scope.find(".pxl-el-divider .pxl-item--image").each(function () {

            let el = this;
            let parent = el.parentElement;

            gsap.fromTo(el,
                {
                    x: 0
                },
                {
                    x: () => parent.offsetWidth - el.offsetWidth,
                    ease: "none",
                    scrollTrigger: {
                        trigger: parent,
                        start: "top 95%",
                        end: "top 20%",
                        scrub: 1
                    }
                });

        });
    }
    function carryon_post_horizontal_scroll($scope) {

        let tracks = $scope.find(".pxl-post-slip2 .pxl-post-image--track");
        if (!tracks.length || window.innerWidth < 1201) return;

        tracks.each(function () {

            let track = this;
            let parent = track.parentElement;
            let distance = track.scrollWidth - parent.offsetWidth;

            gsap.to(track, {
                x: () => -distance,
                ease: "none",
                scrollTrigger: {
                    trigger: parent,
                    start: "center center",
                    end: () => "+=" + distance,
                    scrub: 1,
                    pin: parent,
                    invalidateOnRefresh: true
                }
            });

            let images = parent.querySelectorAll(".pxl-el-divider-post .pxl-item--image");

            images.forEach(function (el) {

                let divider = el.parentElement;

                gsap.fromTo(el,
                    { x: 0 },
                    {
                        x: () => divider.offsetWidth - el.offsetWidth,
                        ease: "none",
                        scrollTrigger: {
                            trigger: parent,
                            start: "center center",
                            end: () => "+=" + distance,
                            scrub: 1
                        }
                    }
                );

            });

        });

    }


    $(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/global', function ($scope) {
            carryon_scroll_sticky_hide($scope);
            carryon_show_hide_elementor($scope);
            carryon_scroll_fixed_section();
            carryon_scroll_divider($scope);
            carryon_post_horizontal_scroll($scope);
        });
        elementorFrontend.hooks.addAction('frontend/element_ready/pxl_heading.default', function ($scope) {
            carryon_split_text($scope);
            carryon_scroll_text($scope);
        });

        elementorFrontend.hooks.addAction('frontend/element_ready/pxl_section_scale.default', function ($scope) {
            //carryon_scroll_trigger($scope);
        });
    });


})(jQuery);
