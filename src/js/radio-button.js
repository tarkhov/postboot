const RADIO_BUTTON_KEY       = 'radioButton'
const RADIO_BUTTON_EVENT_KEY = RADIO_BUTTON_KEY

const RadioButtonClassName = {
  ACTIVE   : 'active',
  DISABLED : 'disabled'
}

const RadioButtonSelector = {
  DATA_TOGGLE : '[data-toggle="radio-button"]',
  INPUT       : 'input',
  ACTIVE      : '.active'
}


class RadioButton {
  constructor(element) {
    this.element = element
    this.parent  = RadioButton.getParent(element)
    this.input   = this.element.querySelector(RadioButtonSelector.INPUT)
  }

  addEventListeners() {
    this.element.addEventListener('click', (event) => {
      event.preventDefault()
      this.toggle()
    })
  }

  toggle() {
    if (this.element.disabled || this.element.classList.contains(RadioButtonClassName.DISABLED) || this.element.classList.contains(RadioButtonClassName.ACTIVE)) {
      return
    }

    if (this.input) {
      if (this.input.disabled || this.input.classList.contains(RadioButtonClassName.DISABLED) || this.input.checked) {
        return
      }

      this.input.checked = true
      this.input.dispatchEvent(new Event('change'))
      this.input.focus()
    }

    let active = this.parent.querySelector(RadioButtonSelector.ACTIVE)
    if (active) {
      active.classList.remove(RadioButtonClassName.ACTIVE)
    }

    this.element.setAttribute('aria-pressed', true)
    this.element.classList.add(RadioButtonClassName.ACTIVE)
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

  static init(element) {
    let button = null

    if (element.hasOwnProperty(RADIO_BUTTON_KEY)) {
      button = element[RADIO_BUTTON_KEY]
    }

    if (!button) {
      button = new RadioButton(element)
      element[RADIO_BUTTON_KEY] = button
    }

    return button
  }
}

function radioButton(element) {
  return RadioButton.init(element)
}

document.addEventListener('DOMContentLoaded', function () {
  let buttons = document.querySelectorAll(RadioButtonSelector.DATA_TOGGLE)
  if (buttons.length) {
    buttons.forEach((element) => {
      radioButton(element).addEventListeners()
    })
  }
})
