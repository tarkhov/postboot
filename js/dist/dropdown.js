'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DROPDOWN_DATA_KEY = 'bs.dropdown';
var DROPDOWN_EVENT_KEY = '.' + DROPDOWN_DATA_KEY;

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
  DATA_TOGGLE: '[data-toggle="dropdown"]',
  FORM_CHILD: '.dropdown form',
  MENU: '.dropdown-menu',
  NAVBAR_NAV: '.navbar-nav',
  VISIBLE_ITEMS: '.dropdown-menu .dropdown-item:not(.disabled)'
};

var DropdownEvent = {
  HIDE: 'hide' + DROPDOWN_EVENT_KEY,
  HIDDEN: 'hidden' + DROPDOWN_EVENT_KEY,
  SHOW: 'show' + DROPDOWN_EVENT_KEY,
  SHOWN: 'shown' + DROPDOWN_EVENT_KEY
};

var Dropdown = function () {
  function Dropdown(element) {
    _classCallCheck(this, Dropdown);

    element.addEventListener('click', this.toggle);
  }

  _createClass(Dropdown, [{
    key: 'toggle',
    value: function toggle(event) {
      event.preventDefault();

      if (this.disabled || this.classList.contains(DropdownClassName.DISABLED)) {
        return false;
      }

      var parent = Dropdown.getParent(this);
      var isActive = parent.classList.contains(DropdownClassName.SHOW);

      Dropdown.clearMenus(event);

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

      if ('ontouchstart' in document.documentElement && !parent.closest(DropdownSelector.NAVBAR_NAV)) {
        document.body.children.addEventListener('mouseover', function () {});
      }

      this.focus();
      this.setAttribute('aria-expanded', true);

      parent.classList.toggle(DropdownClassName.SHOW);

      var shownEvent = Util.createEvent(DropdownEvent.SHOWN, relatedTarget);
      parent.dispatchEvent(shownEvent);
    }
  }], [{
    key: 'hideMenus',
    value: function hideMenus(event, selector) {
      if (event && (event.which === RIGHT_MOUSE_BUTTON_WHICH || event.type === 'keyup' && event.which !== TAB_KEYCODE)) {
        return;
      }

      var toggles = document.querySelectorAll(selector);
      if (toggles.length) {
        toggles.forEach(function (toggle) {
          var parent = Dropdown.getParent(toggle);
          var relatedTarget = {
            relatedTarget: toggle
          };

          if (!parent.classList.contains(DropdownClassName.SHOW)) {
            return true;
          }

          if (event.target !== toggle && parent.contains(event.target)) {
            return true;
          }

          if (event && (event.type === 'click' && /input|textarea/i.test(event.target.tagName) || event.type === 'keyup' && event.which === TAB_KEYCODE) && parent.contains(event.target)) {
            return true;
          }

          var hideEvent = Util.createEvent(DropdownEvent.HIDE, relatedTarget);
          parent.dispatchEvent(hideEvent);
          if (hideEvent.defaultPrevented) {
            return true;
          }

          if ('ontouchstart' in document.documentElement) {
            document.body.children.removeEventListener('mouseover', function () {});
          }

          toggle.setAttribute('aria-expanded', 'false');

          parent.classList.remove(DropdownClassName.SHOW);

          var hiddenEvent = Util.createEvent(DropdownEvent.HIDDEN, relatedTarget);
          parent.dispatchEvent(hiddenEvent);
        });
      }
    }
  }, {
    key: 'clearMenus',
    value: function clearMenus(event) {
      Dropdown.hideMenus(event, DropdownSelector.DATA_TOGGLE);
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

function dropdown(elements, option) {
  if (typeof elements === 'string') {
    elements = document.querySelectorAll(elements);
  }

  elements.forEach(function (element) {
    var data = void 0;
    if (element.hasAttribute(DROPDOWN_DATA_KEY)) {
      data = element.getAttribute(DROPDOWN_DATA_KEY);
    }

    if (!data) {
      data = new Dropdown(element);
      element.setAttribute(DROPDOWN_DATA_KEY, data);
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
  var dataToggles = document.querySelectorAll(DropdownSelector.DATA_TOGGLE);
  if (dataToggles.length) {
    dataToggles.forEach(function (element) {
      element.addEventListener('keydown', Dropdown.keydown);
      element.addEventListener('click', Dropdown.prototype.toggle);
    });
  }

  var menus = document.querySelectorAll(DropdownSelector.MENU);
  if (menus.length) {
    menus.forEach(function (element) {
      element.addEventListener('keydown', Dropdown.keydown);
    });
  }

  var forms = document.querySelectorAll(DropdownSelector.FORM_CHILD);
  if (forms.length) {
    forms.forEach(function (element) {
      element.addEventListener('click', function (e) {
        e.stopPropagation();
      });
    });
  }

  /*document.addEventListener('click', Dropdown.clearMenus)
  document.addEventListener('keyup', Dropdown.clearMenus)*/
});
