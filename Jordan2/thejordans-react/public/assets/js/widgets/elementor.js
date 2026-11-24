(function ($) {

    function carryon_css_inline_js() {
        var _inline_css = "<style>";
        $(document).find('.pxl-inline-css').each(function () {
            var _this = $(this);
            _inline_css += _this.attr("data-css") + " ";
            _this.remove();
        });
        _inline_css += "</style>";
        $('head').append(_inline_css);
    }
    function carryon_svg_color($scope) {
        "use strict";

        jQuery($scope).find('.pxl-grid .pxl-post--icon img').each(function () {
            var $img = jQuery(this);
            var imgID = $img.attr('id');
            var imgClass = $img.attr('class');
            var imgURL = $img.attr('src');

            jQuery.get(imgURL, function (data) {
                var $svg = jQuery(data).find('svg');
                if (imgID) {
                    $svg.attr('id', imgID);
                }
                if (imgClass) {
                    $svg.attr('class', imgClass + ' replaced-svg');
                }
                $svg.removeAttr('xmlns:a');
                if (!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
                    $svg.attr('viewBox', '0 0 24 24');
                }
                $img.replaceWith($svg);
            }, 'xml');
        });
    }
    var PXL_Icon_Contact_Form = function ($scope, $) {

        setTimeout(function () {
            $('.pxl--item').each(function () {
                var icon_input = $(this).find(".pxl--form-icon"),
                    control_wrap = $(this).find('.wpcf7-form-control');
                control_wrap.before(icon_input.clone());
                icon_input.remove();
            });
        }, 10);

    };



    function carryon_height_margin($scope) {
        $scope.find(".pxl-icon-box4 .pxl-item").each(function () {
            let $content = $(this).find(".pxl-item-content");
            let height = $content.outerHeight() || 0;

            $content.css("margin-bottom", `-${height}px`);
        });

    }


    function carryon_section_start_render() {
        var _elementor = typeof elementor !== "undefined" ? elementor : elementorFrontend;

        if (!_elementor || !_elementor.hooks) {
            console.warn("Elementor hooks not available");
            return;
        }

        _elementor.hooks.addFilter(
            "pxl_element_container/before-render",
            function (html, settings, el) {
                function hex2rgba(color, opacity) {
                    if (!color) return "rgb(0,0,0)";

                    if (color[0] === "#") {
                        color = color.substring(1);
                    }

                    var hex;
                    if (color.length === 6) {
                        hex = [color.substring(0, 2), color.substring(2, 4), color.substring(4, 6)];
                    } else if (color.length === 3) {
                        hex = [color[0] + color[0], color[1] + color[1], color[2] + color[2]];
                    } else {
                        return "rgb(0,0,0)";
                    }

                    var rgb = hex.map(function (h) {
                        return parseInt(h, 16);
                    });

                    if (opacity !== undefined && opacity !== false) {
                        if (Math.abs(opacity) > 1) opacity = 1.0;
                        return "rgba(" + rgb.join(",") + "," + opacity + ")";
                    } else {
                        return "rgb(" + rgb.join(",") + ")";
                    }
                }

                function getLineResponsiveClasses(settings, position) {
                    var responsiveClasses = [];
                    var positionKey = position.replace(/-/g, "_");

                    if (settings["pxl_container_line_hide_laptop_" + positionKey]) {
                        responsiveClasses.push("pxl-hide-laptop");
                    }
                    if (settings["pxl_container_line_hide_tablet_landscape_" + positionKey]) {
                        responsiveClasses.push("pxl-hide-tablet-landscape");
                    }
                    if (settings["pxl_container_line_hide_tablet_portrait_" + positionKey]) {
                        responsiveClasses.push("pxl-hide-tablet-portrait");
                    }
                    if (settings["pxl_container_line_hide_mobile_landscape_" + positionKey]) {
                        responsiveClasses.push("pxl-hide-mobile-landscape");
                    }
                    if (settings["pxl_container_line_hide_mobile_portrait_" + positionKey]) {
                        responsiveClasses.push("pxl-hide-mobile-portrait");
                    }

                    return responsiveClasses.length > 0 ? " " + responsiveClasses.join(" ") : "";
                }

                function getResponsiveLineStyles(settings, isVertical) {
                    var laptopStyle = settings.pxl_container_line_s_laptop || "gr-df";
                    var laptopStyleLr = settings.pxl_container_line_srl_laptop || "gr-df";
                    var laptopColor = settings.pxl_container_line_c_laptop || "";

                    var tabletLandscapeStyle =
                        settings.pxl_container_line_s_tablet_landscape &&
                            settings.pxl_container_line_s_tablet_landscape !== "inherit"
                            ? settings.pxl_container_line_s_tablet_landscape
                            : laptopStyle;
                    var tabletLandscapeStyleLr =
                        settings.pxl_container_line_srl_tablet_landscape &&
                            settings.pxl_container_line_srl_tablet_landscape !== "inherit"
                            ? settings.pxl_container_line_srl_tablet_landscape
                            : laptopStyleLr;
                    var tabletLandscapeColor = settings.pxl_container_line_c_tablet_landscape || laptopColor;

                    var tabletPortraitStyle =
                        settings.pxl_container_line_s_tablet_portrait &&
                            settings.pxl_container_line_s_tablet_portrait !== "inherit"
                            ? settings.pxl_container_line_s_tablet_portrait
                            : tabletLandscapeStyle;
                    var tabletPortraitStyleLr =
                        settings.pxl_container_line_srl_tablet_portrait &&
                            settings.pxl_container_line_srl_tablet_portrait !== "inherit"
                            ? settings.pxl_container_line_srl_tablet_portrait
                            : tabletLandscapeStyleLr;
                    var tabletPortraitColor =
                        settings.pxl_container_line_c_tablet_portrait || tabletLandscapeColor;

                    var mobileLandscapeStyle =
                        settings.pxl_container_line_s_mobile_landscape &&
                            settings.pxl_container_line_s_mobile_landscape !== "inherit"
                            ? settings.pxl_container_line_s_mobile_landscape
                            : tabletPortraitStyle;
                    var mobileLandscapeStyleLr =
                        settings.pxl_container_line_srl_mobile_landscape &&
                            settings.pxl_container_line_srl_mobile_landscape !== "inherit"
                            ? settings.pxl_container_line_srl_mobile_landscape
                            : tabletPortraitStyleLr;
                    var mobileLandscapeColor =
                        settings.pxl_container_line_c_mobile_landscape || tabletPortraitColor;

                    var mobilePortraitStyle =
                        settings.pxl_container_line_s_mobile_portrait &&
                            settings.pxl_container_line_s_mobile_portrait !== "inherit"
                            ? settings.pxl_container_line_s_mobile_portrait
                            : mobileLandscapeStyle;
                    var mobilePortraitStyleLr =
                        settings.pxl_container_line_srl_mobile_portrait &&
                            settings.pxl_container_line_srl_mobile_portrait !== "inherit"
                            ? settings.pxl_container_line_srl_mobile_portrait
                            : mobileLandscapeStyleLr;
                    var mobilePortraitColor =
                        settings.pxl_container_line_c_mobile_portrait || mobileLandscapeColor;

                    return {
                        laptop: {
                            style: isVertical ? laptopStyle : laptopStyleLr,
                            color: laptopColor
                        },
                        tablet_landscape: {
                            style: isVertical ? tabletLandscapeStyle : tabletLandscapeStyleLr,
                            color: tabletLandscapeColor
                        },
                        tablet_portrait: {
                            style: isVertical ? tabletPortraitStyle : tabletPortraitStyleLr,
                            color: tabletPortraitColor
                        },
                        mobile_landscape: {
                            style: isVertical ? mobileLandscapeStyle : mobileLandscapeStyleLr,
                            color: mobileLandscapeColor
                        },
                        mobile_portrait: {
                            style: isVertical ? mobilePortraitStyle : mobilePortraitStyleLr,
                            color: mobilePortraitColor
                        }
                    };
                }

                function generateLineCss(style, color, isVertical) {
                    if (!color) return "";

                    if (isVertical) {
                        switch (style) {
                            case "gr-btt":
                                return (
                                    "background: linear-gradient(180deg, " +
                                    hex2rgba(color, 0) +
                                    " 0%, " +
                                    hex2rgba(color, 0.88) +
                                    " 50%, " +
                                    color +
                                    " 100%);"
                                );
                            case "gr-ttb":
                                return (
                                    "background: linear-gradient(180deg, " +
                                    color +
                                    " 0%, " +
                                    hex2rgba(color, 0.88) +
                                    " 50%, " +
                                    hex2rgba(color, 0) +
                                    " 100%);"
                                );
                            case "gr-df":
                                return (
                                    "background: linear-gradient(180deg, " +
                                    hex2rgba(color, 0) +
                                    " 0%, " +
                                    color +
                                    " 25%, " +
                                    color +
                                    " 50%, " +
                                    color +
                                    " 75%, " +
                                    hex2rgba(color, 0) +
                                    " 100%);"
                                );
                            case "gr-df-bold":
                                return (
                                    "background: linear-gradient(180deg, " +
                                    hex2rgba(color, 0) +
                                    " 0%, " +
                                    hex2rgba(color, 0.8) +
                                    " 25%, " +
                                    color +
                                    " 50%, " +
                                    hex2rgba(color, 0.8) +
                                    " 75%, " +
                                    hex2rgba(color, 0) +
                                    " 100%);"
                                );
                            case "clr":
                                return "background: " + color + ";";
                            default:
                                return "background: " + color + ";";
                        }
                    } else {
                        switch (style) {
                            case "gr-rtl":
                                return (
                                    "background: linear-gradient(90deg, " +
                                    color +
                                    " 0%, " +
                                    hex2rgba(color, 0.88) +
                                    " 50%, " +
                                    hex2rgba(color, 0) +
                                    " 100%);"
                                );
                            case "gr-ltr":
                                return (
                                    "background: linear-gradient(90deg, " +
                                    hex2rgba(color, 0) +
                                    " 0%, " +
                                    hex2rgba(color, 0.88) +
                                    " 50%, " +
                                    color +
                                    " 100%);"
                                );
                            case "gr-df":
                                return (
                                    "background: linear-gradient(90deg, " +
                                    hex2rgba(color, 0) +
                                    " 0%, " +
                                    hex2rgba(color, 0.13) +
                                    " 25%, " +
                                    hex2rgba(color, 0.16) +
                                    " 50%, " +
                                    hex2rgba(color, 0.13) +
                                    " 75%, " +
                                    hex2rgba(color, 0) +
                                    " 100%);"
                                );
                            case "gr-df-bold":
                                return (
                                    "background: linear-gradient(90deg, " +
                                    hex2rgba(color, 0) +
                                    " 0%, " +
                                    hex2rgba(color, 0.8) +
                                    " 25%, " +
                                    hex2rgba(color, 1) +
                                    " 50%, " +
                                    hex2rgba(color, 0.8) +
                                    " 75%, " +
                                    hex2rgba(color, 0) +
                                    " 100%);"
                                );
                            case "clr":
                                return "background: " + color + ";";
                            default:
                                return "background: " + color + ";";
                        }
                    }
                }

                if (
                    typeof settings.pxl_container_border_options !== "undefined" &&
                    Array.isArray(settings.pxl_container_border_options) &&
                    settings.pxl_container_border_options.length > 0
                ) {
                    var sides = settings.pxl_container_border_options;
                    var style = settings.pxl_container_border_style || "1";
                    var styleClass = Array.isArray(style) ? style.join("-") : style;

                    html +=
                        '<div class="pxl-container-border pxl-container-border__style-' + styleClass + '">';
                    sides.forEach(function (side) {
                        html +=
                            '<span class="pxl-container-border__item pxl-container-border__item-' +
                            side +
                            '"></span>';
                    });
                    html += "</div>";
                }

                if (
                    typeof settings.pxl_container_line_o !== "undefined" &&
                    Array.isArray(settings.pxl_container_line_o) &&
                    settings.pxl_container_line_o.length > 0
                ) {
                    var linePositions = settings.pxl_container_line_o;

                    linePositions.forEach(function (item) {
                        var responsiveClassString = getLineResponsiveClasses(settings, item);
                        var isVertical = item === "left" || item === "right" || item.indexOf("vertical") !== -1;
                        var responsiveStyles = getResponsiveLineStyles(settings, isVertical);

                        var laptopCss = generateLineCss(
                            responsiveStyles.laptop.style,
                            responsiveStyles.laptop.color,
                            isVertical
                        );
                        var tabletLandscapeCss = generateLineCss(
                            responsiveStyles.tablet_landscape.style,
                            responsiveStyles.tablet_landscape.color,
                            isVertical
                        );
                        var tabletPortraitCss = generateLineCss(
                            responsiveStyles.tablet_portrait.style,
                            responsiveStyles.tablet_portrait.color,
                            isVertical
                        );
                        var mobileLandscapeCss = generateLineCss(
                            responsiveStyles.mobile_landscape.style,
                            responsiveStyles.mobile_landscape.color,
                            isVertical
                        );
                        var mobilePortraitCss = generateLineCss(
                            responsiveStyles.mobile_portrait.style,
                            responsiveStyles.mobile_portrait.color,
                            isVertical
                        );

                        html +=
                            '<span class="pxl-line pxl-line__' +
                            item +
                            responsiveClassString +
                            '" ' +
                            'data-laptop-style="' +
                            laptopCss +
                            '" ' +
                            'data-tablet-landscape-style="' +
                            tabletLandscapeCss +
                            '" ' +
                            'data-tablet-portrait-style="' +
                            tabletPortraitCss +
                            '" ' +
                            'data-mobile-landscape-style="' +
                            mobileLandscapeCss +
                            '" ' +
                            'data-mobile-portrait-style="' +
                            mobilePortraitCss +
                            '" ' +
                            'style="' +
                            laptopCss +
                            '"></span>';
                    });
                }

                if (
                    typeof settings.pxl_container_overlay_sides !== "undefined" &&
                    Array.isArray(settings.pxl_container_overlay_sides) &&
                    settings.pxl_container_overlay_sides.length > 0
                ) {
                    var sides = settings.pxl_container_overlay_sides;
                    var type = settings.pxl_container_overlay_type || "default";

                    sides.forEach(function (side) {
                        html +=
                            '<span class="pxl-container-overlay__item pxl-container-overlay__item-' +
                            side +
                            " pxl-container-overlay__item-" +
                            type +
                            '"></span>';
                    });
                }

                if (
                    typeof settings.pxl_dot_container_pos !== "undefined" &&
                    Array.isArray(settings.pxl_dot_container_pos) &&
                    settings.pxl_dot_container_pos.length > 0
                ) {
                    var items = settings.pxl_dot_container_pos;
                    var type = settings.pxl_dot_container_type || "default";

                    items.forEach(function (item) {
                        html += '<span class="pxl-dot pxl-dot__' + item + ' pxl-dot__' + type + '"></span>';
                    });
                }

                if (
                    typeof settings.pxl_container_link !== "undefined" &&
                    settings.pxl_container_link &&
                    settings.pxl_container_link.url
                ) {
                    var linkAttributes = [];

                    if (settings.pxl_container_link.url) {
                        linkAttributes.push('href="' + settings.pxl_container_link.url + '"');
                    }

                    if (settings.pxl_container_link.is_external) {
                        linkAttributes.push('target="_blank"');
                    }

                    if (settings.pxl_container_link.nofollow) {
                        linkAttributes.push('rel="nofollow"');
                    }

                    var attributesString = linkAttributes.join(" ");
                    html += "<a " + attributesString + ' class="pxl-container pxl-container__link"></a>';
                }
                function addStarAndLight() {
                    if (
                        settings.pxl_container_star_color_option === "yes" &&
                        settings.pxl_container_star_color
                    ) {
                        const w = (settings.pxl_container_star_width || {}).size ?? null;
                        const wu = (settings.pxl_container_star_width || {}).unit ?? "px";
                        const h = (settings.pxl_container_star_height || {}).size ?? null;
                        const hu = (settings.pxl_container_star_height || {}).unit ?? "px";
                        const n = settings.pxl_container_star_number ?? 60;

                        let starStyle = "";
                        if (Number.isFinite(w)) starStyle += `width:${w}${wu};`;
                        if (Number.isFinite(h)) starStyle += `height:${h}${hu};`;

                        html +=
                            `<canvas class="pxl-star"` +
                            ` data-color="${settings.pxl_container_star_color}"` +
                            ` data-star="${n}"` +
                            ` style="${starStyle}"></canvas>`;
                    }

                    if (
                        settings.pxl_container_light_color_option === "yes" &&
                        settings.pxl_container_light_color
                    ) {
                        const w =
                            (settings.pxl_container_light_width || {}).size ??
                            (settings.pxl_container_star_width || {}).size ??
                            null;
                        const wu =
                            (settings.pxl_container_light_width || {}).unit ??
                            (settings.pxl_container_star_width || {}).unit ??
                            "px";
                        const h =
                            (settings.pxl_container_light_height || {}).size ??
                            (settings.pxl_container_star_height || {}).size ??
                            null;
                        const hu =
                            (settings.pxl_container_light_height || {}).unit ??
                            (settings.pxl_container_star_height || {}).unit ??
                            "px";

                        const blurVal = (settings.pxl_container_light_blur || {}).size ?? 0;
                        const opacityRaw = (settings.pxl_container_light_opacity || {}).size ?? 100;
                        const opacity = Math.max(0, Math.min(+opacityRaw / 100, 1)); // 0 → 1

                        let lightStyle = "";
                        if (Number.isFinite(w)) lightStyle += `width:${w}${wu};`;
                        if (Number.isFinite(h)) lightStyle += `height:${h}${hu};`;
                        lightStyle += `background:${settings.pxl_container_light_color};`;
                        lightStyle += `opacity:${opacity};`;
                        if (blurVal > 0) lightStyle += `filter:blur(${blurVal}px);`;

                        clearTimeout(window.pxlRenderStarTimeout);
                        window.pxlRenderStarTimeout = setTimeout(() => {
                            const canvas = document.createElement("canvas");
                            canvas.className = "pxl-star";
                            canvas.setAttribute("data-color", settings.pxl_container_star_color);
                            canvas.setAttribute("data-star", n);
                            canvas.setAttribute("style", starStyle);

                            document.querySelector(".elementor-element-" + settings._id).appendChild(canvas);
                        }, 2000);
                    }
                }
                addStarAndLight();
                return html;
            }
        );
        _elementor.hooks.addAction("frontend/element_ready/container", function ($scope) {
            var $container = $scope;

            function applyResponsiveLineStyles() {
                const lines = document.querySelectorAll(".pxl-line[data-laptop-style]");
                const windowWidth = window.innerWidth;

                lines.forEach((line) => {
                    let targetStyle = "";

                    if (windowWidth <= 575) {
                        targetStyle =
                            line.getAttribute("data-mobile-portrait-style") ||
                            line.getAttribute("data-mobile-landscape-style") ||
                            line.getAttribute("data-tablet-portrait-style") ||
                            line.getAttribute("data-tablet-landscape-style") ||
                            line.getAttribute("data-laptop-style");
                    } else if (windowWidth <= 767) {
                        targetStyle =
                            line.getAttribute("data-mobile-landscape-style") ||
                            line.getAttribute("data-tablet-portrait-style") ||
                            line.getAttribute("data-tablet-landscape-style") ||
                            line.getAttribute("data-laptop-style");
                    } else if (windowWidth <= 1024) {
                        targetStyle =
                            line.getAttribute("data-tablet-portrait-style") ||
                            line.getAttribute("data-tablet-landscape-style") ||
                            line.getAttribute("data-laptop-style");
                    } else if (windowWidth <= 1366) {
                        targetStyle =
                            line.getAttribute("data-tablet-landscape-style") ||
                            line.getAttribute("data-laptop-style");
                    } else {
                        targetStyle = line.getAttribute("data-laptop-style");
                    }

                    if (targetStyle) {
                        const currentStyles = line.style.cssText.replace(/background[^;]*;?/g, "").trim();
                        line.style.cssText = targetStyle + (currentStyles ? "; " + currentStyles : "");
                    }
                });
            }

            applyResponsiveLineStyles();

            var resizeTimeout;
            $(window).on("resize", function () {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(function () {
                    applyResponsiveLineStyles();
                }, 100);
            });

            if ($container.hasClass("pxl-sticky-container") && $container.data("pxl-sticky")) {
                var stickyOffset = parseInt($container.data("sticky-offset"));
                var stickyMode = $container.data("sticky-mode");
                var triggerPosition = parseInt($container.data("trigger-position"));
                var hideOnFooter = parseInt($container.data("ft-hide"));

                var originalCss = {
                    position: $container.css("position"),
                    top: stickyMode === "top" ? $container.css("top") : "unset",
                    bottom: stickyMode === "bottom" ? $container.css("bottom") : "unset",
                    left: $container.css("left"),
                    width: $container.css("width"),
                    zIndex: $container.css("z-index")
                };

                var ticking = false;
                var $footer = $(".pxl-footer-show");
                var footerTop = $footer.length ? $footer.offset().top : 0;

                function handleScroll() {
                    var scrollTop = $(window).scrollTop();
                    var windowHeight = $(window).height();

                    if (scrollTop >= triggerPosition) {
                        if (footerTop && scrollTop + windowHeight >= footerTop - hideOnFooter) {
                            if ($container.hasClass("pxl-sticky-active")) {
                                var resetCss = { ...originalCss };
                                if (stickyMode === "top") {
                                    delete resetCss.bottom;
                                } else {
                                    delete resetCss.top;
                                }
                                $container.removeClass("pxl-sticky-active").css(resetCss);
                            }
                        } else {
                            if (!$container.hasClass("pxl-sticky-active")) {
                                var containerWidth = $container.outerWidth();
                                var containerLeft = $container.offset().left;

                                var cssProps = {
                                    position: "fixed",
                                    left: containerLeft + "px",
                                    width: containerWidth + "px",
                                    zIndex: 1000
                                };

                                if (stickyMode === "top") {
                                    cssProps.top = stickyOffset + "px";
                                    cssProps.bottom = "unset";
                                } else {
                                    cssProps.bottom = stickyOffset + "px";
                                    cssProps.top = "unset";
                                }

                                $container.addClass("pxl-sticky-active").css(cssProps);
                            }
                        }
                    } else {
                        if ($container.hasClass("pxl-sticky-active")) {
                            $container.removeClass("pxl-sticky-active").css(originalCss);
                        }
                    }
                }

                $(window).on("scroll", function () {
                    if (!ticking) {
                        window.requestAnimationFrame(function () {
                            handleScroll();
                            ticking = false;
                        });
                        ticking = true;
                    }
                });

                $(window).on("resize", function () {
                    if ($container.hasClass("pxl-sticky-active")) {
                        var newWidth = $container.parent().width();
                        var newLeft = $container.parent().offset().left;
                        $container.css({
                            width: newWidth + "px",
                            left: newLeft + "px"
                        });
                    }
                    if ($footer.length) {
                        footerTop = $footer.offset().top;
                    }
                });
            }
        });
    }





    function carryon_zoom_point() {
        elementorFrontend.waypoint($(document).find('.pxl-zoom-point'), function () {
            var offset = $(this).offset();
            var offset_top = offset.top;
            var scroll_top = $(window).scrollTop();
        }, {
            offset: -100,
            triggerOnce: true
        });
    }


    // function carryon_animation_btn($scope) {
    //     const $sections = $scope.find(
    //         '.pxl-video-player .pxl-video--inner, .pxl-portfolio-grid-layout2 .pxl-post--inner'
    //     );

    //     $sections.each(function () {
    //         const $section = $(this);
    //         const cursor = $section.find('.btn-video-wrap, .pxl-content')[0];
    //         if (!cursor) return;

    //         const cursorWidth = cursor.offsetWidth / 2;
    //         const cursorHeight = cursor.offsetHeight / 2;

    //         let mouseX = 0;
    //         let mouseY = 0;
    //         let isMouseOver = false;

    //         $section.on('mousemove', function (e) {
    //             isMouseOver = true;
    //             mouseX = e.pageX;
    //             mouseY = e.pageY;
    //         });

    //         $section.on('mouseenter', function () {
    //             isMouseOver = true;
    //         });

    //         $section.on('mouseleave', function () {
    //             isMouseOver = false;
    //             const sectionCenterX = $section.width() / 2 - cursorWidth;
    //             const sectionCenterY = $section.height() / 2 - cursorHeight;

    //             gsap.to(cursor, {
    //                 x: sectionCenterX,
    //                 y: sectionCenterY,
    //                 ease: 'power1.inOut',
    //                 duration: 0.5
    //             });
    //         });

    //         function render() {
    //             if (isMouseOver) {
    //                 const sectionOffset = $section.offset();

    //                 if (
    //                     mouseX >= sectionOffset.left &&
    //                     mouseX <= sectionOffset.left + $section.width() &&
    //                     mouseY >= sectionOffset.top &&
    //                     mouseY <= sectionOffset.top + $section.height()
    //                 ) {
    //                     gsap.to(cursor, {
    //                         x: mouseX - sectionOffset.left - cursorWidth,
    //                         y: mouseY - sectionOffset.top - cursorHeight,
    //                         ease: 'none',
    //                         duration: 0.1
    //                     });
    //                 }
    //             }
    //             requestAnimationFrame(render);
    //         }

    //         // Đặt cursor ở giữa lúc khởi tạo
    //         const sectionCenterX = $section.width() / 2 - cursorWidth;
    //         const sectionCenterY = $section.height() / 2 - cursorHeight;
    //         gsap.set(cursor, {
    //             x: sectionCenterX,
    //             y: sectionCenterY
    //         });

    //         requestAnimationFrame(render);
    //     });
    // }


    function carryon_img_covermouse($scope) {
        const section = $scope.find('.pxl-image-cover--mouse')[0];
        if (!section) return;

        const images = [...section.querySelectorAll('img')];
        if (images.length === 0) return;

        const MathUtils = {
            lerp: (a, b, n) => (1 - n) * a + n * b,
            distance: (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1)
        };

        let mousePos = { x: 0, y: 0 };
        let lastMousePos = { x: 0, y: 0 };
        let cacheMousePos = { x: 0, y: 0 };
        let imgIndex = 0;
        let zIndexVal = 1;
        const threshold = 100;

        section.addEventListener('mousemove', (ev) => {
            const rect = section.getBoundingClientRect();
            mousePos = {
                x: ev.clientX - rect.left,
                y: ev.clientY - rect.top
            };
        });

        function getMouseRotation(current, last) {
            const dx = current.x - last.x;
            const dy = current.y - last.y;
            return {
                horizontal: Math.min(Math.max(-dx / 10, -10), 10),
                vertical: Math.min(Math.max(-dy / 10, -5), 5)
            };
        }

        function showNextImage() {
            const img = images[imgIndex];
            const rect = img.getBoundingClientRect();
            gsap.killTweensOf(img);

            const rot = getMouseRotation(mousePos, lastMousePos);
            const rotation = rot.horizontal + rot.vertical;

            gsap.timeline()
                .set(img, {
                    opacity: 0,
                    scale: 0.6,
                    zIndex: zIndexVal,
                    x: cacheMousePos.x - rect.width / 2,
                    y: cacheMousePos.y - rect.height / 2,
                    rotation
                })
                // Fade-in nhanh
                .to(img, {
                    duration: 0.25,
                    opacity: 1,
                    scale: 1,
                    ease: "power2.out"
                }, 0)
                // Giữ ảnh lâu hơn (delay ẩn)
                .to(img, {
                    duration: 0.4,
                    ease: "power1.inOut",
                    opacity: 0,
                    scale: 0.2
                }, 0.8); // tăng từ 0.2 lên 0.8 để ảnh hiển thị thêm ~0.6s
        }

        function render() {
            const distance = MathUtils.distance(mousePos.x, mousePos.y, lastMousePos.x, lastMousePos.y);

            cacheMousePos.x = MathUtils.lerp(cacheMousePos.x || mousePos.x, mousePos.x, 0.1);
            cacheMousePos.y = MathUtils.lerp(cacheMousePos.y || mousePos.y, mousePos.y, 0.1);

            if (distance > threshold) {
                showNextImage();
                zIndexVal++;
                imgIndex = (imgIndex + 1) % images.length;
                lastMousePos = { ...mousePos };
            }

            requestAnimationFrame(render);
        }

        images.forEach(img => {
            gsap.set(img, { opacity: 0, scale: 0.6 });
        });

        render();
    }

    function initPxlWrapAnimation($scope) {
        const target = $scope.find(".pxl-wrap-image-scale-in");

        target.each(function () {
            const el = this;

            const observer = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    if (mutation.attributeName === "class") {
                        if ($(el).hasClass("animated")) {
                            $(el).addClass("active-ani");
                            const delay = $(el).attr("data-wow-delay");
                            if (delay) {
                                $(el).css("transition-delay", delay);
                                $(el).find("img").css("animation-delay", delay);
                            }
                        }
                    }
                });
            });

            observer.observe(el, { attributes: true });
        });
    }

    // Chạy khi load trang bình thường
    $(document).ready(function () {
        initPxlWrapAnimation($(document));
    });



    class WebGLContextManager {
        constructor() {
            this.activeContexts = new Map();
            this.maxContexts = 4;
        }

        createContext(canvas, contextType = "2d") {
            const id = canvas.dataset.canvasId || this.generateId();
            canvas.dataset.canvasId = id;

            this.cleanup(id);

            if (this.activeContexts.size >= this.maxContexts) {
                this.cleanupOldest();
            }

            const context = canvas.getContext(contextType, {
                alpha: true,
                antialias: false,
                depth: false,
                stencil: false,
                preserveDrawingBuffer: false,
                powerPreference: "low-power"
            });

            if (context) {
                this.activeContexts.set(id, {
                    canvas,
                    context,
                    type: contextType,
                    created: Date.now()
                });
            }

            return context;
        }

        cleanup(id) {
            const contextData = this.activeContexts.get(id);
            if (contextData) {
                const { canvas, context, type } = contextData;

                if (type === "webgl" || type === "webgl2") {
                    const ext = context.getExtension("WEBGL_lose_context");
                    if (ext) {
                        ext.loseContext();
                    }
                }

                canvas.width = 1;
                canvas.height = 1;

                this.activeContexts.delete(id);
            }
        }

        cleanupOldest() {
            if (this.activeContexts.size === 0) return;

            let oldestId = null;
            let oldestTime = Date.now();

            for (const [id, data] of this.activeContexts) {
                if (data.created < oldestTime) {
                    oldestTime = data.created;
                    oldestId = id;
                }
            }

            if (oldestId) {
                this.cleanup(oldestId);
            }
        }

        cleanupAll() {
            for (const id of this.activeContexts.keys()) {
                this.cleanup(id);
            }
        }

        generateId() {
            return "canvas_" + Math.random().toString(36).substr(2, 9);
        }
    }
    const contextManager = new WebGLContextManager();


    function initBlobEffect() {
        contextManager.cleanupAll();

        const isLowPerformanceDevice = () => {
            return (
                window.innerWidth < 768 ||
                navigator.hardwareConcurrency < 4 ||
                !window.requestAnimationFrame
            );
        };

        if (isLowPerformanceDevice()) {
            return;
        }

        const activeAnimations = new Set();
        let globalAnimationId = null;

        function createSingleEffect($canvas) {
            const canvas = $canvas[0];
            const canvasId = contextManager.generateId();
            canvas.dataset.canvasId = canvasId;
            const ctx = contextManager.createContext(canvas, "2d");
            if (!ctx) {
                return null;
            }

            let width = 0,
                height = 0;
            let dots = [];
            let mouseX = -9999,
                mouseY = -9999;
            let isVisible = true;

            const dotCount = parseInt($canvas.data("star")) || 60;

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        const wasVisible = isVisible;
                        isVisible = entry.isIntersecting;
                        if (isVisible && !wasVisible) {
                            activeAnimations.add(canvasId);
                            if (!globalAnimationId) {
                                globalAnimationId = requestAnimationFrame(globalAnimationLoop);
                            }
                        } else if (!isVisible && wasVisible) {
                            activeAnimations.delete(canvasId);
                        }
                    });
                },
                {
                    threshold: 0.1,
                    rootMargin: "50px"
                }
            );

            observer.observe(canvas);

            let resizeTimeout;
            function handleResize() {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    if (canvas.parentNode) {
                        gsap.set(canvas, { autoAlpha: 0 });
                        waitForStableRect(canvas, () => {
                            resizeCanvas();
                            createInitialDots(dotCount);
                            updateDots();
                            requestAnimationFrame(() => {
                                gsap.to(canvas, {
                                    autoAlpha: 1,
                                    duration: 2,
                                    ease: "power2.out"
                                });
                            });
                        });
                    }
                }, 250);
            }

            function waitForStableRect(canvas, callback) {
                let tries = 0;
                const maxTries = 10;
                let lastRect = canvas.getBoundingClientRect();

                function check() {
                    const newRect = canvas.getBoundingClientRect();
                    const same =
                        Math.abs(newRect.width - lastRect.width) < 1 &&
                        Math.abs(newRect.height - lastRect.height) < 1;

                    if (same || tries >= maxTries) {
                        callback();
                    } else {
                        lastRect = newRect;
                        tries++;
                        requestAnimationFrame(check);
                    }
                }

                requestAnimationFrame(check);
            }

            function resizeCanvas() {
                const rect = canvas.getBoundingClientRect();
                const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

                let safeWidth = Math.min(rect.width, 1920);
                let safeHeight = Math.min(rect.height, 1080);

                if (safeWidth < 10 || safeHeight < 10) {
                    safeWidth = 300;
                    safeHeight = 150;
                }

                canvas.width = safeWidth * dpr;
                canvas.height = safeHeight * dpr;
                canvas.style.width = safeWidth + "px";
                canvas.style.height = safeHeight + "px";

                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.scale(dpr, dpr);

                width = safeWidth;
                height = safeHeight;
            }

            function createDot(x, y) {
                const angle = Math.random() * 2 * Math.PI;
                const speed = 0.05 + Math.random() * 0.1;

                return {
                    x: x,
                    y: y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    radius: 0.5 + Math.random() * 1,
                    phase: Math.random() * Math.PI * 2,
                    baseOpacity: 0.3 + Math.random() * 0.4,
                    opacitySpeed: 0.5 + Math.random() * 0.8
                };
            }

            function createInitialDots(count) {
                dots = [];
                for (let i = 0; i < count; i++) {
                    dots.push(createDot(Math.random() * width, Math.random() * height));
                }
            }

            function updateDots() {
                if (!isVisible || !ctx || width === 0 || height === 0) return;

                ctx.clearRect(0, 0, width, height);

                const t = performance.now() * 0.001;
                const color = $canvas.data("color") || "#ffffff";

                const hex2rgba = (hex, alpha) => {
                    if (!hex) return `rgba(255,255,255,${alpha})`;
                    if (hex[0] === "#") hex = hex.substring(1);

                    const r = parseInt(hex.substring(0, 2), 16);
                    const g = parseInt(hex.substring(2, 4), 16);
                    const b = parseInt(hex.substring(4, 6), 16);

                    return `rgba(${r},${g},${b},${alpha})`;
                };

                dots = dots.filter(
                    (dot) => dot.x >= -10 && dot.x <= width + 10 && dot.y >= -10 && dot.y <= height + 10
                );

                while (dots.length < dotCount) {
                    dots.push(createDot(Math.random() * width, Math.random() * height));
                }

                dots.forEach((dot) => {
                    const pulse = Math.sin(t * dot.opacitySpeed + dot.phase);
                    const currentOpacity = Math.max(0, Math.min(1, dot.baseOpacity + pulse * 0.2));

                    dot.x += dot.vx;
                    dot.y += dot.vy;

                    const dx = mouseX - dot.x;
                    const dy = mouseY - dot.y;
                    const distSq = dx * dx + dy * dy;
                    const maxInfluenceSq = 100 * 100;

                    if (distSq < maxInfluenceSq && distSq > 1) {
                        const influence = (1 - distSq / maxInfluenceSq) * 0.008;
                        dot.vx += dx * influence;
                        dot.vy += dy * influence;
                        dot.vx *= 0.99;
                        dot.vy *= 0.99;
                    }

                    if (dot.x < -5) dot.x = width + 5;
                    if (dot.x > width + 5) dot.x = -5;
                    if (dot.y < -5) dot.y = height + 5;
                    if (dot.y > height + 5) dot.y = -5;

                    const edgeMargin = 80;
                    const distToLeft = Math.max(0, edgeMargin - dot.x);
                    const distToRight = Math.max(0, dot.x - (width - edgeMargin));
                    const distToTop = Math.max(0, edgeMargin - dot.y);
                    const distToBottom = Math.max(0, dot.y - (height - edgeMargin));

                    const maxEdgeDist = Math.max(distToLeft, distToRight, distToTop, distToBottom);
                    const edgeFade =
                        maxEdgeDist > 0 ? Math.max(0, Math.pow(1 - maxEdgeDist / edgeMargin, 2)) : 1;

                    const finalOpacity = currentOpacity * edgeFade;

                    ctx.fillStyle = hex2rgba(color, finalOpacity);
                    ctx.beginPath();
                    ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
                    ctx.fill();

                    if (finalOpacity > 0.3) {
                        const glowOpacity = finalOpacity * 0.2;
                        ctx.fillStyle = hex2rgba(color, glowOpacity);
                        ctx.beginPath();
                        ctx.arc(dot.x, dot.y, dot.radius * 1.5, 0, Math.PI * 2);
                        ctx.fill();
                    }
                });
            }

            canvas.addEventListener(
                "mouseleave",
                () => {
                    mouseX = -9999;
                    mouseY = -9999;
                },
                { passive: true }
            );

            window.addEventListener("resize", handleResize, { passive: true });

            waitForStableRect(canvas, () => {
                gsap.set(canvas, { autoAlpha: 0 });
                waitForStableRect(canvas, () => {
                    resizeCanvas();
                    createInitialDots(dotCount);
                    updateDots();
                    requestAnimationFrame(() => {
                        gsap.to(canvas, {
                            autoAlpha: 1,
                            duration: 2,
                            ease: "power2.out"
                        });
                    });
                });
                requestAnimationFrame(() => { });
            });

            activeAnimations.add(canvasId);

            function cleanup() {
                observer.disconnect();
                activeAnimations.delete(canvasId);
                contextManager.cleanup(canvasId);

                window.removeEventListener("resize", handleResize);

                clearTimeout(resizeTimeout);
            }

            const mutationObserver = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.removedNodes.forEach((node) => {
                        if (node === canvas || (node.contains && node.contains(canvas))) {
                            cleanup();
                        }
                    });
                });
            });

            mutationObserver.observe(document.body, {
                childList: true,
                subtree: true
            });

            return {
                update: updateDots,
                cleanup: cleanup,
                id: canvasId
            };
        }

        function globalAnimationLoop() {
            if (activeAnimations.size === 0) {
                globalAnimationId = null;
                return;
            }

            $(".pxl-star").each(function () {
                const canvasId = this.dataset.canvasId;
                if (activeAnimations.has(canvasId)) {
                    const effectInstance = $(this).data("effectInstance");
                    if (effectInstance && effectInstance.update) {
                        effectInstance.update();
                    }
                }
            });

            globalAnimationId = requestAnimationFrame(globalAnimationLoop);
        }

        $(".pxl-star").each(function () {
            const $canvas = $(this);

            const existingEffect = $canvas.data("effectInstance");
            if (existingEffect && existingEffect.cleanup) {
                existingEffect.cleanup();
            }

            const effectInstance = createSingleEffect($canvas);
            if (effectInstance) {
                $canvas.data("effectInstance", effectInstance);
            }
        });

        if (activeAnimations.size > 0 && !globalAnimationId) {
            globalAnimationId = requestAnimationFrame(globalAnimationLoop);
        }
    }

    function carryon_margin_fix($scope) {
        // ===== helpers nội bộ =====
        function debounce(fn, wait) { let t; return function () { clearTimeout(t); t = setTimeout(() => fn.apply(this, arguments), wait); }; }
        function waitImages($root) {
            const imgs = $root.find('img').toArray();
            if (!imgs.length) return Promise.resolve();
            return Promise.all(imgs.map(img => new Promise(res => { if (img.complete) return res(); jQuery(img).one('load error', res); })));
        }
        function waitFonts() {
            if (document.fonts && document.fonts.ready) return document.fonts.ready.catch(() => { });
            return Promise.resolve();
        }
        function readHeight($el) {
            const el = $el[0]; if (!el) return 0;
            const rectH = el.getBoundingClientRect().height || 0;
            const jqH = $el.outerHeight() || 0;
            return Math.max(rectH, jqH);
        }

        // ===== chuẩn hoá scope =====
        var $ = jQuery;
        var $root = ($scope && $scope.jquery) ? $scope : $(document);
        var $boxes = $root.find('.pxl-icon-box1');
        if (!$boxes.length) return;

        // ===== dọn observer cũ (nếu có) để tránh nhân đôi khi gọi lại =====
        $boxes.each(function () {
            var $box = $(this);
            var ro = $box.data('carryonRO'); if (ro) { try { ro.disconnect(); } catch (e) { } $box.removeData('carryonRO'); }
            var mo = $box.data('carryonMO'); if (mo) { try { mo.disconnect(); } catch (e) { } $box.removeData('carryonMO'); }
        });

        // ===== click: chuyển active như cũ =====
        $root.off('click.carryonFix', '.pxl-icon-box1 .pxl-btn-show')
            .on('click.carryonFix', '.pxl-icon-box1 .pxl-btn-show', function (e) {
                e.preventDefault();
                var $item = $(this).closest('.pxl-item');
                if (!$item.hasClass('active')) {
                    $item.closest('.pxl-icon-box1').find('.pxl-item').removeClass('active');
                    $item.addClass('active');
                }
                measure(); // đổi active thì đo lại
            });

        // ===== đo & gán margin âm =====
        function measureNow() {
            $boxes.find('.pxl-item').each(function () {
                var $content = $(this).find('.content-bottom');
                if (!$content.length) return;
                var h = readHeight($content);
                if (h > 0) $content.css('margin-bottom', -h + 'px');
            });
        }
        var measure = debounce(measureNow, 16); // ~1 frame

        // ===== sau khi assets sẵn sàng, đo lại (double rAF để layout ổn định) =====
        Promise.all([waitImages($boxes), waitFonts()]).then(function () {
            requestAnimationFrame(function () { requestAnimationFrame(function () { measureNow(); }); });
        });

        // ===== resize window =====
        $(window).off('resize.carryonFix').on('resize.carryonFix', measure);

        // ===== ResizeObserver: theo dõi chính .content-bottom thay đổi kích thước =====
        if (window.ResizeObserver) {
            var ro = new ResizeObserver(measure);
            $boxes.find('.content-bottom').each(function () { ro.observe(this); });
            $boxes.data('carryonRO', ro);
        }

        // ===== MutationObserver: DOM/class thay đổi bên trong box =====
        if (window.MutationObserver) {
            var mo = new MutationObserver(measure);
            $boxes.each(function () { mo.observe(this, { childList: true, subtree: true, attributes: true }); });
            $boxes.data('carryonMO', mo);
        }

        // ===== fallback: đo ngay lần đầu =====
        measureNow();
    }


    function carryon_height_carousel() {
        $('.pxl-image-carousel1').each(function () {
            var $carousel = $(this);
            var maxH = 0;

            // reset trước khi tính
            $carousel.find('.pxl-swiper-slide ').css('height', 'auto');

            $carousel.find('.pxl-swiper-slide ').each(function () {
                var h = $(this).outerHeight();
                if (h > maxH) maxH = h;
            });

            if (maxH > 0) {
                $carousel.find('.pxl-swiper-slide ').css('height', maxH + 'px');
            }
        });
    }



    function carryon_image_list_sync($scope, $) {
        var $list = $scope.find('.pxl-image-list');

        $list.each(function () {
            var $wrap = $(this);
            var $contents = $wrap.find('.wrap-content .item-content');
            var $imgs = $wrap.find('.wrap-image img, .wrap-image img');

            if ($contents.length === 0 || $imgs.length === 0) return;

            $contents.removeClass('active').first().addClass('active');
            $imgs.removeClass('active').first().addClass('active');

            $contents.each(function (index) {
                $(this).on('mouseenter', function () {

                    $contents.removeClass('active');
                    $imgs.removeClass('active');

                    $(this).addClass('active');
                    $imgs.eq(index).addClass('active');
                });
            });
        });
    }

    function carryon_content_hide_margin($scope) {
        var $root = $scope && $scope.length ? $scope : $(document);
        function applyMargin() {
            $root.find('.pxl-blog-grid-layout1 .pxl-grid-item .pxl-post--inner .content-hide, .pxl-team-carousel1 .pxl-swiper-slide .pxl-item--inner .pxl-item--description,.pxl-post-carousel1 .pxl-swiper-slide .pxl-post--inner .content-hide')
                .each(function () {
                    let $this = $(this);
                    let height = $this.outerHeight() || 0;
                    $this.css('margin-bottom', '-' + height + 'px');
                });
        }
        applyMargin();
        $(window).on('load resize', function () {
            applyMargin();
        });
        $(document).ajaxComplete(function () {
            applyMargin();
        });
        if (typeof elementorFrontend !== 'undefined' && elementorFrontend.isEditMode()) {
            setTimeout(() => {
                applyMargin();
            }, 300);
        }
    }
    function carryon_tabs_sync($scope = $(document)) {
        var $root = $scope.find('.elementor-element').addBack().filter('.elementor-element');
        var $sections = $root.find('.pxl-navigation-tab').parents('.elementor-element').not('[data-shehran-tabs-init]');

        if (!$sections.length) return;

        $sections.each(function () {
            var $section = $(this);
            $section.attr('data-shehran-tabs-init', '1');
            $section.addClass('pxl--hide-arrow');
            setTimeout(function () {
                var $tabs = $section.find('.pxl-tabs .pxl-tabs--title');
                if (!$tabs.length) return;

                var $clone = $tabs.clone();
                var $nav = $section.find('.pxl-navigation-tab');

                if (!$nav.length) return;

                $nav.append($clone);
                $nav.find('.pxl-item--title').off('click.shehran').on('click.shehran', function () {
                    var $titlesNav = $nav.find('.pxl-item--title');
                    var idx = $(this).index();
                    $titlesNav.removeClass('active');
                    $titlesNav.eq(idx).addClass('active');
                    var $titlesTab = $section.find('.pxl-tabs .pxl-item--title');
                    $titlesTab.removeClass('active');

                    var $target = $titlesTab.eq(idx);
                    $target.addClass('active').trigger('click');
                });
            }, 300);
        });
    }
    function carryon_post_image_flex_hover($scope) {
        if (window.innerWidth < 1201) return;

        const HOVER_WIDTH = 44.84;
        const TOTAL = 100;

        const $tracks = jQuery('.pxl-post-slip1 .pxl-post-image--track');
        if (!$tracks.length) return;

        $tracks.each(function () {
            const $track = jQuery(this);
            const $blocks = $track.find('.pxl-post-image--block');

            if ($blocks.length < 2) return;

            const count = $blocks.length;

            function resetFlex() {
                const equal = TOTAL / count;
                $blocks.each(function () {
                    this.style.flexBasis = equal + '%';
                });
            }

            resetFlex();

            $blocks.off('mouseenter.pxlFlexHover');
            $track.off('mouseleave.pxlFlexHover');

            $blocks.on('mouseenter.pxlFlexHover', function (e) {
                const remainWidth = TOTAL - HOVER_WIDTH;
                const otherWidth = remainWidth / (count - 1);

                $blocks.each(function () {
                    if (this === e.currentTarget) {
                        this.style.flexBasis = HOVER_WIDTH + '%';
                    } else {
                        this.style.flexBasis = otherWidth + '%';
                    }
                });
            });

            $track.on('mouseleave.pxlFlexHover', function () {
                requestAnimationFrame(resetFlex);
            });
        });
    }

    function carryon_portfolio_hover_bg() {
        const $layout = $('.pxl-portfolio-grid-layout4');
        if (!$layout.length) return;
        $layout.each(function () {
            const $wrap = $(this);
            const $bg = $wrap.find('.bg-image-hover');

            const $items = $wrap.find('.pxl-grid-inner .pxl-grid-item');

            if (!$bg.length || !$items.length) return;

            const firstImg = $items.eq(0).find('.featured-image img').attr('src');
            if (firstImg) {
                $bg.css('background-image', `url(${firstImg})`);
            }
            $items.off('mouseenter.pxl hover.pxl').on('mouseenter.pxl', function () {
                const imgUrl = $(this).find('.featured-image img').attr('src');
                if (imgUrl) {
                    $bg.css('background-image', `url(${imgUrl})`);
                }
            });

        });
    }
    function pxl_count_grid_items() {
        $('.pxl-portfolio-grid-layout4').each(function () {
            var $layout = $(this);

            var count = $layout.find('.pxl-grid-item').length;
            $layout.find('.pxl-search-results .count').text(count);
        });
    }

    ///Mask Scroll
    function pxlMaskScrollZoom() {
        if (window.innerWidth < 1201) return;
        var $section = $('.pxl-mask-scroll');
        var $reveal = $('.pxl-hero-reveal');

        if (!$section.length || !$reveal.length) return;

        function clamp(v, min, max) {
            return Math.max(min, Math.min(max, v));
        }

        function updateMask() {
            var st = $(window).scrollTop();
            var top = $section.offset().top;

            var dist = window.innerHeight;

            var t = (st - top) / dist;
            t = clamp(t, 0, 1);

            var start = 23;
            var end = 220 * 1.8;
            var size = start + (end - start) * t;

            $reveal.css({
                '-webkit-mask-size': size + 'vmin',
                'mask-size': size + 'vmin'
            });
            if (t >= 1) $section.addClass('active');
            else $section.removeClass('active');
        }
        $(window)
            .off('scroll.pxlMaskZoom resize.pxlMaskZoom')
            .on('scroll.pxlMaskZoom resize.pxlMaskZoom', updateMask);

        updateMask();
    }
    function pxlMaskScrollZoom2() {
        if (window.innerWidth < 1201) return;

        const section = document.querySelector('.pxl-mask-scroll-2');
        if (!section) return;
        // if (document.body.classList.contains('elementor-editor-active')) return;

        if (section.dataset.pxlInit === '1') return;
        section.dataset.pxlInit = '1';

        const ACTIVE_OFFSET = 400;
        const EXTRA_PIN = 1000;
        const TOTAL_SCROLL = ACTIVE_OFFSET + EXTRA_PIN;

        /* ===============================
           1️⃣ PIN
        =============================== */
        const pinST = ScrollTrigger.create({
            id: 'pxl-mask-scroll-2-pin',
            trigger: section,
            start: 'top top',
            end: '+=' + TOTAL_SCROLL,
            pin: true,
            scrub: true,
            anticipatePin: 1
        });
        ScrollTrigger.create({
            id: 'pxl-mask-scroll-2-active',
            trigger: section,

            start: () => pinST.start + ACTIVE_OFFSET,
            end: () => pinST.start + ACTIVE_OFFSET + 1,

            onEnter: () => section.classList.add('active'),
            onLeaveBack: () => section.classList.remove('active')
        });
    }

    function pxlMaskScrollZoom3() {
        if (window.innerWidth < 1201) return;
        const section = document.querySelector('.pxl-mask-scroll-3');
        const content = section?.querySelector('.content-2');
        if (!section || !content) return;
        if (document.body.classList.contains('elementor-editor-active')) return;

        // Cleanup nếu re-init
        ScrollTrigger.getAll().forEach(st => {
            if (st.vars?.id === 'pxl-mask-scroll-3') st.kill();
        });
        gsap.killTweensOf(content);

        const FIRST_SCROLL = 500;   // stage 1
        const SECOND_SCROLL = 500;  // stage 2
        const TOTAL_SCROLL = FIRST_SCROLL + SECOND_SCROLL;

        // Timeline scrub theo px (duration = px) + end = TOTAL_SCROLL
        const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
                id: 'pxl-mask-scroll-3',
                trigger: section,
                start: 'top 80px',
                end: '+=' + TOTAL_SCROLL,
                pin: true,
                scrub: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,

                // ✅ Add active đúng tại end stage 1, và remove khi scroll ngược
                onUpdate(self) {
                    const threshold = FIRST_SCROLL / TOTAL_SCROLL; // mốc cuối stage 1
                    if (self.progress >= threshold) section.classList.add('active');
                    else section.classList.remove('active');
                },

                // đảm bảo reset class khi rời trigger
                onLeaveBack() {
                    section.classList.remove('active');
                }
            }
        });

        // Initial state (bằng GSAP, không cần CSS)
        tl.set(content, {
            clipPath: 'inset(0 0 calc(100% - 723px) calc(100% - 630px) round 10px)',
            webkitClipPath: 'inset(0 0 calc(100% - 723px) calc(100% - 630px) round 10px)'
        });

        // Stage 1: 0 -> 500px
        tl.to(content, {
            clipPath: 'inset(0 0 calc(100% - 723px) 0 round 10px)',
            webkitClipPath: 'inset(0 0 calc(100% - 723px) 0 round 10px)',
            duration: FIRST_SCROLL
        });

        // Stage 2: 500px -> 1000px
        tl.to(content, {
            clipPath: 'inset(0 0 0 0 round 10px)',
            webkitClipPath: 'inset(0 0 0 0 round 10px)',
            duration: SECOND_SCROLL
        });

        // ✅ Click .front-brand => nhảy đến END luôn
        const jumpBtn = section.querySelector('.front-brand');
        if (jumpBtn && !jumpBtn.dataset.pxlJumpBound) {
            jumpBtn.dataset.pxlJumpBound = '1';
            jumpBtn.addEventListener('click', (e) => {
                e.preventDefault();

                const st = ScrollTrigger.getById('pxl-mask-scroll-3');
                if (!st) return;

                const target = Math.round(st.end - 1);

                window.scrollTo({ top: target, behavior: 'smooth' });
            });
        }
    }

    function pxlPortfolioListScaleScroll() {
        var $win = jQuery(window);
        var $doc = jQuery(document);

        if (window.__pxlPortfolioScaleJQ && window.__pxlPortfolioScaleJQ.destroy) {
            window.__pxlPortfolioScaleJQ.destroy();
        }

        if (window.innerWidth < 1201) return;
        if (document.body.classList.contains('elementor-editor-active')) return;

        var $wrap = jQuery('.layout-portfolio-list-1 .pxl-list-inner');
        if (!$wrap.length) return;

        var $items = $wrap.find('.pxl-item').slice(1);
        if (!$items.length) return;

        var START_FROM_BOTTOM = 0;
        var END_FROM_TOP = 150;
        var SCALE_FROM = 0.7;
        var SCALE_TO = 1;

        $items.each(function () {
            var $inner = jQuery(this).find('> .pxl-post--inner');
            if (!$inner.length) $inner = jQuery(this).find('.pxl-post--inner').first();

            $inner.css({
                transformOrigin: 'center center',
                willChange: 'transform',
                transform: 'scale(' + SCALE_FROM + ')'
            });
        });

        function clamp(v, min, max) {
            return Math.max(min, Math.min(max, v));
        }

        function update() {
            if (window.innerWidth < 1201) {
                $items.each(function () {
                    var $inner = jQuery(this).find('> .pxl-post--inner');
                    if (!$inner.length) $inner = jQuery(this).find('.pxl-post--inner').first();
                    $inner.css({ transform: '' });
                });
                return;
            }

            var vh = window.innerHeight;
            var startLine = vh - START_FROM_BOTTOM;
            var endLine = END_FROM_TOP;
            var range = startLine - endLine;

            $items.each(function () {
                var item = this;
                var $inner = jQuery(item).find('> .pxl-post--inner');
                if (!$inner.length) $inner = jQuery(item).find('.pxl-post--inner').first();
                if (!$inner.length) return;

                var top = item.getBoundingClientRect().top;

                var p = (startLine - top) / range;
                p = clamp(p, 0, 1);

                var scale = SCALE_FROM + (SCALE_TO - SCALE_FROM) * p;
                $inner.css('transform', 'scale(' + scale.toFixed(4) + ')');
            });
        }

        var ticking = false;
        function onScrollOrResize() {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(function () {
                ticking = false;
                update();
            });
        }

        $win.on('scroll.pxlPortfolioScaleJQ', onScrollOrResize);
        $win.on('resize.pxlPortfolioScaleJQ', onScrollOrResize);

        update();

        window.__pxlPortfolioScaleJQ = {
            destroy: function () {
                $win.off('.pxlPortfolioScaleJQ');
            }
        };
    }





    // 
    $(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/global', function ($scope) {
            carryon_height_carousel();
            carryon_image_list_sync($scope, $);
            carryon_tabs_sync($scope);
            carryon_post_image_flex_hover($scope);
            carryon_portfolio_hover_bg();
            pxl_count_grid_items();
            pxlMaskScrollZoom();
            pxlMaskScrollZoom2();
            pxlMaskScrollZoom3();
            pxlPortfolioListScaleScroll();
            setTimeout(() => {
                if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                    initBlobEffect();
                }
            }, 300);
            carryon_svg_color($scope);
            carryon_margin_fix($scope);
            initCustomFunctions();
            initPxlWrapAnimation($scope);
            setTimeout(function () {
                carryon_height_margin($scope);
                carryon_content_hide_margin($scope);
            }, 300);
            $(document).ajaxComplete(function () {
                carryon_height_margin($scope);
                carryon_portfolio_hover_bg();
                pxl_count_grid_items();
            });
        });

        carryon_css_inline_js();
        carryon_zoom_point();
        elementorFrontend.hooks.addAction('frontend/element_ready/pxl_contact_form.default', PXL_Icon_Contact_Form);
        elementorFrontend.hooks.addAction('frontend/element_ready/pxl_image_hover_mouse.default', function ($scope) {
            carryon_img_covermouse($scope);
        });

    });
    function initCustomFunctions() {
        try {
            if (typeof carryon_section_start_render === "function") {
                carryon_section_start_render();
            }
        } catch (error) {
            console.error("Error initializing custom functions:", error);
        }
    }

    $(document).ready(function () {
        carryon_portfolio_hover_bg();
        setTimeout(function () {
            if (typeof elementor !== "undefined") {
                initCustomFunctions();
            }
        }, 1000);
    });



})(jQuery);
