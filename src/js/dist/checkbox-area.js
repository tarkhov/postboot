'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CHECKBOX_AREA_KEY = 'checkboxArea';
var CHECKBOX_AREA_EVENT_KEY = CHECKBOX_AREA_KEY;

var CheckboxAreaClassName = {
  ACTIVE: 'active',
  DISABLED: 'disabled'
};

var CheckboxAreaSelector = {
  DATA_TOGGLE: '[data-toggle="checkbox-area"]'
};

var CheckboxArea = function () {
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
      if (this.element.classList.contains(CheckboxAreaClassName.DISABLED)) {
        return;
      }

      this.element.classList.toggle(CheckboxAreaClassName.ACTIVE);
    }
  }], [{
    key: 'init',
    value: function init(element) {
      var area = null;

      if (element.hasOwnProperty(CHECKBOX_AREA_KEY)) {
        area = element[CHECKBOX_AREA_KEY];
      }

      if (!area) {
        area = new CheckboxArea(element);
        element[CHECKBOX_AREA_KEY] = area;
      }

      return area;
    }
  }]);

  return CheckboxArea;
}();

function checkboxArea(element) {
  return CheckboxArea.init(element);
}

document.addEventListener('DOMContentLoaded', function () {
  var areas = document.querySelectorAll(CheckboxAreaSelector.DATA_TOGGLE);
  if (areas.length) {
    areas.forEach(function (element) {
      checkboxArea(element).addEventListeners();
    });
  }
});
