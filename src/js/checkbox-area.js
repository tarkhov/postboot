const CHECKBOX_AREA_KEY       = 'checkboxArea'
const CHECKBOX_AREA_EVENT_KEY = CHECKBOX_AREA_KEY

const CheckboxAreaClassName = {
  ACTIVE   : 'active',
  DISABLED : 'disabled'
}

const CheckboxAreaSelector = {
  DATA_TOGGLE : '[data-toggle="checkbox-area"]'
}


class CheckboxArea {
  constructor(element) {
    this.element = element
  }

  addEventListeners() {
    this.element.addEventListener('click', (event) => {
      event.preventDefault()
      this.toggle()
    })
  }

  toggle() {
    if (this.element.classList.contains(CheckboxAreaClassName.DISABLED)) {
      return
    }

    this.element.classList.toggle(CheckboxAreaClassName.ACTIVE)
  }

  static init(element) {
    let area = null

    if (element.hasOwnProperty(CHECKBOX_AREA_KEY)) {
      area = element[CHECKBOX_AREA_KEY]
    }

    if (!area) {
      area = new CheckboxArea(element)
      element[CHECKBOX_AREA_KEY] = area
    }

    return area
  }
}

function checkboxArea(element) {
  return CheckboxArea.init(element)
}

document.addEventListener('DOMContentLoaded', function () {
  let areas = document.querySelectorAll(CheckboxAreaSelector.DATA_TOGGLE)
  if (areas.length) {
    areas.forEach((element) => {
      checkboxArea(element).addEventListeners()
    })
  }
})
