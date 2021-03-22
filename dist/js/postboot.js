/*!
 * PostBoot v1.0.2 (https://tarkhov.github.io/postboot/)
 * Copyright 2016-2021 Alexander Tarkhov
 * Licensed under MIT
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
        if ($parent && !$parent.hasClass(ClassName.SHOW)) {
          $this.dropdown('toggle');
        }
      })
      .on(Event.MOUSELEAVE_DATA_API, Selector.HOVER, function () {
        var $hover = $(this).children(Selector.DATA_HOVER);
        if ($hover.length) {
          $hover.dropdown('toggle');
        }
      });
  })(jQuery);
}

(function ($) {
  var DATA_KEY     = 'bs.dropdown-mega';
  var EVENT_KEY    = '.' + DATA_KEY;
  var DATA_API_KEY = '.data-api';

  var Event = {
    CLICK_DATA_API : 'click' + EVENT_KEY + DATA_API_KEY
  };

  var Selector = {
    MEGA_MENU : '.dropdown-mega-menu'
  };

  $(document)
    .on(Event.CLICK_DATA_API, Selector.MEGA_MENU, function (event) {
      event.stopPropagation();
    });
})(jQuery);

(function ($) {
  var DATA_KEY  = 'bs.scrollspy';
  var EVENT_KEY = '.' + DATA_KEY;

  var Event = {
    ACTIVATE : 'activate' + EVENT_KEY
  };

  var ClassName = {
    DROPDOWN_ITEM : 'dropdown-item',
    NAV_LINK      : 'nav-link',
    SHOW          : 'show'
  };

  var Selector = {
    DATA_SPY      : '[data-spy="scroll"]',
    DROPDOWN_MENU : '.dropdown-menu',
    DROPDOWNS     : '.dropup, .dropright, .dropdown, .dropleft',
    NAV_ITEM      : '.nav-item',
    SHOW          : '.show'
  };

  $(window).on(Event.ACTIVATE, function (event, obj) {
    var url = obj.relatedTarget;
    var selector = '[href="' + url + '"], [data-target="' + url + '"]';

    var $spys = $(Selector.DATA_SPY);
    if (!$spys.length) {
      return true;
    }

    $spys.each(function () {
      var target = $(this).attr('data-target');
      if (!target) {
        return true;
      }

      var $target = $(target);
      if (!$target.length) {
        return true;
      }

      var $link = $target.find(selector);
      if (!$link.length) {
        return true;
      }

      var $show = $target.find(Selector.SHOW);
      if ($show.length) {
        $show.removeClass(ClassName.SHOW);
      }

      var item = null;
      if ($link.hasClass(ClassName.DROPDOWN_ITEM)) {
        item = Selector.DROPDOWN_MENU + ',' + Selector.DROPDOWNS;
      } else if ($link.hasClass(ClassName.NAV_LINK)) {
        item = Selector.NAV_ITEM;
      }

      if (item !== null) {
        $link.parentsUntil(target, item).addClass(ClassName.SHOW);
      }
    });
  });
})(jQuery);
