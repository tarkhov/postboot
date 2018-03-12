'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RADIO_BUTTON_KEY = 'radioButton';
var RADIO_BUTTON_EVENT_KEY = RADIO_BUTTON_KEY;

var RadioButtonClassName = {
  ACTIVE: 'active',
  DISABLED: 'disabled'
};

var RadioButtonSelector = {
  DATA_TOGGLE: '[data-toggle="radio-button"]',
  INPUT: 'input',
  ACTIVE: '.active'
};

var RadioButton = function () {
  function RadioButton(element) {
    _classCallCheck(this, RadioButton);

    this.element = element;
    this.parent = RadioButton.getParent(element);
    this.input = this.element.querySelector(RadioButtonSelector.INPUT);
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
      if (this.element.disabled || this.element.classList.contains(RadioButtonClassName.DISABLED) || this.element.classList.contains(RadioButtonClassName.ACTIVE)) {
        return;
      }

      if (this.input) {
        if (this.input.disabled || this.input.classList.contains(RadioButtonClassName.DISABLED) || this.input.checked) {
          return;
        }

        this.input.checked = true;
        this.input.dispatchEvent(new Event('change'));
        this.input.focus();
      }

      var active = this.parent.querySelector(RadioButtonSelector.ACTIVE);
      if (active) {
        active.classList.remove(RadioButtonClassName.ACTIVE);
      }

      this.element.setAttribute('aria-pressed', true);
      this.element.classList.add(RadioButtonClassName.ACTIVE);
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
    value: function init(element) {
      var button = null;

      if (element.hasOwnProperty(RADIO_BUTTON_KEY)) {
        button = element[RADIO_BUTTON_KEY];
      }

      if (!button) {
        button = new RadioButton(element);
        element[RADIO_BUTTON_KEY] = button;
      }

      return button;
    }
  }]);

  return RadioButton;
}();

function radioButton(element) {
  return RadioButton.init(element);
}

document.addEventListener('DOMContentLoaded', function () {
  var buttons = document.querySelectorAll(RadioButtonSelector.DATA_TOGGLE);
  if (buttons.length) {
    buttons.forEach(function (element) {
      radioButton(element).addEventListeners();
    });
  }
});
