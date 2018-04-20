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

      this.element.setAttribute('aria-expanded', true);
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

if (typeof COLLAPSE_EVENT_OFF === 'undefined' || COLLAPSE_EVENT_OFF === true) {
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
