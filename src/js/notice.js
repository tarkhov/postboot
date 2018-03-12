const NOTICE_KEY                 = 'notice'
const NOTICE_EVENT_KEY           = NOTICE_KEY
const NOTICE_TRANSITION_DURATION = 150

const NoticeSelector = {
  DATA_TOGGLE  : '[data-toggle="alert"]',
  DATA_DISMISS : '[data-dismiss="alert"]'
}

const NoticeEvent = {
  HIDE   : `${NOTICE_EVENT_KEY}hide`,
  HIDDEN : `${NOTICE_EVENT_KEY}hidden`,
  SHOW   : `${NOTICE_EVENT_KEY}show`,
  SHOWN  : `${NOTICE_EVENT_KEY}shown`
}

const NoticeClassName = {
  ALERT : 'alert',
  FADE  : 'fade',
  HIDE  : 'hide',
  SHOW  : 'show'
}


class Notice {
  constructor(element) {
    this.element = element
  }

  show() {
    if (this.element.classList.contains(NoticeClassName.SHOW)) {
      return
    }

    let showEvent = Util.createEvent(NoticeEvent.SHOW)
    this.element.dispatchEvent(showEvent)
    if (showEvent.defaultPrevented) {
      return
    }

    this.element.setAttribute(NOTICE_KEY, '')

    if (this.element.classList.contains(NoticeClassName.HIDE)) {
      this.element.classList.remove(NoticeClassName.HIDE)
    }
    this.element.classList.add(NoticeClassName.SHOW)

    let shownEvent = Util.createEvent(NoticeEvent.SHOWN)
    this.element.dispatchEvent(shownEvent)
  }

  hide() {
    if (this.element.classList.contains(NoticeClassName.HIDE)) {
      return
    }

    let hideEvent = Util.createEvent(NoticeEvent.HIDE)
    this.element.dispatchEvent(hideEvent)
    if (hideEvent.defaultPrevented) {
      return
    }

    this.element.removeAttribute(NOTICE_KEY)

    if (this.element.classList.contains(NoticeClassName.SHOW)) {
      this.element.classList.remove(NoticeClassName.SHOW)
    }
    this.element.classList.add(NoticeClassName.HIDE)

    let hiddenEvent = Util.createEvent(NoticeEvent.HIDDEN)
    this.element.dispatchEvent(hiddenEvent)
  }

  static init(element) {
    let notice = null

    if (element.hasOwnProperty(NOTICE_KEY)) {
      notice = element[NOTICE_KEY]
    }

    if (!notice) {
      notice = new Notice(element)
      element[NOTICE_KEY] = notice
    }

    return notice
  }
}

function notice(element) {
  return Notice.init(element)
}

document.addEventListener('DOMContentLoaded', function () {
  let dataToggles = document.querySelectorAll(NoticeSelector.DATA_TOGGLE)
  if (dataToggles.length) {
    dataToggles.forEach((target) => {
      let selector = Util.getSelector(target)
      if (selector) {
        let element = document.querySelector(selector)
        notice(element)
      }
    })
  }
})
