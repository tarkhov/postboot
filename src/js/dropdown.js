const DROPDOWN_KEY             = 'dropdown'
const DROPDOWN_EVENT_KEY       = DROPDOWN_KEY
const DROPDOWN_DROPPED_KEY     = 'dropped'

const ESCAPE_KEYCODE           = 27 // KeyboardEvent.which value for Escape (Esc) key
const SPACE_KEYCODE            = 32 // KeyboardEvent.which value for space key
const TAB_KEYCODE              = 9 // KeyboardEvent.which value for tab key
const ARROW_UP_KEYCODE         = 38 // KeyboardEvent.which value for up arrow key
const ARROW_DOWN_KEYCODE       = 40 // KeyboardEvent.which value for down arrow key
const RIGHT_MOUSE_BUTTON_WHICH = 3 // MouseEvent.which value for the right button (assuming a right-handed mouse)
const DROPDOWN_REGEXP_KEYDOWN  = new RegExp(`${ARROW_UP_KEYCODE}|${ARROW_DOWN_KEYCODE}|${ESCAPE_KEYCODE}`)

const DropdownClassName = {
  DISABLED : 'disabled',
  SHOW     : 'show'
}

const DropdownSelector = {
  DROPPED       : `[${DROPDOWN_DROPPED_KEY}]`,
  DATA_HOVER    : '[data-hover="dropdown"]',
  DATA_TOGGLE   : '[data-toggle="dropdown"]',
  MEGA_MENU     : '.dropdown-mega .dropdown-menu',
  FORM          : 'form',
  MENU          : '.dropdown-menu',
  NAVBAR_NAV    : '.navbar-nav',
  VISIBLE_ITEMS : '.dropdown-menu .dropdown-item:not(.disabled)'
}

const DropdownEvent = {
  HIDE   : `${DROPDOWN_EVENT_KEY}hide`,
  HIDDEN : `${DROPDOWN_EVENT_KEY}hidden`,
  SHOW   : `${DROPDOWN_EVENT_KEY}show`,
  SHOWN  : `${DROPDOWN_EVENT_KEY}shown`
}


class Dropdown {
  constructor(element) {
    this.element = element
    this.parent  = Dropdown.getParent(this.element)
    this.menu    = Dropdown.getMenu(this.element, this.parent)
  }

  addEventListeners() {
    this.element.addEventListener('click', (event) => {
      event.preventDefault()
      event.stopPropagation()
      this.toggle(event)
    })
    this.element.addEventListener('keydown', Dropdown.keydown)
    this.menu.addEventListener('keydown', Dropdown.keydown)

    if (this.menu.classList.contains(DropdownSelector.MEGA_MENU)) {
      this.menu.addEventListener('click', (event) => {
        event.stopPropagation()
      })
    }

    let form = this.parent.querySelector(DropdownSelector.FORM)
    if (form) {
      form.addEventListener('click', (event) => {
        event.stopPropagation()
      })
    }
  }

  addHoverListeners() {
    this.element.addEventListener('mouseenter', (event) => this.show(event))
    this.parent.addEventListener('mouseleave',  () => this.hide())
  }

  toggle(event) {
    if (this.element.disabled || this.element.classList.contains(DropdownClassName.DISABLED)) {
      return
    }

    let isActive = this.menu.classList.contains(DropdownClassName.SHOW)

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

    if ('ontouchstart' in document.documentElement && !this.parent.closest(DropdownSelector.NAVBAR_NAV)) {
      document.body.children.addEventListener('mouseover', () => {})
    }

    this.element.focus()
    this.element.setAttribute('aria-expanded', true)
    this.element.setAttribute(DROPDOWN_DROPPED_KEY, '')

    this.menu.classList.toggle(DropdownClassName.SHOW)
    this.parent.classList.toggle(DropdownClassName.SHOW)

    let shownEvent = Util.createEvent(DropdownEvent.SHOWN, relatedTarget)
    this.parent.dispatchEvent(shownEvent)
  }

  show(event) {
    if (this.element.disabled || this.element.classList.contains(DropdownClassName.DISABLED)) {
      return
    }

    let isActive = this.menu.classList.contains(DropdownClassName.SHOW)

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
    this.element.setAttribute(DROPDOWN_DROPPED_KEY, '')

    this.menu.classList.add(DropdownClassName.SHOW)
    this.parent.classList.add(DropdownClassName.SHOW);

    let shownEvent = Util.createEvent(DropdownEvent.SHOWN, relatedTarget)
    this.parent.dispatchEvent(shownEvent)
  }

  hide() {
    if (!this.menu.classList.contains(DropdownClassName.SHOW)) {
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
    this.element.removeAttribute(DROPDOWN_DROPPED_KEY)

    this.menu.classList.remove(DropdownClassName.SHOW)
    this.parent.classList.remove(DropdownClassName.SHOW)

    let hiddenEvent = Util.createEvent(DropdownEvent.HIDDEN, relatedTarget)
    this.parent.dispatchEvent(hiddenEvent)
  }

  static hideMenus(event) {
    if (event && (event.which === RIGHT_MOUSE_BUTTON_WHICH ||
      event.type === 'keyup' && event.which !== TAB_KEYCODE)) {
      return
    }

    let elements = document.querySelectorAll(DropdownSelector.DROPPED)
    if (elements.length) {
      elements.forEach((element) => {
        if (!element.hasOwnProperty(DROPDOWN_KEY)) {
          return true
        }

        let menu = element[DROPDOWN_KEY].menu
        let parent = element[DROPDOWN_KEY].parent

        if (!parent.classList.contains(DropdownClassName.SHOW)) {
          return true
        }

        if (event && event.target !== element && parent.contains(event.target)) {
          return true
        }

        if (event && (event.type === 'click' &&
            /input|textarea/i.test(event.target.tagName) || event.type === 'keyup' && event.which === TAB_KEYCODE)
            && parent.contains(event.target)) {
          return true
        }

        let relatedTarget = {
          relatedTarget: element
        }
        let hideEvent = Util.createEvent(DropdownEvent.HIDE, relatedTarget)
        parent.dispatchEvent(hideEvent)
        if (hideEvent.defaultPrevented) {
          return true
        }

        if ('ontouchstart' in document.documentElement) {
          document.body.children.removeEventListener('mouseover', () => {})
        }

        element.setAttribute('aria-expanded', 'false')
        element.removeAttribute(DROPDOWN_DROPPED_KEY)

        menu.classList.remove(DropdownClassName.SHOW)
        parent.classList.remove(DropdownClassName.SHOW)

        let hiddenEvent = Util.createEvent(DropdownEvent.HIDDEN, relatedTarget)
        parent.dispatchEvent(hiddenEvent)
      })
    }
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

  static getMenu(element, parent) {
    let menu
    let selector = Util.getSelector(element)

    if (selector) {
      menu = document.querySelector(selector)
    } else {
      menu = parent.querySelector(DropdownSelector.MENU)
    }

    return menu
  }

  static keydown(event) {
    if (!DROPDOWN_REGEXP_KEYDOWN.test(event.which) || /button/i.test(event.target.tagName) && event.which === SPACE_KEYCODE ||
       /input|textarea/i.test(event.target.tagName)) {
      return
    }

    event.preventDefault()
    event.stopPropagation()

    if (this.disabled || this.classList.contains(DropdownClassName.DISABLED)) {
      return
    }

    let parent   = Dropdown.getParent(this)
    let isActive = parent.classList.contains(DropdownClassName.SHOW)

    if (!isActive && (event.which !== ESCAPE_KEYCODE || event.which !== SPACE_KEYCODE) ||
         isActive && (event.which === ESCAPE_KEYCODE || event.which === SPACE_KEYCODE)) {

      if (event.which === ESCAPE_KEYCODE) {
        let toggle = parent.querySelector(DropdownSelector.DATA_TOGGLE)
        toggle.dispatchEvent(new FocusEvent('focus'))
      }

      this.dispatchEvent(new MouseEvent('click'))

      return
    }

    let items = Array.prototype.slice.call(parent.querySelectorAll(DropdownSelector.VISIBLE_ITEMS))

    if (!items.length) {
      return
    }

    let index = items.indexOf(event.target)

    if (event.which === ARROW_UP_KEYCODE && index > 0) { // up
      index--
    }

    if (event.which === ARROW_DOWN_KEYCODE && index < items.length - 1) { // down
      index++
    }

    if (index < 0) {
      index = 0
    }

    items[index].focus()
  }

  static init(element) {
    let dropdown = null

    if (element.hasOwnProperty(DROPDOWN_KEY)) {
      dropdown = element[DROPDOWN_KEY]
    }

    if (!dropdown) {
      dropdown = new Dropdown(element)
      element[DROPDOWN_KEY] = dropdown
    }

    return dropdown
  }
}

function dropdown(element) {
  return Dropdown.init(element)
}

document.addEventListener('DOMContentLoaded', function () {
  let dataToggles = document.querySelectorAll(DropdownSelector.DATA_TOGGLE)
  if (dataToggles.length) {
    dataToggles.forEach((element) => {
      dropdown(element).addEventListeners()
    })
  }

  let dataHovers = document.querySelectorAll(DropdownSelector.DATA_HOVER);
  if (dataHovers.length) {
    dataHovers.forEach((element) => {
      dropdown(element).addHoverListeners()
    })
  }

  document.addEventListener('click', Dropdown.hideMenus)
  document.addEventListener('keyup', Dropdown.hideMenus)
})
