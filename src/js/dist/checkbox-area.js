'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CheckboxArea = function () {
  _createClass(CheckboxArea, null, [{
    key: 'ClassName',
    get: function get() {
      return Object.freeze({
        ACTIVE: 'active',
        DISABLED: 'disabled'
      });
    }
  }, {
    key: 'Event',
    get: function get() {
      return Object.freeze({
        ACTIVATE: 'CheckboxAreaActivate',
        ACTIVATED: 'CheckboxAreaActivated',
        DEACTIVATE: 'CheckboxAreaDeactivate',
        DEACTIVATED: 'CheckboxAreaDeactivated'
      });
    }
  }, {
    key: 'Selector',
    get: function get() {
      return Object.freeze({
        DATA_TOGGLE: '[data-toggle="checkbox-area"]'
      });
    }
  }]);

  function CheckboxArea(element) {
    _classCallCheck(this, CheckboxArea);

    this.element = element;
  }

  _createClass(CheckboxArea, [{
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
      if (this.element.classList.contains(CheckboxArea.ClassName.DISABLED)) {
        return;
      }

      var isActive = this.element.classList.contains(CheckboxArea.ClassName.ACTIVE);

      var activateEvent = Util.createEvent(isActive ? CheckboxArea.Event.DEACTIVATE : CheckboxArea.Event.ACTIVATE);
      this.element.dispatchEvent(activateEvent);

      this.element.classList.toggle(CheckboxArea.ClassName.ACTIVE);
      this.element.setAttribute('aria-checked', !isActive);

      var activatedEvent = Util.createEvent(isActive ? CheckboxArea.Event.DEACTIVATED : CheckboxArea.Event.ACTIVATED);
      this.element.dispatchEvent(activatedEvent);
    }
  }]);

  return CheckboxArea;
}();

if (typeof PostBoot === 'undefined' || PostBoot.Event.CheckboxArea !== false) {
  document.addEventListener('DOMContentLoaded', function () {
    var areas = document.querySelectorAll(CheckboxArea.Selector.DATA_TOGGLE);
    if (areas.length) {
      areas.forEach(function (element) {
        var checkboxArea = new CheckboxArea(element);
        checkboxArea.addEventListeners();
      });
    }
  });
}
