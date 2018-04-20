class RadioArea {
  static get KEY() {
    return 'radioArea'
  }

  static get EVENT_KEY() {
    return 'RadioArea'
  }

  static get ClassName() {
    return Object.freeze({
      ACTIVE   : 'active',
      DISABLED : 'disabled'
    })
  }

  static get Default() {
    return Object.freeze({
      parent : null
    })
  }

  static get Event() {
    return Object.freeze({
      ACTIVATE   : `${RadioArea.EVENT_KEY}Activate`,
      DEACTIVATE : `${RadioArea.EVENT_KEY}Deactivate`
    })
  }

  static get Selector() {
    return Object.freeze({
      DATA_TOGGLE : '[data-toggle="radio-area"]',
      ACTIVE      : '.active'
    })
  }

  constructor(element, config) {
    this.element = element
    this.config  = this.getConfig(config)
    this.parent  = this.config.parent || RadioArea.getParent(element)
  }

  addEventListeners() {
    this.element.addEventListener('click', (event) => {
      event.preventDefault()
      this.toggle()
    })
  }

  toggle() {
    if (this.element.classList.contains(RadioArea.ClassName.DISABLED) || this.element.classList.contains(RadioArea.ClassName.ACTIVE)) {
      return
    }

    let parent = this.parent || document

    let active = parent.querySelector(RadioArea.Selector.ACTIVE)
    if (active) {
      active.classList.remove(RadioArea.ClassName.ACTIVE)
      active.setAttribute('aria-checked', 'false')

      let deactivateEvent = Util.createEvent(RadioArea.Event.DEACTIVATE)
      active.dispatchEvent(deactivateEvent)
    }

    this.element.classList.add(RadioArea.ClassName.ACTIVE)
    this.element.setAttribute('aria-checked', true)

    let activateEvent = Util.createEvent(RadioArea.Event.ACTIVATE)
    this.element.dispatchEvent(activateEvent)
  }

  getConfig(config) {
    config = Object.assign({}, RadioArea.Default, config)
    return config
  }

  static getParent(element) {
    let parent
    let selector = Util.getParentSelector(element)

    if (selector) {
      parent = document.querySelector(selector)
    } else {
      parent = element.parentNode
    }

    return parent
  }

  static init(element, config) {
    let area = null

    if (element.hasOwnProperty(RadioArea.KEY)) {
      area = element[RadioArea.KEY]
    }

    if (!area) {
      area = new RadioArea(element, config)
      element[RadioArea.KEY] = area
    }

    return area
  }
}

function radioArea(element, config) {
  return RadioArea.init(element, config)
}

if (typeof RADIO_AREA_EVENT_OFF === 'undefined' || RADIO_AREA_EVENT_OFF === true) {
  document.addEventListener('DOMContentLoaded', function () {
    let areas = document.querySelectorAll(RadioArea.Selector.DATA_TOGGLE)
    if (areas.length) {
      areas.forEach((element) => {
        radioArea(element).addEventListeners()
      })
    }
  })
}
