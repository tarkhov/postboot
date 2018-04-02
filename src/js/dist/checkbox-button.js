'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CHECKBOX_BUTTON_KEY = 'checkboxButton';
var CHECKBOX_BUTTON_EVENT_KEY = CHECKBOX_BUTTON_KEY;

var CheckboxButtonClassName = {
  ACTIVE: 'active',
  DISABLED: 'disabled'
};

var CheckboxButtonSelector = {
  DATA_TOGGLE: '[data-toggle="checkbox-button"]',
  INPUT: 'input'
};

var CheckboxButton = function () {
  function CheckboxButton(element) {
    _classCallCheck(this, CheckboxButton);

    this.element = element;
    this.input = this.element.querySelector(CheckboxButtonSelector.INPUT);
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
      if (this.element.disabled || this.element.classList.contains(CheckboxButtonClassName.DISABLED)) {
        return;
      }

      var isActive = this.element.classList.contains(CheckboxButtonClassName.ACTIVE);

      if (this.input) {
        if (this.input.disabled || this.input.classList.contains(CheckboxButtonClassName.DISABLED)) {
          return;
        }

        this.input.checked = !isActive;
        this.input.dispatchEvent(new Event('change'));
        this.input.focus();
      }

      this.element.setAttribute('aria-pressed', !isActive);
      this.element.classList.toggle(CheckboxButtonClassName.ACTIVE);
    }
  }], [{
    key: 'init',
    value: function init(element) {
      var button = null;

      if (element.hasOwnProperty(CHECKBOX_BUTTON_KEY)) {
        button = element[CHECKBOX_BUTTON_KEY];
      }

      if (!button) {
        button = new CheckboxButton(element);
        element[CHECKBOX_BUTTON_KEY] = button;
      }

      return button;
    }
  }]);

  return CheckboxButton;
}();

function checkboxButton(element) {
  return CheckboxButton.init(element);
}

document.addEventListener('DOMContentLoaded', function () {
  var buttons = document.querySelectorAll(CheckboxButtonSelector.DATA_TOGGLE);
  if (buttons.length) {
    buttons.forEach(function (element) {
      checkboxButton(element).addEventListeners();
    });
  }
});
