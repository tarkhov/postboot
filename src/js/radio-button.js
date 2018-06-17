class RadioButton {
  static get ClassName() {
    return Object.freeze({
      ACTIVE   : 'active',
      DISABLED : 'disabled'
    })
  }

  static get Default() {
    return Object.freeze({
      input  : null,
      parent : null
    })
  }

  static get Event() {
    return Object.freeze({
      ACTIVATE    : 'RadioButtonActivate',
      ACTIVATED   : 'RadioButtonActivated',
      DEACTIVATE  : 'RadioButtonDeactivate',
      DEACTIVATED : 'RadioButtonDeactivated'
    })
  }

  static get Selector() {
    return Object.freeze({
      ACTIVE      : '.btn.active',
      DATA_TOGGLE : '[data-toggle="radio-button"]',
      INPUT       : 'input'
    })
  }

  constructor(element, config) {
    this.element = element
    this.config  = this.getConfig(config)
    this.parent  = this.config.parent || RadioButton.getParent(element)
    this.input   = this.config.input || this.element.querySelector(RadioButton.Selector.INPUT)
  }

  addEventListeners() {
    this.element.addEventListener('click', event => {
      event.preventDefault()
      this.toggle()
    })
  }

  toggle() {
    if (this.element.disabled || this.element.classList.contains(RadioButton.ClassName.DISABLED) || this.element.classList.contains(RadioButton.ClassName.ACTIVE)) {
      return
    }

    let activateEvent = Util.createEvent(RadioButton.Event.ACTIVATE)
    this.element.dispatchEvent(activateEvent)

    if (this.input) {
      if (this.input.disabled || this.input.classList.contains(RadioButton.ClassName.DISABLED) || this.input.checked) {
        return
      }

      this.input.checked = true
      this.input.dispatchEvent(new Event('change'))
      this.input.focus()
    }

    let active = this.parent.querySelector(RadioButton.Selector.ACTIVE)
    if (active) {
      let deactivateEvent = Util.createEvent(RadioButton.Event.DEACTIVATE)
      active.dispatchEvent(deactivateEvent)

      active.classList.remove(RadioButton.ClassName.ACTIVE)
      active.setAttribute('aria-pressed', 'false')

      let deactivatedEvent = Util.createEvent(RadioButton.Event.DEACTIVATED)
      active.dispatchEvent(deactivatedEvent)
    }

    this.element.classList.add(RadioButton.ClassName.ACTIVE)
    this.element.setAttribute('aria-pressed', 'true')

    let activatedEvent = Util.createEvent(RadioButton.Event.ACTIVATED)
    this.element.dispatchEvent(activatedEvent)
  }

  getConfig(config) {
    config = Object.assign({}, RadioButton.Default, config)
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

document.addEventListener('DOMContentLoaded', function () {
  let buttons = document.querySelectorAll(RadioButton.Selector.DATA_TOGGLE)
  if (buttons.length) {
    buttons.forEach(function (element) {
      let radioButton = new RadioButton(element)
      radioButton.addEventListeners()
    })
  }
})
