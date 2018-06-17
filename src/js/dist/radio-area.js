'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RadioArea = function () {
  _createClass(RadioArea, null, [{
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
        ACTIVATE: 'RadioAreaActivate',
        ACTIVATED: 'RadioAreaActivated',
        DEACTIVATE: 'RadioAreaDeactivate',
        DEACTIVATED: 'RadioAreaDeactivated'
      });
    }
  }, {
    key: 'Selector',
    get: function get() {
      return Object.freeze({
        ACTIVE: '.area.active',
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

      var activateEvent = Util.createEvent(RadioArea.Event.ACTIVATE);
      this.element.dispatchEvent(activateEvent);

      var parent = this.parent || document;

      var active = parent.querySelector(RadioArea.Selector.ACTIVE);
      if (active) {
        var deactivateEvent = Util.createEvent(RadioArea.Event.DEACTIVATE);
        active.dispatchEvent(deactivateEvent);

        active.classList.remove(RadioArea.ClassName.ACTIVE);
        active.setAttribute('aria-checked', 'false');

        var deactivatedEvent = Util.createEvent(RadioArea.Event.DEACTIVATED);
        active.dispatchEvent(deactivatedEvent);
      }

      this.element.classList.add(RadioArea.ClassName.ACTIVE);
      this.element.setAttribute('aria-checked', 'true');

      var activatedEvent = Util.createEvent(RadioArea.Event.ACTIVATED);
      this.element.dispatchEvent(activatedEvent);
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
  }]);

  return RadioArea;
}();

if (typeof PostBoot === 'undefined' || PostBoot.Event.RadioArea !== false) {
  document.addEventListener('DOMContentLoaded', function () {
    var areas = document.querySelectorAll(RadioArea.Selector.DATA_TOGGLE);
    if (areas.length) {
      areas.forEach(function (element) {
        var radioArea = new RadioArea(element);
        radioArea.addEventListeners();
      });
    }
  });
}
