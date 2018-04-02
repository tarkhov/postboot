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
