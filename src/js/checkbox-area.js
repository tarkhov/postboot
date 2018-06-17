class CheckboxArea {
  static get ClassName() {
    return Object.freeze({
      ACTIVE   : 'active',
      DISABLED : 'disabled'
    })
  }

  static get Event() {
    return Object.freeze({
      ACTIVATE    : 'CheckboxAreaActivate',
      ACTIVATED   : 'CheckboxAreaActivated',
      DEACTIVATE  : 'CheckboxAreaDeactivate',
      DEACTIVATED : 'CheckboxAreaDeactivated'
    })
  }

  static get Selector() {
    return Object.freeze({
      DATA_TOGGLE : '[data-toggle="checkbox-area"]'
    })
  }

  constructor(element) {
    this.element = element
  }

  addEventListeners() {
    this.element.addEventListener('click', event => {
      event.preventDefault()
      this.toggle()
    })
  }

  toggle() {
    if (this.element.classList.contains(CheckboxArea.ClassName.DISABLED)) {
      return
    }

    let isActive = this.element.classList.contains(CheckboxArea.ClassName.ACTIVE)

    let activateEvent = Util.createEvent((isActive) ? CheckboxArea.Event.DEACTIVATE : CheckboxArea.Event.ACTIVATE)
    this.element.dispatchEvent(activateEvent)

    this.element.classList.toggle(CheckboxArea.ClassName.ACTIVE)
    this.element.setAttribute('aria-checked', !isActive)

    let activatedEvent = Util.createEvent((isActive) ? CheckboxArea.Event.DEACTIVATED : CheckboxArea.Event.ACTIVATED)
    this.element.dispatchEvent(activatedEvent)
  }
}

if (typeof PostBoot === 'undefined' || PostBoot.Event.CheckboxArea !== false) {
  document.addEventListener('DOMContentLoaded', function () {
    let areas = document.querySelectorAll(CheckboxArea.Selector.DATA_TOGGLE)
    if (areas.length) {
      areas.forEach(function (element) {
        let checkboxArea = new CheckboxArea(element)
        checkboxArea.addEventListeners()
      })
    }
  })
}
