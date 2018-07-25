if (!('ontouchstart' in document.documentElement)) {
  (function ($) {
    var DATA_KEY     = 'bs.dropdown';
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
