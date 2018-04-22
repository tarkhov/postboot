class RadioButton {
  static get KEY() {
    return 'radioButton'
  }

  static get CHECKED_KEY() {
    return 'checked-button'
  }

  static get EVENT_KEY() {
    return 'RadioButton'
  }

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
      ACTIVATE   : `${RadioButton.EVENT_KEY}Activate`,
      DEACTIVATE : `${RadioButton.EVENT_KEY}Deactivate`
    })
  }

  static get Selector() {
    return Object.freeze({
      ACTIVE      : '.active',
      CHECKED     : `[${RadioButton.CHECKED_KEY}]`,
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
    this.element.addEventListener('click', (event) => {
      event.preventDefault()
      this.toggle()
    })
  }

  toggle() {
    if (this.element.disabled || this.element.classList.contains(RadioButton.ClassName.DISABLED) || this.element.classList.contains(RadioButton.ClassName.ACTIVE)) {
      return
    }

    if (this.input) {
      if (this.input.disabled || this.input.classList.contains(RadioButton.ClassName.DISABLED) || this.input.checked) {
        return
      }

      this.input.checked = true
      this.input.dispatchEvent(new Event('change'))
      this.input.focus()
    }

    let active = this.parent.querySelector(RadioButton.Selector.CHECKED)
    if (active) {
      active.classList.remove(RadioButton.ClassName.ACTIVE)
      active.setAttribute('aria-pressed', 'false')
      active.removeAttribute(RadioButton.CHECKED_KEY)

      let deactivateEvent = Util.createEvent(RadioButton.Event.DEACTIVATE)
      active.dispatchEvent(deactivateEvent)
    }

    this.element.classList.add(RadioButton.ClassName.ACTIVE)
    this.element.setAttribute('aria-pressed', 'true')
    this.element.setAttribute(RadioButton.CHECKED_KEY, '')

    let activateEvent = Util.createEvent(RadioButton.Event.ACTIVATE)
    this.element.dispatchEvent(activateEvent)
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

  static init(element, config) {
    let button = null

    if (element.hasOwnProperty(RadioButton.KEY)) {
      button = element[RadioButton.KEY]
    }

    if (!button) {
      button = new RadioButton(element, config)
      element[RadioButton.KEY] = button
    }

    return button
  }
}

function radioButton(element, config) {
  return RadioButton.init(element, config)
}

if (typeof PostBoot === 'undefined' || PostBoot.Event.RadioButton !== false) {
  document.addEventListener('DOMContentLoaded', function () {
    let buttons = document.querySelectorAll(RadioButton.Selector.DATA_TOGGLE)
    if (buttons.length) {
      buttons.forEach((element) => {
        radioButton(element).addEventListeners()
      })
    }
  })
}
