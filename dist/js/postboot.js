/*!
 * PostBoot v1.0.0-beta (http://tarhovalex.github.io/postboot)
 * Copyright 2017 Alex Tarhov
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

var ESCAPE_KEYCODE = 27; // KeyboardEvent.which value for Escape (Esc) key


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
    key: 'toType',
    value: function toType(obj) {
      return {}.toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
    }
  }, {
    key: 'isElement',
    value: function isElement(obj) {
      return (obj[0] || obj).nodeType;
    }
  }, {
    key: 'getUID',
    value: function getUID(prefix) {
      do {
        // eslint-disable-next-line no-bitwise
        prefix += ~~(Math.random() * MAX_UID); // "~~" acts like a faster Math.floor() here
      } while (document.getElementById(prefix));
      return prefix;
    }
  }, {
    key: 'typeCheckConfig',
    value: function typeCheckConfig(componentName, config, configTypes) {
      for (var property in configTypes) {
        if (configTypes.hasOwnProperty(property)) {
          var expectedTypes = configTypes[property];
          var value = config[property];
          var valueType = value && Util.isElement(value) ? 'element' : Util.toType(value);

          if (!new RegExp(expectedTypes).test(valueType)) {
            throw new Error(componentName.toUpperCase() + ': ' + ('Option "' + property + '" provided type "' + valueType + '" ') + ('but expected type "' + expectedTypes + '".'));
          }
        }
      }
    }
  }]);

  return Util;
}();

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

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DROPDOWN_HOVER_KEY = 'dropdownHover';

var DropdownHoverSelector = {
  DATA_HOVER: '[data-hover="dropdown"]'
};

var DropdownHover = function () {
  function DropdownHover(element) {
    var _this = this;

    _classCallCheck(this, DropdownHover);

    this.element = element;
    this.parent = Dropdown.getParent(this.element);

    this.element.addEventListener('mouseenter', function (event) {
      return _this.show(event);
    });
    this.parent.addEventListener('mouseleave', function () {
      return _this.hide();
    });
  }

  _createClass(DropdownHover, [{
    key: 'show',
    value: function show(event) {
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

      this.element.setAttribute('aria-expanded', true);
      this.element.setAttribute(DROPDOWN_KEY, '');
      this.parent.classList.add(DropdownClassName.SHOW);

      var shownEvent = Util.createEvent(DropdownEvent.SHOWN, relatedTarget);
      this.parent.dispatchEvent(shownEvent);
    }
  }, {
    key: 'hide',
    value: function hide() {
      if (!this.parent.classList.contains(DropdownClassName.SHOW)) {
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
      this.element.removeAttribute(DROPDOWN_KEY);
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
      dropdownHover(element);
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

var ScrollSpyDefaultType = {
  offset: 'number',
  method: 'string',
  target: '(string|element)'
};

var ScrollSpyEvent = {
  ACTIVATE: SCROLLSPY_EVENT_KEY + 'activate'
};

var ScrollSpyClassName = {
  ACTIVE: 'active',
  DROPDOWN_ITEM: 'dropdown-item',
  DROPDOWN_MENU: 'dropdown-menu',
  SHOW: 'show'
};

var ScrollSpySelector = {
  ACTIVE: '.active',
  DATA_SPY: '[data-spy="scroll"]',
  DROPDOWN: '.dropdown',
  DROPDOWN_ITEMS: '.dropdown-item',
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
    this.selector = this.config.target + ' ' + ScrollSpySelector.NAV_LINK + ',' + (this.config.target + ' ' + ScrollSpySelector.LIST_ITEM + ',') + (this.config.target + ' ' + ScrollSpySelector.DROPDOWN_ITEMS);
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

      if (typeof config.target !== 'string') {
        var id = config.target.id;
        if (!id) {
          id = Util.getUID(SCROLLSPY_KEY);
          config.target.id = id;
        }
        config.target = '#' + id;
      }

      Util.typeCheckConfig(SCROLLSPY_KEY, config, ScrollSpyDefaultType);

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

      var link = document.querySelector(queries.join(','));

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
      var active = document.querySelector(this.config.target + ' ' + ScrollSpySelector.ACTIVE);
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

function scrollspy(element, config) {
  return ScrollSpy.init(element, config);
}

document.addEventListener('DOMContentLoaded', function () {
  window.addEventListener('load', function () {
    var scrollSpys = document.querySelectorAll(ScrollSpySelector.DATA_SPY);
    if (scrollSpys.length) {
      scrollSpys.forEach(function (element) {
        scrollspy(element, element.dataset);
      });
    }
  });
});
