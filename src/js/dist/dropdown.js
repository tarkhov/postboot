'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DROPDOWN_KEY = 'dropdown';
var DROPDOWN_EVENT_KEY = DROPDOWN_KEY;

var SPACE_KEYCODE = 32; // KeyboardEvent.which value for space key
var TAB_KEYCODE = 9; // KeyboardEvent.which value for tab key
var ARROW_UP_KEYCODE = 38; // KeyboardEvent.which value for up arrow key
var ARROW_DOWN_KEYCODE = 40; // KeyboardEvent.which value for down arrow key
var RIGHT_MOUSE_BUTTON_WHICH = 3; // MouseEvent.which value for the right button (assuming a right-handed mouse)
var DROPDOWN_REGEXP_KEYDOWN = new RegExp(ARROW_UP_KEYCODE + '|' + ARROW_DOWN_KEYCODE + '|' + ESCAPE_KEYCODE);

var DropdownClassName = {
  DISABLED: 'disabled',
  SHOW: 'show'
};

var DropdownSelector = {
  DATA_DROPDOWN: '[' + DROPDOWN_KEY + ']',
  DATA_TOGGLE: '[data-toggle="dropdown"]',
  FLUID_MENU: '.dropdown-fluid .dropdown-menu',
  FORM: 'form',
  MENU: '.dropdown-menu',
  NAVBAR_NAV: '.navbar-nav',
  VISIBLE_ITEMS: '.dropdown-menu .dropdown-item:not(.disabled)'
};

var DropdownEvent = {
  HIDE: DROPDOWN_EVENT_KEY + 'hide',
  HIDDEN: DROPDOWN_EVENT_KEY + 'hidden',
  SHOW: DROPDOWN_EVENT_KEY + 'show',
  SHOWN: DROPDOWN_EVENT_KEY + 'shown'
};

var Dropdown = function () {
  function Dropdown(element) {
    var _this = this;

    _classCallCheck(this, Dropdown);

    this.element = element;
    this.parent = Dropdown.getParent(this.element);
    this.menu = this.parent.querySelector(DropdownSelector.MENU);

    this.element.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      _this.toggle(event);
    });
    this.menu.addEventListener('keydown', Dropdown.keydown);

    var form = this.parent.querySelector(DropdownSelector.FORM);
    if (form) {
      form.addEventListener('click', function (event) {
        event.stopPropagation();
      });
    }
  }

  _createClass(Dropdown, [{
    key: 'toggle',
    value: function toggle(event) {
      if (this.element.disabled || this.element.classList.contains(DropdownClassName.DISABLED)) {
        return;
      }

      var isActive = this.parent.classList.contains(DropdownClassName.SHOW);

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

      if ('ontouchstart' in document.documentElement && !this.parent.closest(DropdownSelector.NAVBAR_NAV)) {
        document.body.children.addEventListener('mouseover', function () {});
      }

      this.element.focus();
      this.element.setAttribute('aria-expanded', true);
      this.element.setAttribute(DROPDOWN_KEY, '');

      this.parent.classList.toggle(DropdownClassName.SHOW);

      var shownEvent = Util.createEvent(DropdownEvent.SHOWN, relatedTarget);
      this.parent.dispatchEvent(shownEvent);
    }
  }], [{
    key: 'init',
    value: function init(element) {
      var dropdown = null;

      if (element.hasOwnProperty(DROPDOWN_KEY)) {
        dropdown = element[DROPDOWN_KEY];
      }

      if (!dropdown) {
        dropdown = new Dropdown(element);
        element[DROPDOWN_KEY] = dropdown;
      }

      return dropdown;
    }
  }, {
    key: 'hideMenus',
    value: function hideMenus(event) {
      if (event && (event.which === RIGHT_MOUSE_BUTTON_WHICH || event.type === 'keyup' && event.which !== TAB_KEYCODE)) {
        return;
      }

      var elements = document.querySelectorAll(DropdownSelector.DATA_DROPDOWN);
      if (elements.length) {
        elements.forEach(function (element) {
          if (!element.hasOwnProperty(DROPDOWN_KEY)) {
            return true;
          }

          var parent = element[DROPDOWN_KEY].parent;

          if (!parent.classList.contains(DropdownClassName.SHOW)) {
            return true;
          }

          if (event && event.target !== element && parent.contains(event.target)) {
            return true;
          }

          if (event && (event.type === 'click' && /input|textarea/i.test(event.target.tagName) || event.type === 'keyup' && event.which === TAB_KEYCODE) && parent.contains(event.target)) {
            return true;
          }

          var relatedTarget = {
            relatedTarget: element
          };
          var hideEvent = Util.createEvent(DropdownEvent.HIDE, relatedTarget);
          parent.dispatchEvent(hideEvent);
          if (hideEvent.defaultPrevented) {
            return true;
          }

          if ('ontouchstart' in document.documentElement) {
            document.body.children.removeEventListener('mouseover', function () {});
          }

          element.setAttribute('aria-expanded', 'false');
          element.removeAttribute(DROPDOWN_KEY);

          parent.classList.remove(DropdownClassName.SHOW);

          var hiddenEvent = Util.createEvent(DropdownEvent.HIDDEN, relatedTarget);
          parent.dispatchEvent(hiddenEvent);
        });
      }
    }
  }, {
    key: 'getParent',
    value: function getParent(element) {
      var parent = void 0;
      var selector = Util.getSelector(element);

      if (selector) {
        parent = document.querySelector(selector);
      } else {
        parent = element.parentNode;
      }

      return parent;
    }
  }, {
    key: 'keydown',
    value: function keydown(event) {
      if (!DROPDOWN_REGEXP_KEYDOWN.test(event.which) || /button/i.test(event.target.tagName) && event.which === SPACE_KEYCODE || /input|textarea/i.test(event.target.tagName)) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      if (this.disabled || this.classList.contains(DropdownClassName.DISABLED)) {
        return;
      }

      var parent = Dropdown.getParent(this);
      var isActive = parent.classList.contains(DropdownClassName.SHOW);

      if (!isActive && (event.which !== ESCAPE_KEYCODE || event.which !== SPACE_KEYCODE) || isActive && (event.which === ESCAPE_KEYCODE || event.which === SPACE_KEYCODE)) {

        if (event.which === ESCAPE_KEYCODE) {
          var toggle = parent.querySelector(DropdownSelector.DATA_TOGGLE);
          toggle.dispatchEvent(new FocusEvent('focus'));
        }

        this.dispatchEvent(new MouseEvent('click'));

        return;
      }

      var items = Array.prototype.slice.call(parent.querySelectorAll(DropdownSelector.VISIBLE_ITEMS));

      if (!items.length) {
        return;
      }

      var index = items.indexOf(event.target);

      if (event.which === ARROW_UP_KEYCODE && index > 0) {
        // up
        index--;
      }

      if (event.which === ARROW_DOWN_KEYCODE && index < items.length - 1) {
        // down
        index++;
      }

      if (index < 0) {
        index = 0;
      }

      items[index].focus();
    }
  }]);

  return Dropdown;
}();

function dropdown(element) {
  return Dropdown.init(element);
}

document.addEventListener('DOMContentLoaded', function () {
  var dataToggles = document.querySelectorAll(DropdownSelector.DATA_TOGGLE);
  if (dataToggles.length) {
    dataToggles.forEach(function (element) {
      dropdown(element);
    });
  }

  var fluidMenus = document.querySelectorAll(DropdownSelector.FLUID_MENU);
  if (fluidMenus.length) {
    fluidMenus.forEach(function (element) {
      element.addEventListener('click', function (event) {
        event.stopPropagation();
      });
    });
  }

  /*document.addEventListener('click', Dropdown.clearMenus)
  document.addEventListener('keyup', Dropdown.clearMenus)*/
});
