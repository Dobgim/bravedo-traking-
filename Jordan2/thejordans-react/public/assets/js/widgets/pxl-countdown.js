(function ($) {
    var PXLCountdownBarHandler = function ($scope, $) {

        $('.pxl-countdown').each(function () {
            var _this = $(this);
            var count_down = _this.find('> div').data("count-down");

            // Xác định endDateTime ngay từ đầu
            var endDateTime = count_down ? new Date(count_down).getTime() : null;
            if (!endDateTime || isNaN(endDateTime)) {
                endDateTime = new Date().getTime() + (99 * 24 * 60 * 60 * 1000);
            }

            setInterval(function () {
                var now = new Date().getTime();
                var distance = endDateTime - now;

                // Nếu hết hạn thì reset lại 99 ngày mới
                if (distance <= 0) {
                    endDateTime = new Date().getTime() + (99 * 24 * 60 * 60 * 1000);
                    distance = endDateTime - now;
                }

                var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = Math.floor((distance % (1000 * 60)) / 1000);

                var text_day = days !== 1 ? _this.attr('data-days') : _this.attr('data-day');
                var text_hour = hours !== 1 ? _this.attr('data-hours') : _this.attr('data-hour');
                var text_minu = minutes !== 1 ? _this.attr('data-minutes') : _this.attr('data-minute');
                var text_second = seconds !== 1 ? _this.attr('data-seconds') : _this.attr('data-second');

                days = days < 10 ? '0' + days : days;
                hours = hours < 10 ? '0' + hours : hours;
                minutes = minutes < 10 ? '0' + minutes : minutes;
                seconds = seconds < 10 ? '0' + seconds : seconds;

                var arrDays = days.toString().split('').map(d => '<span>' + d + '</span>');
                var arrHours = hours.toString().split('').map(h => '<span>' + h + '</span>');
                var arrMinutes = minutes.toString().split('').map(m => '<span>' + m + '</span>');
                var arrSeconds = seconds.toString().split('').map(s => '<span>' + s + '</span>');

                _this.html(''
                    + '<div class="countdown-item countdown-day"><div class="countdown-item-inner"><div class="countdown-amount">' + arrDays.join('') + '</div><div class="countdown-period">' + text_day + '</div></div></div>'
                    + '<div class="countdown-item countdown-hour"><div class="countdown-item-inner"><div class="countdown-amount">' + arrHours.join('') + '</div><div class="countdown-period">' + text_hour + '</div></div></div>'
                    + '<div class="countdown-item countdown-minute"><div class="countdown-item-inner"><div class="countdown-amount">' + arrMinutes.join('') + '</div><div class="countdown-period">' + text_minu + '</div></div></div>'
                    + '<div class="countdown-item countdown-second"><div class="countdown-item-inner"><div class="countdown-amount">' + arrSeconds.join('') + '</div><div class="countdown-period">' + text_second + '</div></div></div>'
                );
            }, 1000); // 1 giây refresh 1 lần
        });
    };

    $(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/pxl_countdown.default', PXLCountdownBarHandler);
    });
})(jQuery);
