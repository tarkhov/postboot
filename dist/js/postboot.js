/*!
 * PostBoot v1.0.0-alpha3 (https://alextakrhov.github.io/postboot/)
 * Copyright 2017 Alex Tarkhov
 * Licensed under  ()
 */
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DROPDOWN_DATA_KEY = 'bs.dropdown';
var DROPDOWN_SHOW = 'show';
var DROPDOWN_DISABLED = 'disabled';
var DROPDOWN_HOVER = '.dropdown-hover';
var DROPDOWN_DATA_HOVER = '[data-hover="dropdown"]';

var DropdownHover = function () {
  function DropdownHover(element) {
    _classCallCheck(this, DropdownHover);

    // https://tutor.mantrajs.com/say-hello-to-ES2015/stop-self-this
    var parent = DropdownHover.getParent(element);

    element.addEventListener('mouseenter', this.show);
    parent.addEventListener('mouseleave', this.hide);
  }

  _createClass(DropdownHover, [{
    key: 'show',
    value: function show(e) {
      if (this.disabled || this.classList.contains(DROPDOWN_DISABLED)) {
        return;
      }

      var parent = DropdownHover.getParent(this);

      DropdownHover.clearMenus(e);

      if (!parent.classList.contains(DROPDOWN_SHOW)) {
        parent.classList.add(DROPDOWN_SHOW);
      }
    }
  }, {
    key: 'hide',
    value: function hide(e) {
      if (this.classList.contains(DROPDOWN_SHOW)) {
        this.classList.remove(DROPDOWN_SHOW);
      }
    }
  }], [{
    key: 'clearMenus',
    value: function clearMenus(event) {
      var toggles = document.querySelectorAll(DROPDOWN_DATA_HOVER);
      if (toggles.length) {
        toggles.forEach(function (toggle, i) {
          var parent = DropdownHover.getParent(toggle);
          if (!parent.classList.contains(DROPDOWN_SHOW)) {
            return true;
          }

          toggle.setAttribute('aria-expanded', 'false');

          parent.classList.remove(DROPDOWN_SHOW);
        });
      }
    }
  }, {
    key: 'getParent',
    value: function getParent(element) {
      var selector = void 0;
      if (element.hasAttribute('data-target')) {
        selector = element.getAttribute('data-target');
      }

      if (!selector && element.hasAttribute('href')) {
        selector = element.getAttribute('href');
      }

      var parent = void 0;
      if (selector && /#[A-Za-z]/.test(selector)) {
        parent = document.querySelector(selector);
      } else {
        parent = element.parentNode;
      }

      return parent;
    }
  }]);

  return DropdownHover;
}();

function dropdownHover(elements, option) {
  elements.forEach(function (element) {
    var data = void 0;
    if (element.hasAttribute(DROPDOWN_DATA_KEY)) {
      data = element.getAttribute(DROPDOWN_DATA_KEY);
    }

    if (!data) {
      data = new DropdownHover(element);
      element.setAttribute(DROPDOWN_DATA_KEY, data);
    }

    if (typeof option === 'string') {
      if (data[option] === undefined) {
        throw new Error('No method named "' + option + '"');
      }

      data[option].call(element);
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  var dataHovers = document.querySelectorAll(DROPDOWN_DATA_HOVER);
  if (dataHovers.length) {
    dataHovers.forEach(function (element) {
      element.addEventListener('mouseenter', DropdownHover.prototype.show);
    });
  }

  var hovers = document.querySelectorAll(DROPDOWN_HOVER);
  if (hovers.length) {
    hovers.forEach(function (element) {
      element.addEventListener('mouseleave', DropdownHover.prototype.hide);
    });
  }

  var menus = document.querySelectorAll('.dropdown-static .dropdown-menu');
  if (menus.length) {
    menus.forEach(function (element) {
      element.addEventListener('click', function (e) {
        e.stopPropagation();
      });
    });
  }
});
