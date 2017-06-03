const DROPDOWN_DATA_KEY        = 'bs.dropdown'
const DROPDOWN_EVENT_KEY       = `.${DROPDOWN_DATA_KEY}`

const SPACE_KEYCODE            = 32 // KeyboardEvent.which value for space key
const TAB_KEYCODE              = 9 // KeyboardEvent.which value for tab key
const ARROW_UP_KEYCODE         = 38 // KeyboardEvent.which value for up arrow key
const ARROW_DOWN_KEYCODE       = 40 // KeyboardEvent.which value for down arrow key
const RIGHT_MOUSE_BUTTON_WHICH = 3 // MouseEvent.which value for the right button (assuming a right-handed mouse)
const DROPDOWN_REGEXP_KEYDOWN  = new RegExp(`${ARROW_UP_KEYCODE}|${ARROW_DOWN_KEYCODE}|${ESCAPE_KEYCODE}`)

const DropdownClassName = {
  DISABLED: 'disabled',
  SHOW    : 'show'
}

const DropdownSelector = {
  DATA_TOGGLE  : '[data-toggle="dropdown"]',
  FORM_CHILD   : '.dropdown form',
  MENU         : '.dropdown-menu',
  NAVBAR_NAV   : '.navbar-nav',
  VISIBLE_ITEMS: '.dropdown-menu .dropdown-item:not(.disabled)'
}

const DropdownEvent = {
  HIDE:   `hide${DROPDOWN_EVENT_KEY}`,
  HIDDEN: `hidden${DROPDOWN_EVENT_KEY}`,
  SHOW:   `show${DROPDOWN_EVENT_KEY}`,
  SHOWN:  `shown${DROPDOWN_EVENT_KEY}`
}


class Dropdown {
  constructor(element) {
    element.addEventListener('click', this.toggle)
  }

  toggle(event) {
    event.preventDefault()

    if (this.disabled || this.classList.contains(DropdownClassName.DISABLED)) {
      return false
    }

    let parent   = Dropdown.getParent(this)
    let isActive = parent.classList.contains(DropdownClassName.SHOW)

    Dropdown.clearMenus(event)

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

    if ('ontouchstart' in document.documentElement && !parent.closest(DropdownSelector.NAVBAR_NAV)) {
      document.body.children.addEventListener('mouseover', () => {})
    }

    this.focus()
    this.setAttribute('aria-expanded', true)

    parent.classList.toggle(DropdownClassName.SHOW)

    let shownEvent = Util.createEvent(DropdownEvent.SHOWN, relatedTarget)
    parent.dispatchEvent(shownEvent)
  }

  static hideMenus(event, selector) {
    if (event && (event.which === RIGHT_MOUSE_BUTTON_WHICH ||
      event.type === 'keyup' && event.which !== TAB_KEYCODE)) {
      return
    }

    let toggles = document.querySelectorAll(selector)
    if (toggles.length) {
      toggles.forEach((toggle) => {
        let parent = Dropdown.getParent(toggle)
        let relatedTarget = {
          relatedTarget: toggle
        }

        if (!parent.classList.contains(DropdownClassName.SHOW)) {
          return true
        }

        if (event.target !== toggle && parent.contains(event.target)) {
          return true
        }

        if (event && (event.type === 'click' &&
            /input|textarea/i.test(event.target.tagName) || event.type === 'keyup' && event.which === TAB_KEYCODE)
            && parent.contains(event.target)) {
          return true
        }

        let hideEvent = Util.createEvent(DropdownEvent.HIDE, relatedTarget)
        parent.dispatchEvent(hideEvent)
        if (hideEvent.defaultPrevented) {
          return true
        }

        if ('ontouchstart' in document.documentElement) {
          document.body.children.removeEventListener('mouseover', () => {})
        }

        toggle.setAttribute('aria-expanded', 'false')

        parent.classList.remove(DropdownClassName.SHOW)

        let hiddenEvent = Util.createEvent(DropdownEvent.HIDDEN, relatedTarget)
        parent.dispatchEvent(hiddenEvent)
      })
    }
  }

  static clearMenus(event) {
    Dropdown.hideMenus(event, DropdownSelector.DATA_TOGGLE)
  }

  static getParent(element) {
    let parent
    let selector = Util.getSelector(element)

    if (selector) {
      parent = document.querySelector(selector)
    } else {
      parent = element.parentNode
    }

    return parent
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

}

function dropdown(elements, option) {
  if (typeof elements === 'string') {
    elements = document.querySelectorAll(elements)
  }

  elements.forEach((element) => {
    let data
    if (element.hasAttribute(DROPDOWN_DATA_KEY)) {
      data = element.getAttribute(DROPDOWN_DATA_KEY)
    }

    if (!data) {
      data = new Dropdown(element)
      element.setAttribute(DROPDOWN_DATA_KEY, data)
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
  let dataToggles = document.querySelectorAll(DropdownSelector.DATA_TOGGLE)
  if (dataToggles.length) {
    dataToggles.forEach((element) => {
      element.addEventListener('keydown', Dropdown.keydown)
      element.addEventListener('click', Dropdown.prototype.toggle)
    })
  }

  let menus = document.querySelectorAll(DropdownSelector.MENU)
  if (menus.length) {
    menus.forEach((element) => {
      element.addEventListener('keydown', Dropdown.keydown)
    })
  }

  let forms = document.querySelectorAll(DropdownSelector.FORM_CHILD)
  if (forms.length) {
    forms.forEach((element) => {
      element.addEventListener('click', (e) => {
        e.stopPropagation()
      })
    })
  }

  /*document.addEventListener('click', Dropdown.clearMenus)
  document.addEventListener('keyup', Dropdown.clearMenus)*/
})
