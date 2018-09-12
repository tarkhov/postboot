/*!
 * PostBoot v1.0.0-beta1 (https://tarkhov.github.io/postboot/)
 * Copyright 2016-2018 Alexander Tarkhov
 * Licensed under  ()
 */
if (!('ontouchstart' in document.documentElement)) {
  (function ($) {
    var DATA_KEY     = 'bs.dropdown-hover';
    var EVENT_KEY    = '.' + DATA_KEY;
    var DATA_API_KEY = '.data-api';

    var Event = {
      MOUSEENTER_DATA_API : 'mouseenter' + EVENT_KEY + DATA_API_KEY,
      MOUSELEAVE_DATA_API : 'mouseleave' + EVENT_KEY + DATA_API_KEY
    };

    var ClassName = {
      SHOW : 'show'
    };

    var Selector = {
      DATA_HOVER : '[data-hover="dropdown"]',
      HOVER      : '.dropdown-hover.show'
    };

    $(document)
      .on(Event.MOUSEENTER_DATA_API, Selector.DATA_HOVER, function () {
        var $this = $(this);
        var $parent = $this.closest(Selector.HOVER);
        if (!$parent.hasClass(ClassName.SHOW)) {
          $this.dropdown('toggle');
        }
      })
      .on(Event.MOUSELEAVE_DATA_API, Selector.HOVER, function () {
        $(this).children(Selector.DATA_HOVER).dropdown('toggle');
      });
  })(jQuery);
}

(function ($) {
  var DATA_KEY     = 'bs.dropdown';
  var EVENT_KEY    = '.' + DATA_KEY;
  var DATA_API_KEY = '.data-api';

  var Event = {
    CLICK_DATA_API : 'click' + EVENT_KEY + DATA_API_KEY
  };

  var Selector = {
    MEGA_MENU : '.dropdown-menu-auto, .dropdown-menu-fluid'
  };

  $(document)
    .on(Event.CLICK_DATA_API, Selector.MEGA_MENU, function (event) {
      event.stopPropagation();
    });
})(jQuery);

(function ($) {
  $(window).on('activate.bs.scrollspy', function (event, obj) {
    var target = obj.relatedTarget;
    var selector = '[href="' + target + '"], [data-target="' + target + '"]';

    $('[data-spy="scroll"]').each(function () {
      var spyTarget = $(this).attr('data-target');
      var $spyTarget = $(spyTarget);
      var $item = $spyTarget.find(selector);
      if ($item) {
        $spyTarget.find('.show').removeClass('show');
        $item.parents('.nav-item').addClass('show');
      }
    });
  });
})(jQuery);
