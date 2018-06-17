const ESCAPE_KEYCODE           = 27 // KeyboardEvent.which value for Escape (Esc) key
const SPACE_KEYCODE            = 32 // KeyboardEvent.which value for space key
const TAB_KEYCODE              = 9 // KeyboardEvent.which value for tab key
const ARROW_UP_KEYCODE         = 38 // KeyboardEvent.which value for up arrow key
const ARROW_DOWN_KEYCODE       = 40 // KeyboardEvent.which value for down arrow key
const RIGHT_MOUSE_BUTTON_WHICH = 3 // MouseEvent.which value for the right button (assuming a right-handed mouse)
const DROPDOWN_REGEXP_KEYDOWN  = new RegExp(`${ARROW_UP_KEYCODE}|${ARROW_DOWN_KEYCODE}|${ESCAPE_KEYCODE}`)


class Dropdown {
  static get ClassName() {
    return Object.freeze({
      DISABLED : 'disabled',
      SHOW     : 'show'
    })
  }

  static get Default() {
    return Object.freeze({
      menu   : null,
      parent : null
    })
  }

  static get Event() {
    return Object.freeze({
      HIDE   : 'DropdownHide',
      HIDDEN : 'DropdownHidden',
      SHOW   : 'DropdownShow',
      SHOWN  : 'DropdownShown'
    })
  }

  static get Selector() {
    return Object.freeze({
      ACTIVE_TOGGLE : '.show > .dropdown-toggle',
      DATA_HOVER    : '[data-hover="dropdown"]',
      DATA_TOGGLE   : '[data-toggle="dropdown"]',
      FORM          : 'form',
      MEGA_MENU     : '.dropdown-menu-auto, .dropdown-menu-fluid',
      MENU          : '.dropdown-menu',
      NAVBAR_NAV    : '.navbar-nav',
      VISIBLE_ITEMS : '.dropdown-menu .dropdown-item:not(.disabled)'
    })
  }

  constructor(element, config) {
    this.element = element
    this.config  = this.getConfig(config)
    this.parent  = this.config.parent || Dropdown.getParent(this.element)
    this.menu    = this.config.menu || Dropdown.getMenu(this.element, this.parent)
  }

  addEventListeners(names) {
    let events = names || ['click', 'keyboard'];

    if (events.indexOf('click') >= 0) {
      this.element.addEventListener('click', event => {
        event.preventDefault()
        event.stopPropagation()
        this.toggle(event)
      })

      if (this.menu.classList.contains(Dropdown.Selector.MEGA_MENU)) {
        this.menu.addEventListener('click', function (event) {
          event.stopPropagation()
        })
      }

      let form = this.parent.querySelector(Dropdown.Selector.FORM)
      if (form) {
        form.addEventListener('click', function (event) {
          event.stopPropagation()
        })
      }
    }

    if (events.indexOf('keyboard') >= 0) {
      this.element.addEventListener('keydown', Dropdown.keydown)
      this.menu.addEventListener('keydown', Dropdown.keydown)
    }

    if (events.indexOf('hover') >= 0 && !('ontouchstart' in document.documentElement)) {
      this.element.addEventListener('mouseenter', event => this.show(event))
      this.parent.addEventListener('mouseleave', () => this.hide())
    }
  }

  toggle(event) {
    if (this.element.disabled || this.element.classList.contains(Dropdown.ClassName.DISABLED)) {
      return
    }

    let isActive = this.menu.classList.contains(Dropdown.ClassName.SHOW)

    Dropdown.hideMenus(event)

    if (isActive) {
      return
    }

    let relatedTarget = {
      relatedTarget: this.element
    }
    let showEvent = Util.createEvent(Dropdown.Event.SHOW, relatedTarget)
    this.parent.dispatchEvent(showEvent)
    if (showEvent.defaultPrevented) {
      return
    }

    this.element.setAttribute('aria-expanded', 'true')

    this.menu.classList.toggle(Dropdown.ClassName.SHOW)
    this.parent.classList.toggle(Dropdown.ClassName.SHOW)

    let shownEvent = Util.createEvent(Dropdown.Event.SHOWN, relatedTarget)
    this.parent.dispatchEvent(shownEvent)
  }

  show(event) {
    if (this.element.disabled || this.element.classList.contains(Dropdown.ClassName.DISABLED) || this.menu.classList.contains(Dropdown.ClassName.SHOW)) {
      return
    }

    let isActive = this.menu.classList.contains(Dropdown.ClassName.SHOW)

    Dropdown.hideMenus(event)

    if (isActive) {
      return
    }

    let relatedTarget = {
      relatedTarget: this.element
    }
    let showEvent = Util.createEvent(Dropdown.Event.SHOW, relatedTarget)
    this.parent.dispatchEvent(showEvent)
    if (showEvent.defaultPrevented) {
      return
    }

    this.element.setAttribute('aria-expanded', 'true')

    this.menu.classList.add(Dropdown.ClassName.SHOW)
    this.parent.classList.add(Dropdown.ClassName.SHOW)

    let shownEvent = Util.createEvent(Dropdown.Event.SHOWN, relatedTarget)
    this.parent.dispatchEvent(shownEvent)
  }

  hide() {
    if (!this.menu.classList.contains(Dropdown.ClassName.SHOW)) {
      return
    }

    let relatedTarget = {
      relatedTarget: this.element
    }
    let hideEvent = Util.createEvent(Dropdown.Event.HIDE, relatedTarget)
    this.parent.dispatchEvent(hideEvent)
    if (hideEvent.defaultPrevented) {
      return
    }

    this.element.setAttribute('aria-expanded', 'false')

    this.menu.classList.remove(Dropdown.ClassName.SHOW)
    this.parent.classList.remove(Dropdown.ClassName.SHOW)

    let hiddenEvent = Util.createEvent(Dropdown.Event.HIDDEN, relatedTarget)
    this.parent.dispatchEvent(hiddenEvent)
  }

  static hideMenus(event) {
    if (event && (event.which === RIGHT_MOUSE_BUTTON_WHICH ||
      event.type === 'keyup' && event.which !== TAB_KEYCODE)) {
      return
    }

    let elements = document.querySelectorAll(Dropdown.Selector.ACTIVE_TOGGLE)
    if (elements.length) {
      elements.forEach(function (element) {
        let parent = Dropdown.getParent(element)
        let menu = Dropdown.getMenu(element, parent)

        if (!parent.classList.contains(Dropdown.ClassName.SHOW)) {
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
        let hideEvent = Util.createEvent(Dropdown.Event.HIDE, relatedTarget)
        parent.dispatchEvent(hideEvent)
        if (hideEvent.defaultPrevented) {
          return true
        }

        element.setAttribute('aria-expanded', 'false')

        menu.classList.remove(Dropdown.ClassName.SHOW)
        parent.classList.remove(Dropdown.ClassName.SHOW)

        let hiddenEvent = Util.createEvent(Dropdown.Event.HIDDEN, relatedTarget)
        parent.dispatchEvent(hiddenEvent)
      })
    }
  }

  getConfig(config) {
    config = Object.assign({}, Dropdown.Default, config)
    return config
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
      try {
        menu = document.querySelector(selector)
      } catch (err) {
        menu = parent.querySelector(Dropdown.Selector.MENU)
      }
    } else {
      menu = parent.querySelector(Dropdown.Selector.MENU)
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

    if (this.disabled || this.classList.contains(Dropdown.ClassName.DISABLED)) {
      return
    }

    let parent   = Dropdown.getParent(this)
    let isActive = parent.classList.contains(Dropdown.ClassName.SHOW)

    if (!isActive && (event.which !== ESCAPE_KEYCODE || event.which !== SPACE_KEYCODE) ||
         isActive && (event.which === ESCAPE_KEYCODE || event.which === SPACE_KEYCODE)) {

      if (event.which === ESCAPE_KEYCODE) {
        let toggle = parent.querySelector(Dropdown.Selector.DATA_TOGGLE)
        toggle.dispatchEvent(new FocusEvent('focus'))
      }

      this.dispatchEvent(new MouseEvent('click'))

      return
    }

    let items = Array.prototype.slice.call(parent.querySelectorAll(Dropdown.Selector.VISIBLE_ITEMS))

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

if (typeof PostBoot === 'undefined' || PostBoot.Event.Dropdown !== false) {
  document.addEventListener('DOMContentLoaded', function () {
    let toggles = document.querySelectorAll(Dropdown.Selector.DATA_TOGGLE)
    if (toggles.length) {
      toggles.forEach(function (element) {
        let dropdown = new Dropdown(element)
        dropdown.addEventListeners()
      })
    }

    let hovers = document.querySelectorAll(Dropdown.Selector.DATA_HOVER)
    if (hovers.length) {
      hovers.forEach(function (element) {
        let dropdown = new Dropdown(element)
        dropdown.addEventListeners(['hover'])
      })
    }

    document.addEventListener('click', Dropdown.hideMenus)
    document.addEventListener('keyup', Dropdown.hideMenus)
  })
}
