/*!
    Copyright (C) 2015 Google Inc., authors, and contributors <see AUTHORS file>
    Licensed under http://www.apache.org/licenses/LICENSE-2.0 <see LICENSE file>
    Created By: ivan@reciprocitylabs.com
    Maintained By: ivan@reciprocitylabs.com
*/
(function ($) {
  var defaults = {
    delay: {
      show: 500,
      hide: 100
    },
    placement: 'left',
    content: function (trigger) {
      var $el = $(new Spinner().spin().el);
      $el.css({
        width: '100px',
        height: '100px',
        left: '50px',
        top: '50px',
        zIndex: calculate_spinner_z_index
      });
      return $el[0];
    }
  };

  // Listeners for initial mouseovers for stick-hover
  $('body').on('mouseover', '[data-popover-trigger="sticky-hover"]', function (e) {
    // If popover instance doesn't exist already, create it and
    // force the 'enter' event.
    if (!$(e.currentTarget).data('sticky_popover')) {
      $(e.currentTarget)
        .sticky_popover($.extend({}, defaults, {
          trigger: 'sticky-hover',
          placement: function () {
            var $el = this.$element;
            var spaceLeft = $(document).width() - ($el.offset().left + $el.width());
            var spaceRight = $el.offset().left;
            var popover_size = 620;
            // Display on right if there is enough space
            if ($el.closest('.widget-area:first-child').length && spaceLeft > popover_size) {
              return 'right';
            } else if (spaceRight > popover_size) {
              return 'left';
            }
            return 'top';
          }
        }))
        .triggerHandler(e);
    }
  });

  // Listeners for initial clicks for popovers
  $('body').on('click', 'a[data-popover-trigger="click"]', function (e) {
    e.preventDefault();
    if (!$(e.currentTarget).data('sticky_popover')) {
      $(e.currentTarget)
        .sticky_popover($.extend({}, defaults, {
          trigger: 'click'
        }))
        .triggerHandler(e);
    }
  });

  function showhide(upsel, downsel) {
    return function (command) {
      $(this).each(function () {
        var $this = $(this);
        var $content = $this.closest(upsel).find(downsel);
        var cmd = command;

        if (typeof cmd !== 'string' || cmd === 'toggle') {
          cmd = $this.hasClass('active') ? 'hide' : 'show';
        }
        if (cmd === 'hide') {
          $content.slideUp();
          $this.removeClass('active');
        } else if (cmd === 'show') {
          $content.slideDown();
          $this.addClass('active');
        }
      });

      return this;
    };
  }

  $.fn.showhide = showhide('.widget', '.content', '.filter');
  $.fn.modal_showhide = showhide('.modal', '.hidden-fields-area');
  $.fn.widget_showhide = showhide('.info', '.hidden-fields-area');
  $.fn.widget_showhide_custom = showhide('.info', '.hidden-fields-area-custom');
  $.fn.widget_showhide_mapped = showhide('.custom-attr-wrap', '.hidden-fields-area');

  $('body').on('click', '.expand-link a', $.fn.modal_showhide);
  $('body').on('click', '.info-expand a', $.fn.widget_showhide);
  $('body').on('click', '.info-expand-custom a', $.fn.widget_showhide_custom);
  $('body').on('click', '.info-expand-mapped a', $.fn.widget_showhide_mapped);

  // Show/hide tree leaf content
  $('body').on('click', '.tree-structure .oneline, .tree-structure .description, .tree-structure .view-more', oneline);

  function oneline(command) {
    $(this).each(function () {
      var $this = $(this);
      var $leaf = $this.closest('[class*=span]').parent().children('[class*=span]:first');
      var $title = $leaf.find('.oneline');
      var $description = $leaf.find('.description');
      var $view = $leaf.closest('.row-fluid').find('.view-more');
      var cmd = command;

      if ($description.length > 0) {
        if (typeof cmd !== 'string') {
          cmd = $description.hasClass('in') ? 'hide' : 'view';
        }

        if (cmd === 'view') {
          $description.addClass('in');
          $title.find('.description-inline').addClass('out');
          if ($title.is('.description-only')) {
            $title.addClass('out');
          }
          $view.text('hide');
        } else if (cmd === 'hide') {
          $description.removeClass('in');
          $title.find('.description-inline').removeClass('out');
          if ($title.is('.description-only')) {
            $title.removeClass('out');
          }
          $view.text('view');
        }
      }
    });

    return this;
  }

  $.fn.oneline = oneline;

  // Close other popovers when one is shown
  $('body').on('show.popover', function (e) {
    $('[data-sticky_popover]').each(function () {
      var popover = $(this).data('sticky_popover');
      // popover && popover.hide();
      popover.hide();
    });
  });

  // Close all popovers on custom event
  $('body').on('kill-all-popovers', function (e) {
    // FIXME: This may be incompatible with bootstrap popover assumptions...
    // This is when the triggering element has been removed from the DOM
    // so we have to kill the popover elements themselves.
    $('.popover').remove();
  });
})(jQuery);
