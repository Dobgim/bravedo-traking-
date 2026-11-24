(function ($) {
    function carryon_process_cards($scope) {
        if (window.innerWidth < 1201) return;

        gsap.registerPlugin(ScrollTrigger);

        const processSection = $scope.find('.pxl-icon-box2');
        if (!processSection.length) return;

        const cardWrappers = processSection.find('.pxl-item');
        if (!cardWrappers.length) return;

        const cardWrappersArray = cardWrappers.get();
        const itemCount = cardWrappersArray.length;
        const blockHeight = $(cardWrappers[0]).outerHeight() || 295;
        const scrollDistance = blockHeight * itemCount;
        const time = 1;

        // 🔹 Kill chỉ ScrollTrigger liên quan đến section này
        ScrollTrigger.getAll().forEach(st => {
            if (processSection[0].contains(st.trigger)) {
                st.kill();
            }
        });

        cardWrappersArray.forEach(el => {
            el.style.willChange = 'transform, opacity';
        });

        gsap.set(cardWrappersArray, {
            height: blockHeight,
            y: 0,
            transformOrigin: "center top",
            opacity: 1
        });

        const tl = gsap.timeline({
            defaults: { ease: "power2.out" },
            scrollTrigger: {
                trigger: processSection[0],
                start: "top 50px",
                end: `${scrollDistance} top`,
                scrub: 0.6,
                pin: true,
                pinSpacing: true
            }
        });

        tl.to(cardWrappersArray.slice(1), {
            yPercent: (i) => -100 * (i + 1),
            duration: time,
            stagger: time * 0.6,
            ease: "power2.inOut"
        });

        tl.to(cardWrappersArray.slice(0, -1), {
            rotationX: -4,
            stagger: { each: time * 0.6 },
            ease: "power1.inOut"
        }, "<");

        // ScrollTrigger phụ cho từng item
        const totalDuration = tl.duration();
        cardWrappersArray.slice(0, -1).forEach((card, i) => {
            const itemStartTime = 1.2 + i * (time * 0.6);
            const itemEndTime = itemStartTime + time;

            const startScroll = (itemStartTime / totalDuration) * scrollDistance;
            const endScroll = (itemEndTime / totalDuration) * scrollDistance;

            ScrollTrigger.create({
                trigger: processSection[0],
                start: `top+=${startScroll} top`,
                end: `top+=${endScroll} top`,
                scrub: true
            });
        });

        ScrollTrigger.refresh();
    }

    // Hook Elementor
    $(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/global', function ($scope) {
            carryon_process_cards($scope);
        });
    });

    // Re-init khi resize
    $(window).on('resize', function () {
        $('.pxl-icon-box2').each(function () {
            carryon_process_cards($(this).closest('.elementor-element'));
        });
    });

})(jQuery);
