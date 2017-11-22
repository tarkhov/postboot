const DROPDOWN_HOVER_KEY = 'dropdownHover'

const DropdownHoverSelector = {
  DATA_HOVER : '[data-hover="dropdown"]',
}


class DropdownHover {
  constructor(element) {
    this.element = element
    this.parent = Dropdown.getParent(this.element)

    this.element.addEventListener('mouseenter', (event) => this.show(event))
    this.parent.addEventListener('mouseleave',  () => this.hide())
  }

  show(event) {
    if (this.element.disabled || this.element.classList.contains(DropdownClassName.DISABLED)) {
      return
    }

    let isActive = this.parent.classList.contains(DropdownClassName.SHOW)

    Dropdown.hideMenus(event)

    if (isActive) {
      return
    }

    let relatedTarget = {
      relatedTarget: this.element
    }
    let showEvent = Util.createEvent(DropdownEvent.SHOW, relatedTarget)

    this.parent.dispatchEvent(showEvent)

    if (showEvent.defaultPrevented) {
      return
    }

    this.element.setAttribute('aria-expanded', true)
    this.element.setAttribute(DROPDOWN_KEY, '')
    this.parent.classList.add(DropdownClassName.SHOW);

    let shownEvent = Util.createEvent(DropdownEvent.SHOWN, relatedTarget)
    this.parent.dispatchEvent(shownEvent)
  }

  hide() {
    if (!this.parent.classList.contains(DropdownClassName.SHOW)) {
      return
    }

    let relatedTarget = {
      relatedTarget: this.element
    }

    let hideEvent = Util.createEvent(DropdownEvent.HIDE, relatedTarget)
    this.parent.dispatchEvent(hideEvent)
    if (hideEvent.defaultPrevented) {
      return
    }

    this.element.setAttribute('aria-expanded', 'false')
    this.element.removeAttribute(DROPDOWN_KEY)
    this.parent.classList.remove(DropdownClassName.SHOW)

    let hiddenEvent = Util.createEvent(DropdownEvent.HIDDEN, relatedTarget)
    this.parent.dispatchEvent(hiddenEvent)
  }

  static init(element) {
    let dropdownHover = null

    if (element.hasOwnProperty(DROPDOWN_HOVER_KEY)) {
      dropdownHover = element[DROPDOWN_HOVER_KEY]
    }

    if (!dropdownHover) {
      dropdownHover = new DropdownHover(element)
      element[DROPDOWN_HOVER_KEY] = dropdownHover
    }

    return dropdownHover
  }
}

function dropdownHover(element) {
  return DropdownHover.init(element)
}

document.addEventListener('DOMContentLoaded', function () {
  let dataHovers = document.querySelectorAll(DropdownHoverSelector.DATA_HOVER);
  if (dataHovers.length) {
    dataHovers.forEach((element) => {
      dropdownHover(element)
    });
  }
})
