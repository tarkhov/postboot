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
  LIST_ITEMS: '.list-group-item',
  NAV_ITEM: '.nav-item',
  NAV_LINKS: '.nav-link',
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
    this.selector = this.config.target + ' ' + ScrollSpySelector.NAV_LINKS + ',' + (this.config.target + ' ' + ScrollSpySelector.LIST_ITEMS + ',') + (this.config.target + ' ' + ScrollSpySelector.DROPDOWN_ITEMS);
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
        //$link.parents(ScrollSpySelector.NAV_LIST_GROUP).prev(`${ScrollSpySelector.NAV_LINKS}, ${ScrollSpySelector.LIST_ITEMS}`).addClass(ScrollSpyClassName.ACTIVE)
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
