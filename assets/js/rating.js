/* jQuery Star Rating Plugin
 * 
 * @Author
 * Copyright Nov 02 2010, Irfan Durmus - http://irfandurmus.com/
 *
 * @Version
 * 0.3b
 *
 * @License
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Visit the plugin page for more information.
 * http://irfandurmus.com/projects/jquery-star-rating-plugin/
 *
 */

;(function($) {
    $.fn.rating = function(callback) {
        callback = callback || function() {};

        // Iterate over each element
        this.each(function(i, v) {
            $(v).data('rating', { callback: callback })
                .bind('init.rating', $.fn.rating.init)
                .bind('set.rating', $.fn.rating.set)
                .bind('hover.rating', $.fn.rating.hover)
                .trigger('init.rating');
        });
    };

    $.extend($.fn.rating, {
        init: function(e) {
            var el = $(this),
                list = '',
                isChecked = null,
                childs = el.children(),
                i = 0,
                l = childs.length;

            for (; i < l; i++) {
                list += '<a class="star" title="' + $(childs[i]).val() + '" />';
                if ($(childs[i]).is(':checked')) {
                    isChecked = $(childs[i]).val();
                }
            }

            childs.hide();

            el.append('<div class="stars">' + list + '</div>')
                .trigger('set.rating', isChecked);

            $('a', el).bind('click', $.fn.rating.click);
            el.trigger('hover.rating');
        },
        set: function(e, val) {
            var el = $(this),
                items = $('a', el),
                input = undefined;

            if (val) {
                items.removeClass('fullStar');

                input = items.filter(function(i) {
                    return $(this).attr('title') == val;
                });

                input.addClass('fullStar')
                    .prevAll()
                    .addClass('fullStar');
            }
        },
        hover: function(e) {
            var el = $(this),
                stars = $('a', el);

            stars.bind('mouseenter', function(e) {
                // Add temporary class on mouse enter
                $(this).addClass('tmp_fs')
                    .prevAll()
                    .addClass('tmp_fs');

                $(this).nextAll()
                    .addClass('tmp_es');
            });

            stars.bind('mouseleave', function(e) {
                // Remove temporary class on mouse leave
                $(this).removeClass('tmp_fs')
                    .prevAll()
                    .removeClass('tmp_fs');

                $(this).nextAll()
                    .removeClass('tmp_es');
            });
        },
        click: function(e) {
            e.preventDefault();
            var el = $(e.target),
                container = el.parent().parent(),
                inputs = container.children('input'),
                rate = el.attr('title');

            var matchInput = inputs.filter(function() {
                return $(this).val() == rate;
            });

            matchInput.prop('checked', true)
                .siblings('input').prop('checked', false);

            container.trigger('set.rating', matchInput.val())
                .data('rating').callback(rate, e);
        }
    });

})(jQuery);

