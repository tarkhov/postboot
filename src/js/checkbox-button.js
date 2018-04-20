class CheckboxButton {
  static get KEY() {
    return 'checkboxButton'
  }

  static get EVENT_KEY() {
    return 'CheckboxButton'
  }

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
      ACTIVATE   : `${CheckboxButton.EVENT_KEY}Activate`,
      DEACTIVATE : `${CheckboxButton.EVENT_KEY}Deactivate`
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
    this.element.addEventListener('click', (event) => {
      event.preventDefault()
      this.toggle()
    })
  }

  toggle() {
    if (this.element.disabled || this.element.classList.contains(CheckboxButton.ClassName.DISABLED)) {
      return
    }

    let isActive = this.element.classList.contains(CheckboxButton.ClassName.ACTIVE)

    if (this.input) {
      if (this.input.disabled || this.input.classList.contains(CheckboxButton.ClassName.DISABLED)) {
        return
      }

      this.input.checked = !isActive
      this.input.dispatchEvent(new Event('change'))
      this.input.focus()
    }

    this.element.classList.toggle(CheckboxButton.ClassName.ACTIVE)

    if (!isActive) {
      this.element.setAttribute('aria-pressed', true)

      let activateEvent = Util.createEvent(CheckboxButton.Event.ACTIVATE)
      this.element.dispatchEvent(activateEvent)
    } else {
      this.element.setAttribute('aria-pressed', 'false')

      let deactivateEvent = Util.createEvent(CheckboxButton.Event.DEACTIVATE)
      this.element.dispatchEvent(deactivateEvent)
    }
  }

  getConfig(config) {
    config = Object.assign({}, CheckboxButton.Default, config)
    return config
  }

  static init(element, config) {
    let button = null

    if (element.hasOwnProperty(CheckboxButton.KEY)) {
      button = element[CheckboxButton.KEY]
    }

    if (!button) {
      button = new CheckboxButton(element, config)
      element[CheckboxButton.KEY] = button
    }

    return button
  }
}

function checkboxButton(element, config) {
  return CheckboxButton.init(element, config)
}

if (typeof CHECKBOX_BUTTON_EVENT_OFF === 'undefined' || CHECKBOX_BUTTON_EVENT_OFF === true) {
  document.addEventListener('DOMContentLoaded', function () {
    let buttons = document.querySelectorAll(CheckboxButton.Selector.DATA_TOGGLE)
    if (buttons.length) {
      buttons.forEach((element) => {
        checkboxButton(element).addEventListeners()
      })
    }
  })
}
