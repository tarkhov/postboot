'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RADIO_AREA_KEY = 'radioArea';
var RADIO_AREA_EVENT_KEY = RADIO_AREA_KEY;

var RadioAreaClassName = {
  ACTIVE: 'active',
  DISABLED: 'disabled'
};

var RadioAreaSelector = {
  DATA_TOGGLE: '[data-toggle="radio-area"]',
  INPUT: 'input',
  ACTIVE: '.active'
};

var RadioArea = function () {
  function RadioArea(element) {
    _classCallCheck(this, RadioArea);

    this.element = element;
    this.parent = RadioArea.getParent(element);
    this.input = this.element.querySelector(RadioAreaSelector.INPUT);
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
      if (this.element.classList.contains(RadioAreaClassName.DISABLED) || this.element.classList.contains(RadioAreaClassName.ACTIVE)) {
        return;
      }

      var active = this.parent.querySelector(RadioAreaSelector.ACTIVE);
      if (active) {
        active.classList.remove(RadioAreaClassName.ACTIVE);
      }

      this.element.setAttribute('aria-pressed', true);
      this.element.classList.add(RadioAreaClassName.ACTIVE);
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
      var area = null;

      if (element.hasOwnProperty(RADIO_AREA_KEY)) {
        area = element[RADIO_AREA_KEY];
      }

      if (!area) {
        area = new RadioArea(element);
        element[RADIO_AREA_KEY] = area;
      }

      return area;
    }
  }]);

  return RadioArea;
}();

function radioArea(element) {
  return RadioArea.init(element);
}

document.addEventListener('DOMContentLoaded', function () {
  var areas = document.querySelectorAll(RadioAreaSelector.DATA_TOGGLE);
  if (areas.length) {
    areas.forEach(function (element) {
      radioArea(element).addEventListeners();
    });
  }
});
