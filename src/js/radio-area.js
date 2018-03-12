const RADIO_AREA_KEY       = 'radioArea'
const RADIO_AREA_EVENT_KEY = RADIO_AREA_KEY

const RadioAreaClassName = {
  ACTIVE   : 'active',
  DISABLED : 'disabled'
}

const RadioAreaSelector = {
  DATA_TOGGLE : '[data-toggle="radio-area"]',
  INPUT       : 'input',
  ACTIVE      : '.active'
}


class RadioArea {
  constructor(element) {
    this.element = element
    this.parent  = RadioArea.getParent(element)
    this.input   = this.element.querySelector(RadioAreaSelector.INPUT)
  }

  addEventListeners() {
    this.element.addEventListener('click', (event) => {
      event.preventDefault()
      this.toggle()
    })
  }

  toggle() {
    if (this.element.classList.contains(RadioAreaClassName.DISABLED) || this.element.classList.contains(RadioAreaClassName.ACTIVE)) {
      return
    }

    let active = this.parent.querySelector(RadioAreaSelector.ACTIVE)
    if (active) {
      active.classList.remove(RadioAreaClassName.ACTIVE)
    }

    this.element.setAttribute('aria-pressed', true)
    this.element.classList.add(RadioAreaClassName.ACTIVE)
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
    let area = null

    if (element.hasOwnProperty(RADIO_AREA_KEY)) {
      area = element[RADIO_AREA_KEY]
    }

    if (!area) {
      area = new RadioArea(element)
      element[RADIO_AREA_KEY] = area
    }

    return area
  }
}

function radioArea(element) {
  return RadioArea.init(element)
}

document.addEventListener('DOMContentLoaded', function () {
  let areas = document.querySelectorAll(RadioAreaSelector.DATA_TOGGLE)
  if (areas.length) {
    areas.forEach((element) => {
      radioArea(element).addEventListeners()
    })
  }
})
