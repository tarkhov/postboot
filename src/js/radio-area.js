class RadioArea {
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
      ACTIVATE    : 'RadioAreaActivate',
      ACTIVATED   : 'RadioAreaActivated',
      DEACTIVATE  : 'RadioAreaDeactivate',
      DEACTIVATED : 'RadioAreaDeactivated'
    })
  }

  static get Selector() {
    return Object.freeze({
      ACTIVE      : '.area.active',
      DATA_TOGGLE : '[data-toggle="radio-area"]'
    })
  }

  constructor(element, config) {
    this.element = element
    this.config  = this.getConfig(config)
    this.parent  = this.config.parent || RadioArea.getParent(element)
  }

  addEventListeners() {
    this.element.addEventListener('click', event => {
      event.preventDefault()
      this.toggle()
    })
  }

  toggle() {
    if (this.element.classList.contains(RadioArea.ClassName.DISABLED) || this.element.classList.contains(RadioArea.ClassName.ACTIVE)) {
      return
    }

    let activateEvent = Util.createEvent(RadioArea.Event.ACTIVATE)
    this.element.dispatchEvent(activateEvent)

    let parent = this.parent || document

    let active = parent.querySelector(RadioArea.Selector.ACTIVE)
    if (active) {
      let deactivateEvent = Util.createEvent(RadioArea.Event.DEACTIVATE)
      active.dispatchEvent(deactivateEvent)

      active.classList.remove(RadioArea.ClassName.ACTIVE)
      active.setAttribute('aria-checked', 'false')

      let deactivatedEvent = Util.createEvent(RadioArea.Event.DEACTIVATED)
      active.dispatchEvent(deactivatedEvent)
    }

    this.element.classList.add(RadioArea.ClassName.ACTIVE)
    this.element.setAttribute('aria-checked', 'true')

    let activatedEvent = Util.createEvent(RadioArea.Event.ACTIVATED)
    this.element.dispatchEvent(activatedEvent)
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
}

if (typeof PostBoot === 'undefined' || PostBoot.Event.RadioArea !== false) {
  document.addEventListener('DOMContentLoaded', function () {
    let areas = document.querySelectorAll(RadioArea.Selector.DATA_TOGGLE)
    if (areas.length) {
      areas.forEach(function (element) {
        let radioArea = new RadioArea(element)
        radioArea.addEventListeners()
      })
    }
  })
}
