const CHECKBOX_BUTTON_KEY       = 'checkboxButton'
const CHECKBOX_BUTTON_EVENT_KEY = CHECKBOX_BUTTON_KEY

const CheckboxButtonClassName = {
  ACTIVE   : 'active',
  DISABLED : 'disabled'
}

const CheckboxButtonSelector = {
  DATA_TOGGLE : '[data-toggle="chekbox-button"]',
  INPUT       : 'input'
}


class CheckboxButton {
  constructor(element) {
    this.element = element
    this.input   = this.element.querySelector(CheckboxButtonSelector.INPUT)
  }

  addEventListeners() {
    this.element.addEventListener('click', (event) => {
      event.preventDefault()
      this.toggle()
    })
  }

  toggle() {
    if (this.element.disabled || this.element.classList.contains(CheckboxButtonClassName.DISABLED)) {
      return
    }

    let isActive = this.element.classList.contains(ButtonClassName.ACTIVE)

    if (this.input) {
      if (this.input.disabled || this.input.classList.contains(RadioButtonClassName.DISABLED)) {
        return
      }

      this.input.checked = !isActive
      this.input.dispatchEvent(new Event('change'))
      this.input.focus()
    }

    this.element.setAttribute('aria-pressed', !isActive)
    this.element.classList.toggle(CheckboxButtonClassName.ACTIVE)
  }

  static init(element) {
    let button = null

    if (element.hasOwnProperty(CHECKBOX_BUTTON_KEY)) {
      button = element[CHECKBOX_BUTTON_KEY]
    }

    if (!button) {
      button = new CheckboxButton(element)
      element[CHECKBOX_BUTTON_KEY] = button
    }

    return button
  }
}

function checkboxButton(element) {
  return CheckboxButton.init(element)
}

document.addEventListener('DOMContentLoaded', function () {
  let buttons = document.querySelectorAll(CheckboxButtonSelector.DATA_TOGGLE)
  if (buttons.length) {
    buttons.forEach((element) => {
      checkboxButton(element).addEventListeners()
    })
  }
})
