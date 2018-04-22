'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ESCAPE_KEYCODE = 27; // KeyboardEvent.which value for Escape (Esc) key
var SPACE_KEYCODE = 32; // KeyboardEvent.which value for space key
var TAB_KEYCODE = 9; // KeyboardEvent.which value for tab key
var ARROW_UP_KEYCODE = 38; // KeyboardEvent.which value for up arrow key
var ARROW_DOWN_KEYCODE = 40; // KeyboardEvent.which value for down arrow key
var RIGHT_MOUSE_BUTTON_WHICH = 3; // MouseEvent.which value for the right button (assuming a right-handed mouse)
var DROPDOWN_REGEXP_KEYDOWN = new RegExp(ARROW_UP_KEYCODE + '|' + ARROW_DOWN_KEYCODE + '|' + ESCAPE_KEYCODE);

var Dropdown = function () {
  _createClass(Dropdown, null, [{
    key: 'KEY',
    get: function get() {
      return 'dropdown';
    }
  }, {
    key: 'DROPPED_KEY',
    get: function get() {
      return 'dropped';
    }
  }, {
    key: 'EVENT_KEY',
    get: function get() {
      return 'Dropdown';
    }
  }, {
    key: 'ClassName',
    get: function get() {
      return Object.freeze({
        ANIMATING: 'animating',
        DISABLED: 'disabled',
        SHOW: 'show'
      });
    }
  }, {
    key: 'Default',
    get: function get() {
      return Object.freeze({
        menu: null,
        parent: null
      });
    }
  }, {
    key: 'Event',
    get: function get() {
      return Object.freeze({
        HIDE: Dropdown.EVENT_KEY + 'Hide',
        HIDDEN: Dropdown.EVENT_KEY + 'Hidden',
        SHOW: Dropdown.EVENT_KEY + 'Show',
        SHOWN: Dropdown.EVENT_KEY + 'Shown'
      });
    }
  }, {
    key: 'Selector',
    get: function get() {
      return Object.freeze({
        DATA_HOVER: '[data-hover="dropdown"]',
        DATA_TOGGLE: '[data-toggle="dropdown"]',
        DROPPED: '[' + Dropdown.DROPPED_KEY + ']',
        MEGA_MENU: '.dropdown-mega .dropdown-menu',
        FORM: 'form',
        MENU: '.dropdown-menu',
        NAVBAR_NAV: '.navbar-nav',
        VISIBLE_ITEMS: '.dropdown-menu .dropdown-item:not(.disabled)'
      });
    }
  }]);

  function Dropdown(element, config) {
    _classCallCheck(this, Dropdown);

    this.element = element;
    this.config = this.getConfig(config);
    this.parent = this.config.parent || Dropdown.getParent(this.element);
    this.menu = this.config.menu || Dropdown.getMenu(this.element, this.parent);
  }

  _createClass(Dropdown, [{
    key: 'addEventListeners',
    value: function addEventListeners(options) {
      var _this = this;

      var events = options || ['click', 'keyboard'];

      if (events.indexOf('click') >= 0) {
        this.element.addEventListener('click', function (event) {
          event.preventDefault();
          event.stopPropagation();
          _this.toggle(event);
        });

        if (this.menu.classList.contains(Dropdown.Selector.MEGA_MENU)) {
          this.menu.addEventListener('click', function (event) {
            event.stopPropagation();
          });
        }

        var form = this.parent.querySelector(Dropdown.Selector.FORM);
        if (form) {
          form.addEventListener('click', function (event) {
            event.stopPropagation();
          });
        }
      }

      if (events.indexOf('keyboard') >= 0) {
        this.element.addEventListener('keydown', Dropdown.keydown);
        this.menu.addEventListener('keydown', Dropdown.keydown);
      }

      if (events.indexOf('hover') >= 0 && !('ontouchstart' in document.documentElement)) {
        this.element.addEventListener('mouseenter', function (event) {
          return _this.toggle(event);
        });
        this.parent.addEventListener('mouseleave', function () {
          return _this.hide();
        });
      }
    }
  }, {
    key: 'toggle',
    value: function toggle(event) {
      if (this.element.disabled || this.element.classList.contains(Dropdown.ClassName.DISABLED)) {
        return;
      }

      var isActive = this.menu.classList.contains(Dropdown.ClassName.SHOW);

      Dropdown.hideMenus(event);

      if (isActive) {
        return;
      }

      var relatedTarget = {
        relatedTarget: this.element
      };
      var showEvent = Util.createEvent(Dropdown.Event.SHOW, relatedTarget);
      this.parent.dispatchEvent(showEvent);
      if (showEvent.defaultPrevented) {
        return;
      }

      this.element.setAttribute('aria-expanded', 'true');
      this.element.setAttribute(Dropdown.DROPPED_KEY, '');

      this.menu.classList.toggle(Dropdown.ClassName.SHOW);
      this.parent.classList.toggle(Dropdown.ClassName.SHOW);

      var shownEvent = Util.createEvent(Dropdown.Event.SHOWN, relatedTarget);
      this.parent.dispatchEvent(shownEvent);
    }
  }, {
    key: 'hide',
    value: function hide() {
      if (!this.menu.classList.contains(Dropdown.ClassName.SHOW)) {
        return;
      }

      var relatedTarget = {
        relatedTarget: this.element
      };
      var hideEvent = Util.createEvent(Dropdown.Event.HIDE, relatedTarget);
      this.parent.dispatchEvent(hideEvent);
      if (hideEvent.defaultPrevented) {
        return;
      }

      this.element.setAttribute('aria-expanded', 'false');
      this.element.removeAttribute(Dropdown.DROPPED_KEY);

      this.menu.classList.remove(Dropdown.ClassName.SHOW);
      this.parent.classList.remove(Dropdown.ClassName.SHOW);

      var hiddenEvent = Util.createEvent(Dropdown.Event.HIDDEN, relatedTarget);
      this.parent.dispatchEvent(hiddenEvent);
    }
  }, {
    key: 'getConfig',
    value: function getConfig(config) {
      config = Object.assign({}, Dropdown.Default, config);
      return config;
    }
  }], [{
    key: 'hideMenus',
    value: function hideMenus(event) {
      if (event && (event.which === RIGHT_MOUSE_BUTTON_WHICH || event.type === 'keyup' && event.which !== TAB_KEYCODE)) {
        return;
      }

      var elements = document.querySelectorAll(Dropdown.Selector.DROPPED);
      if (elements.length) {
        elements.forEach(function (element) {
          if (!element.hasOwnProperty(Dropdown.KEY)) {
            return true;
          }

          var menu = element[Dropdown.KEY].menu;
          var parent = element[Dropdown.KEY].parent;

          if (!parent.classList.contains(Dropdown.ClassName.SHOW)) {
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
          var hideEvent = Util.createEvent(Dropdown.Event.HIDE, relatedTarget);
          parent.dispatchEvent(hideEvent);
          if (hideEvent.defaultPrevented) {
            return true;
          }

          element.setAttribute('aria-expanded', 'false');
          element.removeAttribute(Dropdown.DROPPED_KEY);

          menu.classList.remove(Dropdown.ClassName.SHOW);
          parent.classList.remove(Dropdown.ClassName.SHOW);

          var hiddenEvent = Util.createEvent(Dropdown.Event.HIDDEN, relatedTarget);
          parent.dispatchEvent(hiddenEvent);
        });
      }
    }
  }, {
    key: 'getParent',
    value: function getParent(element) {
      var parent = void 0;
      var selector = Util.getParentSelector(element);

      if (selector) {
        parent = document.querySelector(selector);
      } else {
        parent = element.parentNode;
      }

      return parent;
    }
  }, {
    key: 'getMenu',
    value: function getMenu(element, parent) {
      var menu = void 0;
      var selector = Util.getSelector(element);

      if (selector) {
        menu = document.querySelector(selector);
      } else {
        menu = parent.querySelector(Dropdown.Selector.MENU);
      }

      return menu;
    }
  }, {
    key: 'keydown',
    value: function keydown(event) {
      if (!DROPDOWN_REGEXP_KEYDOWN.test(event.which) || /button/i.test(event.target.tagName) && event.which === SPACE_KEYCODE || /input|textarea/i.test(event.target.tagName)) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      if (this.disabled || this.classList.contains(Dropdown.ClassName.DISABLED)) {
        return;
      }

      var parent = Dropdown.getParent(this);
      var isActive = parent.classList.contains(Dropdown.ClassName.SHOW);

      if (!isActive && (event.which !== ESCAPE_KEYCODE || event.which !== SPACE_KEYCODE) || isActive && (event.which === ESCAPE_KEYCODE || event.which === SPACE_KEYCODE)) {

        if (event.which === ESCAPE_KEYCODE) {
          var toggle = parent.querySelector(Dropdown.Selector.DATA_TOGGLE);
          toggle.dispatchEvent(new FocusEvent('focus'));
        }

        this.dispatchEvent(new MouseEvent('click'));

        return;
      }

      var items = Array.prototype.slice.call(parent.querySelectorAll(Dropdown.Selector.VISIBLE_ITEMS));

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
  }, {
    key: 'init',
    value: function init(element, config) {
      var dropdown = null;

      if (element.hasOwnProperty(Dropdown.KEY)) {
        dropdown = element[Dropdown.KEY];
      }

      if (!dropdown) {
        dropdown = new Dropdown(element, config);
        element[Dropdown.KEY] = dropdown;
      }

      return dropdown;
    }
  }]);

  return Dropdown;
}();

function dropdown(element, config) {
  return Dropdown.init(element, config);
}

if (typeof PostBoot === 'undefined' || PostBoot.Event.Dropdown !== false) {
  document.addEventListener('DOMContentLoaded', function () {
    var toggles = document.querySelectorAll(Dropdown.Selector.DATA_TOGGLE);
    if (toggles.length) {
      toggles.forEach(function (element) {
        dropdown(element).addEventListeners();
      });
    }

    var hovers = document.querySelectorAll(Dropdown.Selector.DATA_HOVER);
    if (hovers.length) {
      hovers.forEach(function (element) {
        dropdown(element).addEventListeners(['hover']);
      });
    }

    document.addEventListener('click', Dropdown.hideMenus);
    document.addEventListener('keyup', Dropdown.hideMenus);
  });
}
