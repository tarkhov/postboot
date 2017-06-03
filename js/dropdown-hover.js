const DROPDOWN_HOVER_DATA_KEY = `${DROPDOWN_DATA_KEY}.hover`

const DropdownHoverSelector = {
  HOVER     : '.dropdown-hover',
  DATA_HOVER: '[data-hover="dropdown"]',
  TOGGLE    : '.dropdown-toggle'
}


class DropdownHover {
  constructor(element) {
    let parent = Dropdown.getParent(element)

    element.addEventListener('mouseenter', this.show)
    parent.addEventListener('mouseleave', this.hide)
  }

  show() {
    if (this.disabled || this.classList.contains(DropdownClassName.DISABLED)) {
      return false
    }

    let parent   = Dropdown.getParent(this)
    let isActive = parent.classList.contains(DropdownClassName.SHOW)

    DropdownHover.clearMenus()

    if (isActive) {
      return false
    }

    let relatedTarget = {
      relatedTarget: this
    }
    let showEvent = Util.createEvent(DropdownEvent.SHOW, relatedTarget)

    parent.dispatchEvent(showEvent)

    if (showEvent.defaultPrevented) {
      return false
    }

    this.setAttribute('aria-expanded', true)
    parent.classList.add(DropdownClassName.SHOW);

    let shownEvent = Util.createEvent(DropdownEvent.SHOWN, relatedTarget)
    parent.dispatchEvent(shownEvent)
  }

  hide() {
    if (!this.classList.contains(DropdownClassName.SHOW)) {
      return false
    }

    let toggle = this.querySelector(DropdownHoverSelector.DATA_HOVER)
    if (!toggle) {
      toggle = this.querySelector(DropdownHoverSelector.TOGGLE)
    }

    let relatedTarget = {
      relatedTarget: toggle
    }

    let hideEvent = Util.createEvent(DropdownEvent.HIDE, relatedTarget)
    this.dispatchEvent(hideEvent)
    if (hideEvent.defaultPrevented) {
      return false
    }

    toggle.setAttribute('aria-expanded', 'false')
    this.classList.remove(DropdownClassName.SHOW)

    let hiddenEvent = Util.createEvent(DropdownEvent.HIDDEN, relatedTarget)
    this.dispatchEvent(hiddenEvent)
  }

  static clearMenus(event) {
    Dropdown.hideMenus(event, DropdownHoverSelector.DATA_HOVER)
  }
}

function dropdownHover(elements, option) {
  if (typeof elements === 'string') {
    elements = document.querySelectorAll(elements)
  }

  elements.forEach((element) => {
    let data
    if (element.hasAttribute(DROPDOWN_HOVER_DATA_KEY)) {
      data = element.getAttribute(DROPDOWN_HOVER_DATA_KEY)
    }

    if (!data) {
      data = new DropdownHover(element)
      element.setAttribute(DROPDOWN_HOVER_DATA_KEY, data)
    }

    if (typeof option === 'string') {
      if (data[option] === undefined) {
        throw new Error(`No method named "${option}"`)
      }

      data[option].call(element)
    }
  })
}

document.addEventListener('DOMContentLoaded', function () {
  let dataHovers = document.querySelectorAll(DropdownHoverSelector.DATA_HOVER);
  if (dataHovers.length) {
    dataHovers.forEach((element) => {
      element.addEventListener('mouseenter', DropdownHover.prototype.show);
    });
  }

  let hovers = document.querySelectorAll(`${DropdownHoverSelector.HOVER}`);
  if (hovers.length) {
    hovers.forEach((element) => {
      element.addEventListener('mouseleave', DropdownHover.prototype.hide);
    });
  }
})
