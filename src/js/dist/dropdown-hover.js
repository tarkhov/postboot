'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DROPDOWN_HOVER_KEY = 'dropdownHover';

var DropdownHoverSelector = {
  DATA_HOVER: '[data-hover="dropdown"]'
};

var DropdownHover = function () {
  function DropdownHover(element) {
    _classCallCheck(this, DropdownHover);

    this.element = element;
    this.parent = Dropdown.getParent(this.element);
    this.menu = Dropdown.getMenu(this.element, this.parent);
  }

  _createClass(DropdownHover, [{
    key: 'addEventListeners',
    value: function addEventListeners() {
      var _this = this;

      this.element.addEventListener('mouseenter', function (event) {
        return _this.show(event);
      });
      this.parent.addEventListener('mouseleave', function () {
        return _this.hide();
      });
    }
  }, {
    key: 'show',
    value: function show(event) {
      if (this.element.disabled || this.element.classList.contains(DropdownClassName.DISABLED)) {
        return;
      }

      var isActive = this.menu.classList.contains(DropdownClassName.SHOW);

      Dropdown.hideMenus(event);

      if (isActive) {
        return;
      }

      var relatedTarget = {
        relatedTarget: this.element
      };
      var showEvent = Util.createEvent(DropdownEvent.SHOW, relatedTarget);

      this.parent.dispatchEvent(showEvent);

      if (showEvent.defaultPrevented) {
        return;
      }

      this.element.setAttribute('aria-expanded', true);
      this.element.setAttribute(DROPDOWN_DROPPED_KEY, '');

      this.menu.classList.add(DropdownClassName.SHOW);
      this.parent.classList.add(DropdownClassName.SHOW);

      var shownEvent = Util.createEvent(DropdownEvent.SHOWN, relatedTarget);
      this.parent.dispatchEvent(shownEvent);
    }
  }, {
    key: 'hide',
    value: function hide() {
      if (!this.menu.classList.contains(DropdownClassName.SHOW)) {
        return;
      }

      var relatedTarget = {
        relatedTarget: this.element
      };

      var hideEvent = Util.createEvent(DropdownEvent.HIDE, relatedTarget);
      this.parent.dispatchEvent(hideEvent);
      if (hideEvent.defaultPrevented) {
        return;
      }

      this.element.setAttribute('aria-expanded', 'false');
      this.element.removeAttribute(DROPDOWN_DROPPED_KEY);

      this.menu.classList.remove(DropdownClassName.SHOW);
      this.parent.classList.remove(DropdownClassName.SHOW);

      var hiddenEvent = Util.createEvent(DropdownEvent.HIDDEN, relatedTarget);
      this.parent.dispatchEvent(hiddenEvent);
    }
  }], [{
    key: 'init',
    value: function init(element) {
      var dropdownHover = null;

      if (element.hasOwnProperty(DROPDOWN_HOVER_KEY)) {
        dropdownHover = element[DROPDOWN_HOVER_KEY];
      }

      if (!dropdownHover) {
        dropdownHover = new DropdownHover(element);
        element[DROPDOWN_HOVER_KEY] = dropdownHover;
      }

      return dropdownHover;
    }
  }]);

  return DropdownHover;
}();

function dropdownHover(element) {
  return DropdownHover.init(element);
}

document.addEventListener('DOMContentLoaded', function () {
  var dataHovers = document.querySelectorAll(DropdownHoverSelector.DATA_HOVER);
  if (dataHovers.length) {
    dataHovers.forEach(function (element) {
      dropdownHover(element).addEventListeners();
    });
  }
});
