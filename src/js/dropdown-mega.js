(function ($) {
  var DATA_KEY     = 'bs.dropdown-mega';
  var EVENT_KEY    = '.' + DATA_KEY;
  var DATA_API_KEY = '.data-api';

  var Event = {
    CLICK_DATA_API : 'click' + EVENT_KEY + DATA_API_KEY
  };

  var Selector = {
    MEGA_MENU : '.dropdown-menu-fluid'
  };

  $(document)
    .on(Event.CLICK_DATA_API, Selector.MEGA_MENU, function (event) {
      event.stopPropagation();
    });
})(jQuery);
