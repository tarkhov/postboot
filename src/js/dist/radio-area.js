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
        DATA_TOGGLE: '[data-toggle="radio-area"]',
        ACTIVE: '.active'
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

      var active = parent.querySelector(RadioArea.Selector.ACTIVE);
      if (active) {
        active.classList.remove(RadioArea.ClassName.ACTIVE);
        active.setAttribute('aria-checked', 'false');

        var deactivateEvent = Util.createEvent(RadioArea.Event.DEACTIVATE);
        active.dispatchEvent(deactivateEvent);
      }

      this.element.classList.add(RadioArea.ClassName.ACTIVE);
      this.element.setAttribute('aria-checked', true);

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

if (typeof RADIO_AREA_EVENT_OFF === 'undefined' || RADIO_AREA_EVENT_OFF === true) {
  document.addEventListener('DOMContentLoaded', function () {
    var areas = document.querySelectorAll(RadioArea.Selector.DATA_TOGGLE);
    if (areas.length) {
      areas.forEach(function (element) {
        radioArea(element).addEventListeners();
      });
    }
  });
}
