/*!
 * PostBoot v1.0.0-beta (https://github.com/tarkhov/postboot)
 * Copyright 2016-2018 Alexander Tarkhov
 * Licensed under  ()
 */
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (e) {
  // https://developer.mozilla.org/ru/docs/Web/API/Element/closest#Specification
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

  e.parent = function (selector) {
    var node = this.parentElement;

    while (node) {
      if (node.matches(selector)) {
        return node;
      } else {
        node = node.parentElement;
      }
    }

    return null;
  };

  e.parentAll = function (selector, until) {
    var node = this.parentElement;
    var nodes = [];

    while (node) {
      if (until && node.matches(until)) {
        return nodes;
      }

      if (node.matches(selector)) {
        nodes.push(node);
      }

      node = node.parentElement;
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

var CheckboxArea = function () {
  _createClass(CheckboxArea, null, [{
    key: 'KEY',
    get: function get() {
      return 'checkboxArea';
    }
  }, {
    key: 'EVENT_KEY',
    get: function get() {
      return 'CheckboxArea';
    }
  }, {
    key: 'ClassName',
    get: function get() {
      return Object.freeze({
        ACTIVE: 'active',
        DISABLED: 'disabled'
      });
    }
  }, {
    key: 'Event',
    get: function get() {
      return Object.freeze({
        ACTIVATE: CheckboxArea.EVENT_KEY + 'Activate',
        DEACTIVATE: CheckboxArea.EVENT_KEY + 'Deactivate'
      });
    }
  }, {
    key: 'Selector',
    get: function get() {
      return Object.freeze({
        DATA_TOGGLE: '[data-toggle="checkbox-area"]'
      });
    }
  }]);

  function CheckboxArea(element) {
    _classCallCheck(this, CheckboxArea);

    this.element = element;
  }

  _createClass(CheckboxArea, [{
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
      if (this.element.classList.contains(CheckboxArea.ClassName.DISABLED)) {
        return;
      }

      var isActive = this.element.classList.contains(CheckboxArea.ClassName.ACTIVE);
      this.element.classList.toggle(CheckboxArea.ClassName.ACTIVE);
      this.element.setAttribute('aria-checked', !isActive);

      var stateEvent = Util.createEvent(isActive ? CheckboxArea.Event.DEACTIVATE : CheckboxArea.Event.ACTIVATE);
      this.element.dispatchEvent(stateEvent);
    }
  }], [{
    key: 'init',
    value: function init(element) {
      var area = null;

      if (element.hasOwnProperty(CheckboxArea.KEY)) {
        area = element[CheckboxArea.KEY];
      }

      if (!area) {
        area = new CheckboxArea(element);
        element[CheckboxArea.KEY] = area;
      }

      return area;
    }
  }]);

  return CheckboxArea;
}();

function checkboxArea(element) {
  return CheckboxArea.init(element);
}

if (typeof PostBoot === 'undefined' || PostBoot.Event.CheckboxArea !== false) {
  document.addEventListener('DOMContentLoaded', function () {
    var areas = document.querySelectorAll(CheckboxArea.Selector.DATA_TOGGLE);
    if (areas.length) {
      areas.forEach(function (element) {
        checkboxArea(element).addEventListeners();
      });
    }
  });
}

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RadioArea = function () {
  _createClass(RadioArea, null, [{
    key: 'KEY',
    get: function get() {
      return 'radioArea';
    }
  }, {
    key: 'CHECKED_KEY',
    get: function get() {
      return 'checked-area';
    }
  }, {
    key: 'EVENT_KEY',
    get: function get() {
      return 'RadioArea';
    }
  }, {
    key: 'ClassName',
    get: function get() {
      return Object.freeze({
        ACTIVE: 'active',
        DISABLED: 'disabled'
      });
    }
  }, {
    key: 'Default',
    get: function get() {
      return Object.freeze({
        parent: null
      });
    }
  }, {
    key: 'Event',
    get: function get() {
      return Object.freeze({
        ACTIVATE: RadioArea.EVENT_KEY + 'Activate',
        DEACTIVATE: RadioArea.EVENT_KEY + 'Deactivate'
      });
    }
  }, {
    key: 'Selector',
    get: function get() {
      return Object.freeze({
        ACTIVE: '.active',
        CHECKED: '[' + RadioArea.CHECKED_KEY + ']',
        DATA_TOGGLE: '[data-toggle="radio-area"]'
      });
    }
  }]);

  function RadioArea(element, config) {
    _classCallCheck(this, RadioArea);

    this.element = element;
    this.config = this.getConfig(config);
    this.parent = this.config.parent || RadioArea.getParent(element);
  }

  _createClass(RadioArea, [{
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
      if (this.element.classList.contains(RadioArea.ClassName.DISABLED) || this.element.classList.contains(RadioArea.ClassName.ACTIVE)) {
        return;
      }

      var parent = this.parent || document;

      var active = parent.querySelector(RadioArea.Selector.CHECKED);
      if (active) {
        active.classList.remove(RadioArea.ClassName.ACTIVE);
        active.setAttribute('aria-checked', 'false');
        active.removeAttribute(RadioArea.CHECKED_KEY);

        var deactivateEvent = Util.createEvent(RadioArea.Event.DEACTIVATE);
        active.dispatchEvent(deactivateEvent);
      }

      this.element.classList.add(RadioArea.ClassName.ACTIVE);
      this.element.setAttribute('aria-checked', 'true');
      this.element.setAttribute(RadioArea.CHECKED_KEY, '');

      var activateEvent = Util.createEvent(RadioArea.Event.ACTIVATE);
      this.element.dispatchEvent(activateEvent);
    }
  }, {
    key: 'getConfig',
    value: function getConfig(config) {
      config = Object.assign({}, RadioArea.Default, config);
      return config;
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
    value: function init(element, config) {
      var area = null;

      if (element.hasOwnProperty(RadioArea.KEY)) {
        area = element[RadioArea.KEY];
      }

      if (!area) {
        area = new RadioArea(element, config);
        element[RadioArea.KEY] = area;
      }

      return area;
    }
  }]);

  return RadioArea;
}();

function radioArea(element, config) {
  return RadioArea.init(element, config);
}

if (typeof PostBoot === 'undefined' || PostBoot.Event.RadioArea !== false) {
  document.addEventListener('DOMContentLoaded', function () {
    var areas = document.querySelectorAll(RadioArea.Selector.DATA_TOGGLE);
    if (areas.length) {
      areas.forEach(function (element) {
        radioArea(element).addEventListeners();
      });
    }
  });
}

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CheckboxButton = function () {
  _createClass(CheckboxButton, null, [{
    key: 'KEY',
    get: function get() {
      return 'checkboxButton';
    }
  }, {
    key: 'EVENT_KEY',
    get: function get() {
      return 'CheckboxButton';
    }
  }, {
    key: 'ClassName',
    get: function get() {
      return Object.freeze({
        ACTIVE: 'active',
        DISABLED: 'disabled'
      });
    }
  }, {
    key: 'Default',
    get: function get() {
      return Object.freeze({
        input: null
      });
    }
  }, {
    key: 'Event',
    get: function get() {
      return Object.freeze({
        ACTIVATE: CheckboxButton.EVENT_KEY + 'Activate',
        DEACTIVATE: CheckboxButton.EVENT_KEY + 'Deactivate'
      });
    }
  }, {
    key: 'Selector',
    get: function get() {
      return Object.freeze({
        DATA_TOGGLE: '[data-toggle="checkbox-button"]',
        INPUT: 'input'
      });
    }
  }]);

  function CheckboxButton(element, config) {
    _classCallCheck(this, CheckboxButton);

    this.element = element;
    this.config = this.getConfig(config);
    this.input = this.config.input || this.element.querySelector(CheckboxButton.Selector.INPUT);
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
      if (this.element.disabled || this.element.classList.contains(CheckboxButton.ClassName.DISABLED)) {
        return;
      }

      var isActive = this.element.classList.contains(CheckboxButton.ClassName.ACTIVE);

      if (this.input) {
        if (this.input.disabled || this.input.classList.contains(CheckboxButton.ClassName.DISABLED)) {
          return;
        }

        this.input.checked = !isActive;
        this.input.dispatchEvent(new Event('change'));
        this.input.focus();
      }

      this.element.classList.toggle(CheckboxButton.ClassName.ACTIVE);
      this.element.setAttribute('aria-pressed', !isActive);

      var stateEvent = Util.createEvent(isActive ? CheckboxButton.Event.DEACTIVATE : CheckboxButton.Event.ACTIVATE);
      this.element.dispatchEvent(stateEvent);
    }
  }, {
    key: 'getConfig',
    value: function getConfig(config) {
      config = Object.assign({}, CheckboxButton.Default, config);
      return config;
    }
  }], [{
    key: 'init',
    value: function init(element, config) {
      var button = null;

      if (element.hasOwnProperty(CheckboxButton.KEY)) {
        button = element[CheckboxButton.KEY];
      }

      if (!button) {
        button = new CheckboxButton(element, config);
        element[CheckboxButton.KEY] = button;
      }

      return button;
    }
  }]);

  return CheckboxButton;
}();

function checkboxButton(element, config) {
  return CheckboxButton.init(element, config);
}

if (typeof PostBoot === 'undefined' || PostBoot.Event.CheckboxButton !== false) {
  document.addEventListener('DOMContentLoaded', function () {
    var buttons = document.querySelectorAll(CheckboxButton.Selector.DATA_TOGGLE);
    if (buttons.length) {
      buttons.forEach(function (element) {
        checkboxButton(element).addEventListeners();
      });
    }
  });
}

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RadioButton = function () {
  _createClass(RadioButton, null, [{
    key: 'KEY',
    get: function get() {
      return 'radioButton';
    }
  }, {
    key: 'CHECKED_KEY',
    get: function get() {
      return 'checked-button';
    }
  }, {
    key: 'EVENT_KEY',
    get: function get() {
      return 'RadioButton';
    }
  }, {
    key: 'ClassName',
    get: function get() {
      return Object.freeze({
        ACTIVE: 'active',
        DISABLED: 'disabled'
      });
    }
  }, {
    key: 'Default',
    get: function get() {
      return Object.freeze({
        input: null,
        parent: null
      });
    }
  }, {
    key: 'Event',
    get: function get() {
      return Object.freeze({
        ACTIVATE: RadioButton.EVENT_KEY + 'Activate',
        DEACTIVATE: RadioButton.EVENT_KEY + 'Deactivate'
      });
    }
  }, {
    key: 'Selector',
    get: function get() {
      return Object.freeze({
        ACTIVE: '.active',
        CHECKED: '[' + RadioButton.CHECKED_KEY + ']',
        DATA_TOGGLE: '[data-toggle="radio-button"]',
        INPUT: 'input'
      });
    }
  }]);

  function RadioButton(element, config) {
    _classCallCheck(this, RadioButton);

    this.element = element;
    this.config = this.getConfig(config);
    this.parent = this.config.parent || RadioButton.getParent(element);
    this.input = this.config.input || this.element.querySelector(RadioButton.Selector.INPUT);
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
      if (this.element.disabled || this.element.classList.contains(RadioButton.ClassName.DISABLED) || this.element.classList.contains(RadioButton.ClassName.ACTIVE)) {
        return;
      }

      if (this.input) {
        if (this.input.disabled || this.input.classList.contains(RadioButton.ClassName.DISABLED) || this.input.checked) {
          return;
        }

        this.input.checked = true;
        this.input.dispatchEvent(new Event('change'));
        this.input.focus();
      }

      var active = this.parent.querySelector(RadioButton.Selector.CHECKED);
      if (active) {
        active.classList.remove(RadioButton.ClassName.ACTIVE);
        active.setAttribute('aria-pressed', 'false');
        active.removeAttribute(RadioButton.CHECKED_KEY);

        var deactivateEvent = Util.createEvent(RadioButton.Event.DEACTIVATE);
        active.dispatchEvent(deactivateEvent);
      }

      this.element.classList.add(RadioButton.ClassName.ACTIVE);
      this.element.setAttribute('aria-pressed', 'true');
      this.element.setAttribute(RadioButton.CHECKED_KEY, '');

      var activateEvent = Util.createEvent(RadioButton.Event.ACTIVATE);
      this.element.dispatchEvent(activateEvent);
    }
  }, {
    key: 'getConfig',
    value: function getConfig(config) {
      config = Object.assign({}, RadioButton.Default, config);
      return config;
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
    value: function init(element, config) {
      var button = null;

      if (element.hasOwnProperty(RadioButton.KEY)) {
        button = element[RadioButton.KEY];
      }

      if (!button) {
        button = new RadioButton(element, config);
        element[RadioButton.KEY] = button;
      }

      return button;
    }
  }]);

  return RadioButton;
}();

function radioButton(element, config) {
  return RadioButton.init(element, config);
}

if (typeof PostBoot === 'undefined' || PostBoot.Event.RadioButton !== false) {
  document.addEventListener('DOMContentLoaded', function () {
    var buttons = document.querySelectorAll(RadioButton.Selector.DATA_TOGGLE);
    if (buttons.length) {
      buttons.forEach(function (element) {
        radioButton(element).addEventListeners();
      });
    }
  });
}

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Collapse = function () {
  _createClass(Collapse, null, [{
    key: 'KEY',
    get: function get() {
      return 'collapse';
    }
  }, {
    key: 'COLLAPSED_KEY',
    get: function get() {
      return 'collapsed';
    }
  }, {
    key: 'EVENT_KEY',
    get: function get() {
      return 'Collapse';
    }
  }, {
    key: 'ClassName',
    get: function get() {
      return Object.freeze({
        COLLAPSE: 'collapse',
        COLLAPSED: 'collapsed',
        COLLAPSING: 'collapsing',
        SHOW: 'show'
      });
    }
  }, {
    key: 'Default',
    get: function get() {
      return Object.freeze({
        parent: null,
        target: null
      });
    }
  }, {
    key: 'Event',
    get: function get() {
      return Object.freeze({
        HIDE: Collapse.EVENT_KEY + 'Hide',
        HIDDEN: Collapse.EVENT_KEY + 'Hidden',
        SHOW: Collapse.EVENT_KEY + 'Show',
        SHOWN: Collapse.EVENT_KEY + 'Shown'
      });
    }
  }, {
    key: 'Selector',
    get: function get() {
      return Object.freeze({
        ACTIVES: '.show, .collapsing',
        COLLAPSE: '.collapse',
        COLLAPSED: '[' + Collapse.COLLAPSED_KEY + ']',
        DATA_TOGGLE: '[data-toggle="collapse"]'
      });
    }
  }]);

  function Collapse(element, config) {
    _classCallCheck(this, Collapse);

    this.element = element;
    this.config = this.getConfig(config);
    this.parent = this.config.parent || Collapse.getParent(this.element);
    this.target = this.config.target || Collapse.getTarget(this.element);
  }

  _createClass(Collapse, [{
    key: 'addEventListeners',
    value: function addEventListeners() {
      var _this = this;

      this.element.addEventListener('click', function (event) {
        event.preventDefault();
        _this.toggle();
      });
    }
  }, {
    key: 'addHoverListeners',
    value: function addHoverListeners() {
      var _this2 = this;

      this.element.addEventListener('mouseenter', function (event) {
        return _this2.show(event);
      });
      this.element.addEventListener('mouseleave', function () {
        return _this2.hide();
      });
    }
  }, {
    key: 'toggle',
    value: function toggle() {
      if (!this.target.classList.contains(Collapse.ClassName.SHOW)) {
        this.show();
      } else {
        this.hide();
      }
    }
  }, {
    key: 'show',
    value: function show() {
      var _this3 = this;

      if (this.element.disabled || this.element.classList.contains(Collapse.ClassName.DISABLED)) {
        return;
      }

      var showEvent = Util.createEvent(Collapse.Event.SHOW);
      this.target.dispatchEvent(showEvent);
      if (showEvent.defaultPrevented) {
        return;
      }

      if (this.parent) {
        var collapsed = this.parent.querySelectorAll(Collapse.Selector.COLLAPSED);
        if (collapsed.length) {
          collapsed.forEach(function (element) {
            if (!element.hasOwnProperty(Collapse.KEY)) {
              return true;
            }

            var collapse = element[Collapse.KEY];
            collapse.hide();
          });
        }
      }

      this.element.setAttribute('aria-expanded', 'true');
      this.element.setAttribute(Collapse.COLLAPSED_KEY, '');

      window.requestAnimationFrame(function () {
        _this3.target.classList.add(Collapse.ClassName.COLLAPSING);
        _this3.target.classList.remove(Collapse.ClassName.COLLAPSE);
        _this3.target.style.height = _this3.target.scrollHeight + 'px';
      });

      function shown(event) {
        event.target.classList.remove(Collapse.ClassName.COLLAPSING);
        event.target.classList.add(Collapse.ClassName.COLLAPSE);
        event.target.classList.add(Collapse.ClassName.SHOW);

        var shownEvent = Util.createEvent(Collapse.Event.SHOWN);
        event.target.dispatchEvent(shownEvent);

        event.target.removeEventListener(event.type, shown);
      }
      this.target.addEventListener('transitionend', shown);
    }
  }, {
    key: 'hide',
    value: function hide() {
      var _this4 = this;

      if (this.element.disabled || this.element.classList.contains(Collapse.ClassName.DISABLED)) {
        return;
      }

      var hideEvent = Util.createEvent(Collapse.Event.HIDE);
      this.target.dispatchEvent(hideEvent);
      if (hideEvent.defaultPrevented) {
        return;
      }

      this.element.setAttribute('aria-expanded', 'false');
      this.element.removeAttribute(Collapse.COLLAPSED_KEY);

      window.requestAnimationFrame(function () {
        _this4.target.classList.add(Collapse.ClassName.COLLAPSING);
        _this4.target.classList.remove(Collapse.ClassName.COLLAPSE);
        _this4.target.style.height = null;
      });

      function hidden(event) {
        event.target.classList.remove(Collapse.ClassName.COLLAPSING);
        event.target.classList.add(Collapse.ClassName.COLLAPSE);
        event.target.classList.remove(Collapse.ClassName.SHOW);

        var hiddenEvent = Util.createEvent(Collapse.Event.HIDDEN);
        event.target.dispatchEvent(hiddenEvent);

        event.target.removeEventListener(event.type, hidden);
      }
      this.target.addEventListener('transitionend', hidden);
    }
  }, {
    key: 'getConfig',
    value: function getConfig(config) {
      config = Object.assign({}, Collapse.Default, config);
      return config;
    }
  }], [{
    key: 'getParent',
    value: function getParent(element) {
      var selector = Util.getParentSelector(element);
      return selector && document.querySelector(selector);
    }
  }, {
    key: 'getTarget',
    value: function getTarget(element) {
      var selector = Util.getSelector(element);
      return selector && document.querySelector(selector);
    }
  }, {
    key: 'init',
    value: function init(element, config) {
      var collapse = null;

      if (element.hasOwnProperty(Collapse.KEY)) {
        collapse = element[Collapse.KEY];
      }

      if (!collapse) {
        collapse = new Collapse(element, config);
        element[Collapse.KEY] = collapse;
      }

      return collapse;
    }
  }]);

  return Collapse;
}();

function collapse(element, config) {
  return Collapse.init(element, config);
}

if (typeof PostBoot === 'undefined' || PostBoot.Event.Collapse !== false) {
  document.addEventListener('DOMContentLoaded', function () {
    var toggles = document.querySelectorAll(Collapse.Selector.DATA_TOGGLE);
    if (toggles.length) {
      toggles.forEach(function (element) {
        collapse(element).addEventListeners();
      });
    }

    /*let dataHovers = document.querySelectorAll(Collapse.Selector.DATA_HOVER)
    if (dataHovers.length) {
      dataHovers.forEach((element) => {
        collapse(element).addHoverListeners()
      })
    }*/
  });
}

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

'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ScrollSpy = function () {
  _createClass(ScrollSpy, null, [{
    key: 'KEY',
    get: function get() {
      return 'scrollSpy';
    }
  }, {
    key: 'EVENT_KEY',
    get: function get() {
      return 'ScrollSpy';
    }
  }, {
    key: 'ClassName',
    get: function get() {
      return Object.freeze({
        ACTIVE: 'active',
        DROPDOWN_ITEM: 'dropdown-item',
        DROPDOWN_MENU: 'dropdown-menu',
        NAV_LINK: 'nav-link',
        SHOW: 'show'
      });
    }
  }, {
    key: 'Default',
    get: function get() {
      return Object.freeze({
        offset: 10,
        method: 'auto',
        target: ''
      });
    }
  }, {
    key: 'Event',
    get: function get() {
      return Object.freeze({
        ACTIVATE: ScrollSpy.EVENT_KEY + 'Activate'
      });
    }
  }, {
    key: 'OffsetMethod',
    get: function get() {
      return Object.freeze({
        OFFSET: 'offset',
        POSITION: 'position'
      });
    }
  }, {
    key: 'Selector',
    get: function get() {
      return Object.freeze({
        ACTIVE: '.active',
        DATA_SPY: '[data-spy="scroll"]',
        DROPDOWN: '.dropdown',
        DROPDOWN_ITEM: '.dropdown-item',
        DROPDOWN_MENU: '.dropdown-menu',
        DROPDOWN_TOGGLE: '.dropdown-toggle',
        DROPDOWNS: '.dropup, .dropright, .dropdown, .dropleft',
        HIDE: '.hide',
        LIST_ITEM: '.list-group-item',
        NAV_ITEM: '.nav-item',
        NAV_LINK: '.nav-link',
        NAV_LIST_GROUP: '.nav, .list-group',
        SHOW: '.show'
      });
    }
  }]);

  function ScrollSpy(element, config) {
    var _this = this;

    _classCallCheck(this, ScrollSpy);

    this.element = element;
    this.scrollElement = element.tagName === 'BODY' ? window : element;
    this.config = this.getConfig(config);
    this.target = document.querySelector(this.config.target);
    this.selector = this.config.target + ' ' + ScrollSpy.Selector.NAV_LINK + ',' + (this.config.target + ' ' + ScrollSpy.Selector.LIST_ITEM + ',') + (this.config.target + ' ' + ScrollSpy.Selector.DROPDOWN_ITEM);
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

      var autoMethod = this.scrollElement !== this.scrollElement.window ? ScrollSpy.OffsetMethod.POSITION : ScrollSpy.OffsetMethod.OFFSET;

      var offsetMethod = this.config.method === 'auto' ? autoMethod : this.config.method;

      var offsetBase = offsetMethod === ScrollSpy.OffsetMethod.POSITION ? this.getScrollTop() : 0;

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
      config = Object.assign({}, ScrollSpy.Default, config);
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

      if (link.classList.contains(ScrollSpy.ClassName.DROPDOWN_ITEM)) {
        var dropdowns = link.parentAll(ScrollSpy.Selector.DROPDOWNS + ', ' + ScrollSpy.Selector.DROPDOWN_MENU, this.config.target);
        if (dropdowns.length) {
          dropdowns.forEach(function (dropdown) {
            dropdown.classList.add(ScrollSpy.ClassName.SHOW);
          });
        }
      } else if (link.classList.contains(ScrollSpy.ClassName.NAV_LINK)) {
        var items = link.parentAll(ScrollSpy.Selector.NAV_ITEM, this.config.target);
        if (items.length) {
          items.forEach(function (item) {
            item.classList.add(ScrollSpy.ClassName.SHOW);
          });
        }
      } else {
        //$link.parents(ScrollSpy.Selector.NAV_LIST_GROUP).prev(`${ScrollSpy.Selector.NAV_LINK}, ${ScrollSpy.Selector.LIST_ITEM}`).addClass(ScrollSpy.ClassName.ACTIVE)
      }
      link.classList.add(ScrollSpy.ClassName.ACTIVE);

      var activateEvent = Util.createEvent(ScrollSpy.Event.ACTIVATE, { relatedTarget: target });
      this.scrollElement.dispatchEvent(activateEvent);
    }
  }, {
    key: 'clear',
    value: function clear() {
      var active = this.target.querySelector(ScrollSpy.Selector.ACTIVE);
      if (active) {
        active.classList.remove(ScrollSpy.ClassName.ACTIVE);
        if (active.classList.contains(ScrollSpy.ClassName.NAV_LINK) || active.classList.contains(ScrollSpy.ClassName.DROPDOWN_ITEM)) {
          var items = active.parentAll(ScrollSpy.Selector.SHOW, this.config.target);
          if (items.length) {
            items.forEach(function (item) {
              item.classList.remove(ScrollSpy.ClassName.SHOW);
            });
          }
        }
      }
    }
  }], [{
    key: 'init',
    value: function init(element, options) {
      var scrollspy = null;

      if (element.hasOwnProperty(ScrollSpy.KEY)) {
        scrollspy = element[ScrollSpy.KEY];
      }

      if (!scrollspy) {
        var config = (typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object' && options;
        scrollspy = new ScrollSpy(element, config);
        element[ScrollSpy.KEY] = scrollspy;
      }

      return scrollspy;
    }
  }]);

  return ScrollSpy;
}();

function scrollSpy(element, config) {
  return ScrollSpy.init(element, config);
}

if (typeof PostBoot === 'undefined' || PostBoot.Event.ScrollSpy !== false) {
  document.addEventListener('DOMContentLoaded', function () {
    window.addEventListener('load', function () {
      var scrollSpys = document.querySelectorAll(ScrollSpy.Selector.DATA_SPY);
      if (scrollSpys.length) {
        scrollSpys.forEach(function (element) {
          scrollSpy(element, element.dataset);
        });
      }
    });
  });
}
