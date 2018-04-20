class CheckboxArea {
  static get KEY() {
    return 'checkboxArea'
  }

  static get EVENT_KEY() {
    return 'CheckboxArea'
  }

  static get ClassName() {
    return Object.freeze({
      ACTIVE   : 'active',
      DISABLED : 'disabled'
    })
  }

  static get Event() {
    return Object.freeze({
      ACTIVATE   : `${CheckboxArea.EVENT_KEY}Activate`,
      DEACTIVATE : `${CheckboxArea.EVENT_KEY}Deactivate`
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
    this.element.addEventListener('click', (event) => {
      event.preventDefault()
      this.toggle()
    })
  }

  toggle() {
    if (this.element.classList.contains(CheckboxArea.ClassName.DISABLED)) {
      return
    }

    let isActive = this.element.classList.contains(CheckboxArea.ClassName.ACTIVE)
    this.element.classList.toggle(CheckboxArea.ClassName.ACTIVE)

    if (!isActive) {
      this.element.setAttribute('aria-checked', true)

      let activateEvent = Util.createEvent(CheckboxArea.Event.ACTIVATE)
      this.element.dispatchEvent(activateEvent)
    } else {
      this.element.setAttribute('aria-checked', 'false')

      let deactivateEvent = Util.createEvent(CheckboxArea.Event.DEACTIVATE)
      this.element.dispatchEvent(deactivateEvent)
    }
  }

  static init(element) {
    let area = null

    if (element.hasOwnProperty(CheckboxArea.KEY)) {
      area = element[CheckboxArea.KEY]
    }

    if (!area) {
      area = new CheckboxArea(element)
      element[CheckboxArea.KEY] = area
    }

    return area
  }
}

function checkboxArea(element) {
  return CheckboxArea.init(element)
}

if (typeof CHECKBOX_AREA_EVENT_OFF === 'undefined' || CHECKBOX_AREA_EVENT_OFF === true) {
  document.addEventListener('DOMContentLoaded', function () {
    let areas = document.querySelectorAll(CheckboxArea.Selector.DATA_TOGGLE)
    if (areas.length) {
      areas.forEach((element) => {
        checkboxArea(element).addEventListeners()
      })
    }
  })
}
