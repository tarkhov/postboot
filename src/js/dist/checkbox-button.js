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

      if (!isActive) {
        this.element.setAttribute('aria-pressed', true);

        var activateEvent = Util.createEvent(CheckboxButton.Event.ACTIVATE);
        this.element.dispatchEvent(activateEvent);
      } else {
        this.element.setAttribute('aria-pressed', 'false');

        var deactivateEvent = Util.createEvent(CheckboxButton.Event.DEACTIVATE);
        this.element.dispatchEvent(deactivateEvent);
      }
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

if (typeof CHECKBOX_BUTTON_EVENT_OFF === 'undefined' || CHECKBOX_BUTTON_EVENT_OFF === true) {
  document.addEventListener('DOMContentLoaded', function () {
    var buttons = document.querySelectorAll(CheckboxButton.Selector.DATA_TOGGLE);
    if (buttons.length) {
      buttons.forEach(function (element) {
        checkboxButton(element).addEventListeners();
      });
    }
  });
}
