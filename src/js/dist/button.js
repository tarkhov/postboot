'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BUTTON_KEY = 'button';
var BUTTON_EVENT_KEY = BUTTON_KEY;

var ButtonClassName = {
  ACTIVE: 'active',
  BUTTON: 'btn',
  FOCUS: 'focus'
};

var ButtonSelector = {
  DATA_TOGGLE_CARROT: '[data-toggle^="button"]',
  DATA_TOGGLE: '[data-toggle="buttons"]',
  INPUT: 'input',
  ACTIVE: '.active',
  BUTTON: '.btn'
};

var Button = function () {
  function Button(element) {
    _classCallCheck(this, Button);

    this.element = element;
    this.parent = Button.getParent(element);
    this.input = this.element.querySelector(ButtonSelector.INPUT);
  }

  _createClass(Button, [{
    key: 'addEventListeners',
    value: function addEventListeners() {}
  }, {
    key: 'toggle',
    value: function toggle() {
      var triggerChangeEvent = true;
      var addAriaPressed = true;
      var isActive = this.element.classList.contains(ButtonClassName.ACTIVE);

      if (this.parent) {
        if (this.input) {
          if (this.input.type === 'radio') {
            if (this.input.checked && isActive) {
              triggerChangeEvent = false;
            } else {
              var activeElement = this.parent.querySelector(ButtonSelector.ACTIVE);
              if (activeElement) {
                activeElement.classList.remove(ButtonClassName.ACTIVE);
              }
            }
          }

          if (triggerChangeEvent === true) {
            if (this.input.hasAttribute('disabled') || this.parent.hasAttribute('disabled') || this.input.classList.contains('disabled') || this.parent.classList.contains('disabled')) {
              return;
            }

            this.input.checked = !isActive;
            this.input.dispatchEvent(new Event('change'));
          }

          this.input.focus();
          addAriaPressed = false;
        }
      }

      if (addAriaPressed === true) {
        this.element.setAttribute('aria-pressed', !isActive);
      }

      if (triggerChangeEvent === true) {
        this.element.classList.toggle(ButtonClassName.ACTIVE);
      }
    }
  }], [{
    key: 'getParent',
    value: function getParent(element) {
      return element.closest(ButtonSelector.DATA_TOGGLE);
    }

    /*static getParent(element) {
      let parent
      let selector = Util.getParentSelector(element)
       if (selector) {
        parent = document.querySelector(selector)
      } else {
        parent = element.parentNode
      }
       return parent
    }*/

  }, {
    key: 'init',
    value: function init(element) {
      var button = null;

      if (element.hasOwnProperty(BUTTON_KEY)) {
        button = element[BUTTON_KEY];
      }

      if (!button) {
        button = new Button(element);
        element[BUTTON_KEY] = button;
      }

      return button;
    }
  }]);

  return Button;
}();

function button(element) {
  return Button.init(element);
}

document.addEventListener('DOMContentLoaded', function () {
  var buttons = document.querySelectorAll(ButtonSelector.DATA_TOGGLE_CARROT);
  if (buttons.length) {
    buttons.forEach(function (element) {
      element.addEventListener('click', function (event) {
        event.preventDefault();

        var target = event.target;

        if (!target.classList.contains(ButtonClassName.BUTTON)) {
          target = target.closest(ButtonSelector.BUTTON);
        }

        button(target).toggle();
      });

      element.addEventListener('focus', function (event) {
        var target = event.target.closest(ButtonSelector.BUTTON);
        target.classList.toggle(ButtonClassName.FOCUS, /^focus(in)?$/.test(event.type));
      });

      element.addEventListener('blur', function (event) {
        var target = event.target.closest(ButtonSelector.BUTTON);
        target.classList.toggle(ButtonClassName.FOCUS, /^focus(in)?$/.test(event.type));
      });
    });
  }
});
