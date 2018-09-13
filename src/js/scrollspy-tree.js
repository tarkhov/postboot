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
