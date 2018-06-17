class CheckboxButton {
  static get ClassName() {
    return Object.freeze({
      ACTIVE   : 'active',
      DISABLED : 'disabled'
    })
  }

  static get Default() {
    return Object.freeze({
      input  : null
    })
  }

  static get Event() {
    return Object.freeze({
      ACTIVATE    : 'CheckboxButtonActivate',
      ACTIVATED   : 'CheckboxButtonActivated',
      DEACTIVATE  : 'CheckboxButtonDeactivate',
      DEACTIVATED : 'CheckboxButtonDeactivated'
    })
  }

  static get Selector() {
    return Object.freeze({
      DATA_TOGGLE : '[data-toggle="checkbox-button"]',
      INPUT       : 'input'
    })
  }

  constructor(element, config) {
    this.element = element
    this.config  = this.getConfig(config)
    this.input   = this.config.input || this.element.querySelector(CheckboxButton.Selector.INPUT)
  }

  addEventListeners() {
    this.element.addEventListener('click', event => {
      event.preventDefault()
      this.toggle()
    })
  }

  toggle() {
    if (this.element.disabled || this.element.classList.contains(CheckboxButton.ClassName.DISABLED)) {
      return
    }

    let isActive = this.element.classList.contains(CheckboxButton.ClassName.ACTIVE)

    let activateEvent = Util.createEvent((isActive) ? CheckboxButton.Event.DEACTIVATE : CheckboxButton.Event.ACTIVATE)
    this.element.dispatchEvent(activateEvent)

    if (this.input) {
      if (this.input.disabled || this.input.classList.contains(CheckboxButton.ClassName.DISABLED)) {
        return
      }

      this.input.checked = !isActive
      this.input.dispatchEvent(new Event('change'))
      this.input.focus()
    }

    this.element.classList.toggle(CheckboxButton.ClassName.ACTIVE)
    this.element.setAttribute('aria-pressed', !isActive)

    let activatedEvent = Util.createEvent((isActive) ? CheckboxButton.Event.DEACTIVATED : CheckboxButton.Event.ACTIVATED)
    this.element.dispatchEvent(activatedEvent)
  }

  getConfig(config) {
    config = Object.assign({}, CheckboxButton.Default, config)
    return config
  }
}

if (typeof PostBoot === 'undefined' || PostBoot.Event.CheckboxButton !== false) {
  document.addEventListener('DOMContentLoaded', function () {
    let buttons = document.querySelectorAll(CheckboxButton.Selector.DATA_TOGGLE)
    if (buttons.length) {
      buttons.forEach(function (element) {
        let checkboxButton = new CheckboxButton(element)
        checkboxButton.addEventListeners()
      })
    }
  })
}
