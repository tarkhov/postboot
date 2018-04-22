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
    this.element.setAttribute('aria-checked', !isActive)

    let stateEvent = Util.createEvent((isActive) ? CheckboxArea.Event.DEACTIVATE : CheckboxArea.Event.ACTIVATE)
    this.element.dispatchEvent(stateEvent)
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

if (typeof PostBoot === 'undefined' || PostBoot.Event.CheckboxArea !== false) {
  document.addEventListener('DOMContentLoaded', function () {
    let areas = document.querySelectorAll(CheckboxArea.Selector.DATA_TOGGLE)
    if (areas.length) {
      areas.forEach((element) => {
        checkboxArea(element).addEventListeners()
      })
    }
  })
}
