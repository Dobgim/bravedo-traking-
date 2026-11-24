
        jQuery(function($) {
            if (typeof wc_add_to_cart_params === 'undefined') {
                return false;
            }

            $(document.body).on('added_to_cart', function(event, fragments, cart_hash, $button) {
                var $pid = $button.data('product_id');

                $.ajax({
                    type: 'POST',
                    url: wc_add_to_cart_params.ajax_url,
                    data: {
                        'action': 'item_added',
                        'id': $pid
                    },
                    success: function(response) {
                        $('#pxl-cart-sidebar').addClass('active');
                        $("body").addClass('body-overflow');

                        if (fragments && fragments['span.pxl_cart_counter']) {
                            $('.pxl_cart_counter').html($(fragments['span.pxl_cart_counter']).html());
                        }

                        $("#pxl-cart-sidebar .pxl-item--close").on('click', function() {
                            $('body').removeClass('body-overflow');
                            $('#pxl-cart-sidebar').removeClass('active');
                        });
                    }
                });
            });
        });
    