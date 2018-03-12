'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NOTICE_KEY = 'notice';
var NOTICE_EVENT_KEY = NOTICE_KEY;
var NOTICE_TRANSITION_DURATION = 150;

var NoticeSelector = {
  DATA_TOGGLE: '[data-toggle="alert"]',
  DATA_DISMISS: '[data-dismiss="alert"]'
};

var NoticeEvent = {
  HIDE: NOTICE_EVENT_KEY + 'hide',
  HIDDEN: NOTICE_EVENT_KEY + 'hidden',
  SHOW: NOTICE_EVENT_KEY + 'show',
  SHOWN: NOTICE_EVENT_KEY + 'shown'
};

var NoticeClassName = {
  ALERT: 'alert',
  FADE: 'fade',
  HIDE: 'hide',
  SHOW: 'show'
};

var Notice = function () {
  function Notice(element) {
    _classCallCheck(this, Notice);

    this.element = element;
  }

  _createClass(Notice, [{
    key: 'show',
    value: function show() {
      if (this.element.classList.contains(NoticeClassName.SHOW)) {
        return;
      }

      var showEvent = Util.createEvent(NoticeEvent.SHOW);
      this.element.dispatchEvent(showEvent);
      if (showEvent.defaultPrevented) {
        return;
      }

      this.element.setAttribute(NOTICE_KEY, '');

      if (this.element.classList.contains(NoticeClassName.HIDE)) {
        this.element.classList.remove(NoticeClassName.HIDE);
      }
      this.element.classList.add(NoticeClassName.SHOW);

      var shownEvent = Util.createEvent(NoticeEvent.SHOWN);
      this.element.dispatchEvent(shownEvent);
    }
  }, {
    key: 'hide',
    value: function hide() {
      if (this.element.classList.contains(NoticeClassName.HIDE)) {
        return;
      }

      var hideEvent = Util.createEvent(NoticeEvent.HIDE);
      this.element.dispatchEvent(hideEvent);
      if (hideEvent.defaultPrevented) {
        return;
      }

      this.element.removeAttribute(NOTICE_KEY);

      if (this.element.classList.contains(NoticeClassName.SHOW)) {
        this.element.classList.remove(NoticeClassName.SHOW);
      }
      this.element.classList.add(NoticeClassName.HIDE);

      var hiddenEvent = Util.createEvent(NoticeEvent.HIDDEN);
      this.element.dispatchEvent(hiddenEvent);
    }
  }], [{
    key: 'init',
    value: function init(element) {
      var notice = null;

      if (element.hasOwnProperty(NOTICE_KEY)) {
        notice = element[NOTICE_KEY];
      }

      if (!notice) {
        notice = new Notice(element);
        element[NOTICE_KEY] = notice;
      }

      return notice;
    }
  }]);

  return Notice;
}();

function notice(element) {
  return Notice.init(element);
}

document.addEventListener('DOMContentLoaded', function () {
  var dataToggles = document.querySelectorAll(NoticeSelector.DATA_TOGGLE);
  if (dataToggles.length) {
    dataToggles.forEach(function (target) {
      var selector = Util.getSelector(target);
      if (selector) {
        var element = document.querySelector(selector);
        notice(element);
      }
    });
  }
});
