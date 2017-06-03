'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DROPDOWN_HOVER_DATA_KEY = DROPDOWN_DATA_KEY + '.hover';

var DropdownHoverSelector = {
  HOVER: '.dropdown-hover',
  DATA_HOVER: '[data-hover="dropdown"]',
  TOGGLE: '.dropdown-toggle'
};

var DropdownHover = function () {
  function DropdownHover(element) {
    _classCallCheck(this, DropdownHover);

    var parent = Dropdown.getParent(element);

    element.addEventListener('mouseenter', this.show);
    parent.addEventListener('mouseleave', this.hide);
  }

  _createClass(DropdownHover, [{
    key: 'show',
    value: function show() {
      if (this.disabled || this.classList.contains(DropdownClassName.DISABLED)) {
        return false;
      }

      var parent = Dropdown.getParent(this);
      var isActive = parent.classList.contains(DropdownClassName.SHOW);

      DropdownHover.clearMenus();

      if (isActive) {
        return false;
      }

      var relatedTarget = {
        relatedTarget: this
      };
      var showEvent = Util.createEvent(DropdownEvent.SHOW, relatedTarget);

      parent.dispatchEvent(showEvent);

      if (showEvent.defaultPrevented) {
        return false;
      }

      this.setAttribute('aria-expanded', true);
      parent.classList.add(DropdownClassName.SHOW);

      var shownEvent = Util.createEvent(DropdownEvent.SHOWN, relatedTarget);
      parent.dispatchEvent(shownEvent);
    }
  }, {
    key: 'hide',
    value: function hide() {
      if (!this.classList.contains(DropdownClassName.SHOW)) {
        return false;
      }

      var toggle = this.querySelector(DropdownHoverSelector.DATA_HOVER);
      if (!toggle) {
        toggle = this.querySelector(DropdownHoverSelector.TOGGLE);
      }

      var relatedTarget = {
        relatedTarget: toggle
      };

      var hideEvent = Util.createEvent(DropdownEvent.HIDE, relatedTarget);
      this.dispatchEvent(hideEvent);
      if (hideEvent.defaultPrevented) {
        return false;
      }

      toggle.setAttribute('aria-expanded', 'false');
      this.classList.remove(DropdownClassName.SHOW);

      var hiddenEvent = Util.createEvent(DropdownEvent.HIDDEN, relatedTarget);
      this.dispatchEvent(hiddenEvent);
    }
  }], [{
    key: 'clearMenus',
    value: function clearMenus(event) {
      Dropdown.hideMenus(event, DropdownHoverSelector.DATA_HOVER);
    }
  }]);

  return DropdownHover;
}();

function dropdownHover(elements, option) {
  if (typeof elements === 'string') {
    elements = document.querySelectorAll(elements);
  }

  elements.forEach(function (element) {
    var data = void 0;
    if (element.hasAttribute(DROPDOWN_HOVER_DATA_KEY)) {
      data = element.getAttribute(DROPDOWN_HOVER_DATA_KEY);
    }

    if (!data) {
      data = new DropdownHover(element);
      element.setAttribute(DROPDOWN_HOVER_DATA_KEY, data);
    }

    if (typeof option === 'string') {
      if (data[option] === undefined) {
        throw new Error('No method named "' + option + '"');
      }

      data[option].call(element);
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  var dataHovers = document.querySelectorAll(DropdownHoverSelector.DATA_HOVER);
  if (dataHovers.length) {
    dataHovers.forEach(function (element) {
      element.addEventListener('mouseenter', DropdownHover.prototype.show);
    });
  }

  var hovers = document.querySelectorAll('' + DropdownHoverSelector.HOVER);
  if (hovers.length) {
    hovers.forEach(function (element) {
      element.addEventListener('mouseleave', DropdownHover.prototype.hide);
    });
  }
});
