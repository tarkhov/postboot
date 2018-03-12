/*!
 * PostBoot v1.0.0-beta (https://github.com/tarkhov/postboot)
 * Copyright 2018 Alexander Tarkhov
 * Licensed under  ()
 */
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// https://developer.mozilla.org/ru/docs/Web/API/Element/closest#Specification
(function (e) {
  e.closest = e.closest || function (selector) {
    var node = this;

    while (node) {
      if (node.matches(selector)) {
        return node;
      } else {
        node = node.parentElement;
      }
    }

    return null;
  };

  e.offset = function () {
    var box = this.getBoundingClientRect();

    return {
      top: box.top + window.pageYOffset - document.documentElement.clientTop,
      left: box.left + window.pageXOffset - document.documentElement.clientLeft
    };
  };

  e.position = function () {
    return {
      left: this.offsetLeft,
      top: this.offsetTop
    };
  };
})(Element.prototype);

var Util = function () {
  function Util() {
    _classCallCheck(this, Util);
  }

  _createClass(Util, null, [{
    key: 'createEvent',
    value: function createEvent(type, detail) {
      var event = void 0;
      if (window.CustomEvent) {
        event = new CustomEvent(type, { detail: detail });
      } else {
        event = document.createEvent('CustomEvent');
        event.initCustomEvent(type, true, true, detail);
      }

      return event;
    }
  }, {
    key: 'getSelector',
    value: function getSelector(element) {
      var selector = void 0;
      if (element.hasAttribute('data-target')) {
        selector = element.getAttribute('data-target');
      }

      if (!selector && element.hasAttribute('href')) {
        selector = element.getAttribute('href');
      }

      return selector && selector !== '#' ? selector : null;
    }
  }, {
    key: 'getParentSelector',
    value: function getParentSelector(element) {
      var selector = null;

      if (element.hasAttribute('data-parent')) {
        selector = element.getAttribute('data-parent');
      }

      return selector;
    }
  }]);

  return Util;
}();

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CHECKBOX_BUTTON_KEY = 'checkboxButton';
var CHECKBOX_BUTTON_EVENT_KEY = CHECKBOX_BUTTON_KEY;

var CheckboxButtonClassName = {
  ACTIVE: 'active',
  DISABLED: 'disabled'
};

var CheckboxButtonSelector = {
  DATA_TOGGLE: '[data-toggle="chekbox-button"]',
  INPUT: 'input'
};

var CheckboxButton = function () {
  function CheckboxButton(element) {
    _classCallCheck(this, CheckboxButton);

    this.element = element;
    this.input = this.element.querySelector(CheckboxButtonSelector.INPUT);
  }

  _createClass(CheckboxButton, [{
    key: 'addEventListeners',
    value: function addEventListeners() {
      var _this = this;

      this.element.addEventListener('click', function (event) {
        event.preventDefault();
        _this.toggle();
      });
    }
  }, {
    key: 'toggle',
    value: function toggle() {
      if (this.element.disabled || this.element.classList.contains(CheckboxButtonClassName.DISABLED)) {
        return;
      }

      var isActive = this.element.classList.contains(ButtonClassName.ACTIVE);

      if (this.input) {
        if (this.input.disabled || this.input.classList.contains(RadioButtonClassName.DISABLED)) {
          return;
        }

        this.input.checked = !isActive;
        this.input.dispatchEvent(new Event('change'));
        this.input.focus();
      }

      this.element.setAttribute('aria-pressed', !isActive);
      this.element.classList.toggle(CheckboxButtonClassName.ACTIVE);
    }
  }], [{
    key: 'init',
    value: function init(element) {
      var button = null;

      if (element.hasOwnProperty(CHECKBOX_BUTTON_KEY)) {
        button = element[CHECKBOX_BUTTON_KEY];
      }

      if (!button) {
        button = new CheckboxButton(element);
        element[CHECKBOX_BUTTON_KEY] = button;
      }

      return button;
    }
  }]);

  return CheckboxButton;
}();

function checkboxButton(element) {
  return CheckboxButton.init(element);
}

document.addEventListener('DOMContentLoaded', function () {
  var buttons = document.querySelectorAll(CheckboxButtonSelector.DATA_TOGGLE);
  if (buttons.length) {
    buttons.forEach(function (element) {
      checkboxButton(element).addEventListeners();
    });
  }
});

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RADIO_BUTTON_KEY = 'radioButton';
var RADIO_BUTTON_EVENT_KEY = RADIO_BUTTON_KEY;

var RadioButtonClassName = {
  ACTIVE: 'active',
  DISABLED: 'disabled'
};

var RadioButtonSelector = {
  DATA_TOGGLE: '[data-toggle="radio-button"]',
  INPUT: 'input',
  ACTIVE: '.active'
};

var RadioButton = function () {
  function RadioButton(element) {
    _classCallCheck(this, RadioButton);

    this.element = element;
    this.parent = RadioButton.getParent(element);
    this.input = this.element.querySelector(RadioButtonSelector.INPUT);
  }

  _createClass(RadioButton, [{
    key: 'addEventListeners',
    value: function addEventListeners() {
      var _this = this;

      this.element.addEventListener('click', function (event) {
        event.preventDefault();
        _this.toggle();
      });
    }
  }, {
    key: 'toggle',
    value: function toggle() {
      if (this.element.disabled || this.element.classList.contains(RadioButtonClassName.DISABLED) || this.element.classList.contains(RadioButtonClassName.ACTIVE)) {
        return;
      }

      if (this.input) {
        if (this.input.disabled || this.input.classList.contains(RadioButtonClassName.DISABLED) || this.input.checked) {
          return;
        }

        this.input.checked = true;
        this.input.dispatchEvent(new Event('change'));
        this.input.focus();
      }

      var active = this.parent.querySelector(RadioButtonSelector.ACTIVE);
      if (active) {
        active.classList.remove(RadioButtonClassName.ACTIVE);
      }

      this.element.setAttribute('aria-pressed', true);
      this.element.classList.add(RadioButtonClassName.ACTIVE);
    }
  }], [{
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
    key: 'init',
    value: function init(element) {
      var button = null;

      if (element.hasOwnProperty(RADIO_BUTTON_KEY)) {
        button = element[RADIO_BUTTON_KEY];
      }

      if (!button) {
        button = new RadioButton(element);
        element[RADIO_BUTTON_KEY] = button;
      }

      return button;
    }
  }]);

  return RadioButton;
}();

function radioButton(element) {
  return RadioButton.init(element);
}

document.addEventListener('DOMContentLoaded', function () {
  var buttons = document.querySelectorAll(RadioButtonSelector.DATA_TOGGLE);
  if (buttons.length) {
    buttons.forEach(function (element) {
      radioButton(element).addEventListeners();
    });
  }
});

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DROPDOWN_KEY = 'dropdown';
var DROPDOWN_EVENT_KEY = DROPDOWN_KEY;
var DROPDOWN_DROPPED_KEY = 'dropped';

var ESCAPE_KEYCODE = 27; // KeyboardEvent.which value for Escape (Esc) key
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
  DROPPED: '[' + DROPDOWN_DROPPED_KEY + ']',
  DATA_HOVER: '[data-hover="dropdown"]',
  DATA_TOGGLE: '[data-toggle="dropdown"]',
  MEGA_MENU: '.dropdown-mega .dropdown-menu',
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
    _classCallCheck(this, Dropdown);

    this.element = element;
    this.parent = Dropdown.getParent(this.element);
    this.menu = Dropdown.getMenu(this.element, this.parent);
  }

  _createClass(Dropdown, [{
    key: 'addEventListeners',
    value: function addEventListeners() {
      var _this = this;

      this.element.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        _this.toggle(event);
      });
      this.element.addEventListener('keydown', Dropdown.keydown);
      this.menu.addEventListener('keydown', Dropdown.keydown);

      if (this.menu.classList.contains(DropdownSelector.MEGA_MENU)) {
        this.menu.addEventListener('click', function (event) {
          event.stopPropagation();
        });
      }

      var form = this.parent.querySelector(DropdownSelector.FORM);
      if (form) {
        form.addEventListener('click', function (event) {
          event.stopPropagation();
        });
      }
    }
  }, {
    key: 'addHoverListeners',
    value: function addHoverListeners() {
      var _this2 = this;

      this.element.addEventListener('mouseenter', function (event) {
        return _this2.show(event);
      });
      this.parent.addEventListener('mouseleave', function () {
        return _this2.hide();
      });
    }
  }, {
    key: 'toggle',
    value: function toggle(event) {
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

      if ('ontouchstart' in document.documentElement && !this.parent.closest(DropdownSelector.NAVBAR_NAV)) {
        document.body.children.addEventListener('mouseover', function () {});
      }

      this.element.focus();
      this.element.setAttribute('aria-expanded', true);
      this.element.setAttribute(DROPDOWN_DROPPED_KEY, '');

      this.menu.classList.toggle(DropdownClassName.SHOW);
      this.parent.classList.toggle(DropdownClassName.SHOW);

      var shownEvent = Util.createEvent(DropdownEvent.SHOWN, relatedTarget);
      this.parent.dispatchEvent(shownEvent);
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
    key: 'hideMenus',
    value: function hideMenus(event) {
      if (event && (event.which === RIGHT_MOUSE_BUTTON_WHICH || event.type === 'keyup' && event.which !== TAB_KEYCODE)) {
        return;
      }

      var elements = document.querySelectorAll(DropdownSelector.DROPPED);
      if (elements.length) {
        elements.forEach(function (element) {
          if (!element.hasOwnProperty(DROPDOWN_KEY)) {
            return true;
          }

          var menu = element[DROPDOWN_KEY].menu;
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
          element.removeAttribute(DROPDOWN_DROPPED_KEY);

          menu.classList.remove(DropdownClassName.SHOW);
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
        menu = parent.querySelector(DropdownSelector.MENU);
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
  }, {
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
      dropdown(element).addEventListeners();
    });
  }

  var dataHovers = document.querySelectorAll(DropdownSelector.DATA_HOVER);
  if (dataHovers.length) {
    dataHovers.forEach(function (element) {
      dropdown(element).addHoverListeners();
    });
  }

  document.addEventListener('click', Dropdown.hideMenus);
  document.addEventListener('keyup', Dropdown.hideMenus);
});

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NOTICE_KEY = 'notice';
var NOTICE_EVENT_KEY = NOTICE_KEY;
var NOTICE_TRANSITION_DURATION = 150;

var NoticeSelector = {
  DATA_TOGGLE: '[data-toggle="alert"]',
  DATA_DISMISS: '[data-dismiss="alert"]'
};

var NoticeEvent = {
  HIDE: NOTICE_EVENT_KEY + 'hide',
  HIDDEN: NOTICE_EVENT_KEY + 'hidden',
  SHOW: NOTICE_EVENT_KEY + 'show',
  SHOWN: NOTICE_EVENT_KEY + 'shown'
};

var NoticeClassName = {
  ALERT: 'alert',
  FADE: 'fade',
  HIDE: 'hide',
  SHOW: 'show'
};

var Notice = function () {
  function Notice(element) {
    _classCallCheck(this, Notice);

    this.element = element;
  }

  _createClass(Notice, [{
    key: 'show',
    value: function show() {
      if (this.element.classList.contains(NoticeClassName.SHOW)) {
        return;
      }

      var showEvent = Util.createEvent(NoticeEvent.SHOW);
      this.element.dispatchEvent(showEvent);
      if (showEvent.defaultPrevented) {
        return;
      }

      this.element.setAttribute(NOTICE_KEY, '');

      if (this.element.classList.contains(NoticeClassName.HIDE)) {
        this.element.classList.remove(NoticeClassName.HIDE);
      }
      this.element.classList.add(NoticeClassName.SHOW);

      var shownEvent = Util.createEvent(NoticeEvent.SHOWN);
      this.element.dispatchEvent(shownEvent);
    }
  }, {
    key: 'hide',
    value: function hide() {
      if (this.element.classList.contains(NoticeClassName.HIDE)) {
        return;
      }

      var hideEvent = Util.createEvent(NoticeEvent.HIDE);
      this.element.dispatchEvent(hideEvent);
      if (hideEvent.defaultPrevented) {
        return;
      }

      this.element.removeAttribute(NOTICE_KEY);

      if (this.element.classList.contains(NoticeClassName.SHOW)) {
        this.element.classList.remove(NoticeClassName.SHOW);
      }
      this.element.classList.add(NoticeClassName.HIDE);

      var hiddenEvent = Util.createEvent(NoticeEvent.HIDDEN);
      this.element.dispatchEvent(hiddenEvent);
    }
  }], [{
    key: 'init',
    value: function init(element) {
      var notice = null;

      if (element.hasOwnProperty(NOTICE_KEY)) {
        notice = element[NOTICE_KEY];
      }

      if (!notice) {
        notice = new Notice(element);
        element[NOTICE_KEY] = notice;
      }

      return notice;
    }
  }]);

  return Notice;
}();

function notice(element) {
  return Notice.init(element);
}

document.addEventListener('DOMContentLoaded', function () {
  var dataToggles = document.querySelectorAll(NoticeSelector.DATA_TOGGLE);
  if (dataToggles.length) {
    dataToggles.forEach(function (target) {
      var selector = Util.getSelector(target);
      if (selector) {
        var element = document.querySelector(selector);
        notice(element);
      }
    });
  }
});

'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SCROLLSPY_KEY = 'scrollspy';
var SCROLLSPY_EVENT_KEY = SCROLLSPY_KEY;

var ScrollSpyDefault = {
  offset: 10,
  method: 'auto',
  target: ''
};

var ScrollSpyEvent = {
  ACTIVATE: SCROLLSPY_EVENT_KEY + 'activate'
};

var ScrollSpyClassName = {
  ACTIVE: 'active',
  DROPDOWN_ITEM: 'dropdown-item',
  DROPDOWN_MENU: 'dropdown-menu',
  NAV_LINK: 'nav-link',
  SHOW: 'show'
};

var ScrollSpySelector = {
  ACTIVE: '.active',
  DATA_SPY: '[data-spy="scroll"]',
  DROPDOWN: '.dropdown',
  DROPDOWN_ITEM: '.dropdown-item',
  DROPDOWN_TOGGLE: '.dropdown-toggle',
  LIST_ITEM: '.list-group-item',
  NAV_ITEM: '.nav-item',
  NAV_LINK: '.nav-link',
  NAV_LIST_GROUP: '.nav, .list-group',
  SHOW: '.show'
};

var ScrollSpyOffsetMethod = {
  OFFSET: 'offset',
  POSITION: 'position'
};

var ScrollSpy = function () {
  function ScrollSpy(element, config) {
    var _this = this;

    _classCallCheck(this, ScrollSpy);

    this.element = element;
    this.scrollElement = element.tagName === 'BODY' ? window : element;
    this.config = this.getConfig(config);
    this.target = document.querySelector(this.config.target);
    this.selector = this.config.target + ' ' + ScrollSpySelector.NAV_LINK + ',' + (this.config.target + ' ' + ScrollSpySelector.LIST_ITEM + ',') + (this.config.target + ' ' + ScrollSpySelector.DROPDOWN_ITEM);
    this.offsets = [];
    this.targets = [];
    this.activeTarget = null;
    this.scrollHeight = 0;

    this.scrollElement.addEventListener('scroll', function (event) {
      return _this.process(event);
    });

    this.refresh();
    this.process();
  }

  _createClass(ScrollSpy, [{
    key: 'refresh',
    value: function refresh() {
      var _this2 = this;

      var autoMethod = this.scrollElement !== this.scrollElement.window ? ScrollSpyOffsetMethod.POSITION : ScrollSpyOffsetMethod.OFFSET;

      var offsetMethod = this.config.method === 'auto' ? autoMethod : this.config.method;

      var offsetBase = offsetMethod === ScrollSpyOffsetMethod.POSITION ? this.getScrollTop() : 0;

      this.offsets = [];
      this.targets = [];

      this.scrollHeight = this.getScrollHeight();

      var targets = Array.prototype.slice.call(document.querySelectorAll(this.selector));

      targets.map(function (element) {
        var target = void 0;
        var targetSelector = Util.getSelector(element);

        if (targetSelector) {
          target = document.querySelector(targetSelector);
        }

        if (target) {
          var targetBCR = target.getBoundingClientRect();
          if (targetBCR.width || targetBCR.height) {
            // todo (fat): remove sketch reliance on jQuery position/offset
            return [target[offsetMethod]().top + offsetBase, targetSelector];
          }
        }
        return null;
      }).filter(function (item) {
        return item;
      }).sort(function (a, b) {
        return a[0] - b[0];
      }).forEach(function (item) {
        _this2.offsets.push(item[0]);
        _this2.targets.push(item[1]);
      });
    }
  }, {
    key: 'getConfig',
    value: function getConfig(config) {
      config = Object.assign({}, ScrollSpyDefault, config);
      return config;
    }
  }, {
    key: 'getScrollTop',
    value: function getScrollTop() {
      return this.scrollElement === window ? this.scrollElement.pageYOffset : this.scrollElement.scrollTop;
    }
  }, {
    key: 'getScrollHeight',
    value: function getScrollHeight() {
      return this.scrollElement.scrollHeight || Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    }
  }, {
    key: 'getOffsetHeight',
    value: function getOffsetHeight() {
      return this.scrollElement === window ? window.innerHeight : this.scrollElement.getBoundingClientRect().height;
    }
  }, {
    key: 'process',
    value: function process() {
      var scrollTop = this.getScrollTop() + this.config.offset;
      var scrollHeight = this.getScrollHeight();
      var maxScroll = this.config.offset + scrollHeight - this.getOffsetHeight();

      if (this.scrollHeight !== scrollHeight) {
        this.refresh();
      }

      if (scrollTop >= maxScroll) {
        var target = this.targets[this.targets.length - 1];

        if (this.activeTarget !== target) {
          this.activate(target);
        }
        return;
      }

      if (this.activeTarget && scrollTop < this.offsets[0] && this.offsets[0] > 0) {
        this.activeTarget = null;
        this.clear();
        return;
      }

      for (var i = this.offsets.length; i--;) {
        var isActiveTarget = this.activeTarget !== this.targets[i] && scrollTop >= this.offsets[i] && (this.offsets[i + 1] === undefined || scrollTop < this.offsets[i + 1]);

        if (isActiveTarget) {
          this.activate(this.targets[i]);
        }
      }
    }
  }, {
    key: 'activate',
    value: function activate(target) {
      this.activeTarget = target;

      this.clear();

      var queries = this.selector.split(',');
      queries = queries.map(function (selector) {
        return selector + '[data-target="' + target + '"],' + (selector + '[href="' + target + '"]');
      });

      var link = this.target.querySelector(queries.join(','));

      if (link.classList.contains(ScrollSpyClassName.DROPDOWN_ITEM)) {
        link.closest(ScrollSpySelector.DROPDOWN).querySelector(ScrollSpySelector.DROPDOWN_TOGGLE).classList.add(ScrollSpyClassName.ACTIVE);
      } else {
        //$link.parents(ScrollSpySelector.NAV_LIST_GROUP).prev(`${ScrollSpySelector.NAV_LINK}, ${ScrollSpySelector.LIST_ITEM}`).addClass(ScrollSpyClassName.ACTIVE)
      }
      link.classList.add(ScrollSpyClassName.ACTIVE);

      var activateEvent = Util.createEvent(ScrollSpyEvent.ACTIVATE, { relatedTarget: target });
      this.scrollElement.dispatchEvent(activateEvent);
    }
  }, {
    key: 'clear',
    value: function clear() {
      var active = this.target.querySelector(ScrollSpySelector.ACTIVE);
      if (active) {
        active.classList.remove(ScrollSpyClassName.ACTIVE);
      }
    }
  }], [{
    key: 'init',
    value: function init(element, options) {
      var scrollspy = null;

      if (element.hasOwnProperty(SCROLLSPY_KEY)) {
        scrollspy = element[SCROLLSPY_KEY];
      }

      if (!scrollspy) {
        var config = (typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object' && options;
        scrollspy = new ScrollSpy(element, config);
        element[SCROLLSPY_KEY] = scrollspy;
      }

      return scrollspy;
    }
  }]);

  return ScrollSpy;
}();

function scrollSpy(element, config) {
  return ScrollSpy.init(element, config);
}

document.addEventListener('DOMContentLoaded', function () {
  window.addEventListener('load', function () {
    var scrollSpys = document.querySelectorAll(ScrollSpySelector.DATA_SPY);
    if (scrollSpys.length) {
      scrollSpys.forEach(function (element) {
        scrollSpy(element, element.dataset);
      });
    }
  });
});
