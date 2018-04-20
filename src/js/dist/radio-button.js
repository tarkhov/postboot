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
        DATA_TOGGLE: '[data-toggle="radio-button"]',
        INPUT: 'input',
        ACTIVE: '.active'
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

      var active = this.parent.querySelector(RadioButton.Selector.ACTIVE);
      if (active) {
        active.classList.remove(RadioButton.ClassName.ACTIVE);
        active.setAttribute('aria-pressed', 'false');

        var deactivateEvent = Util.createEvent(RadioButton.Event.DEACTIVATE);
        active.dispatchEvent(deactivateEvent);
      }

      this.element.classList.add(RadioButton.ClassName.ACTIVE);
      this.element.setAttribute('aria-pressed', true);

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

if (typeof RADIO_BUTTON_EVENT_OFF === 'undefined' || RADIO_BUTTON_EVENT_OFF === true) {
  document.addEventListener('DOMContentLoaded', function () {
    var buttons = document.querySelectorAll(RadioButton.Selector.DATA_TOGGLE);
    if (buttons.length) {
      buttons.forEach(function (element) {
        radioButton(element).addEventListeners();
      });
    }
  });
}
