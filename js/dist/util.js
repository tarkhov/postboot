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
