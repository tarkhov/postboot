!function ($) {
  var toggle = '[data-hover="dropdown"], [data-toggle="dropdown"]';

  var DropdownHover = function (element) {
    var $element = $(element);
    var $parent = getParent(element);

    $element.on('mouseenter.bs.dropdown-hover', this.show);
    $parent.on('mouseleave.bs.dropdown-hover', this.hide);
  }

  DropdownHover.VERSION = '1.0.0';

  function getParent($this) {
    var selector = $this.attr('data-target');

    if (!selector) {
      selector = $this.attr('href');
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, ''); // strip for ie7
    }

    var $parent = selector && $(selector);

    return $parent && $parent.length ? $parent : $this.parent();
  }

  function clearMenus(e, $current) {
    if (e && e.which === 3) return;

    $('.dropdown-backdrop').remove();

    $(toggle).each(function () {
      var $this         = $(this);
      var $parent       = getParent($this);
      var relatedTarget = { relatedTarget: this };

      if (!$parent.hasClass('show') || $parent.has(toggle)) return;

      if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return;

      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget));

      if (e.isDefaultPrevented()) return;

      $this.attr('aria-expanded', 'false');
      $parent.removeClass('show').trigger('hidden.bs.dropdown', relatedTarget);
    });
  }

  DropdownHover.prototype.show = function (e) {
    var $this = $(this);

    if ($this.is('.disabled, :disabled')) return;

    var $parent = getParent($this);

    clearMenus(e, $parent);

    if (!$parent.hasClass('show')) {
      $parent.addClass('show');
    }
  };

  DropdownHover.prototype.hide = function (e) {
    var $this = $(this);

    clearMenus(e);

    if ($this.hasClass('show')) {
      $this.removeClass('show');
    }
  };

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data  = $this.data('bs.dropdown-hover');

      if (!data) $this.data('bs.dropdown-hover', (data = new DropdownHover(this)));
      if (typeof option == 'string') data[option].call($this);
    });
  }

  var old = $.fn.dropdownHover;

  $.fn.dropdownHover             = Plugin;
  $.fn.dropdownHover.Constructor = DropdownHover;

  $.fn.dropdownHover.noConflict = function () {
    $.fn.dropdownHover = old;
    return this;
  }

  $(document)
    .on('mouseenter.bs.dropdown-hover.data-api', '[data-hover="dropdown"]', DropdownHover.prototype.show)
    .on('mouseleave.bs.dropdown-hover.data-api', '.dropdown-hover.show', DropdownHover.prototype.hide);

  // Mega menu
  $(document).on('click', '.dropdown-static .dropdown-menu', function (e) {
    e.stopPropagation();
  });
}(jQuery);
