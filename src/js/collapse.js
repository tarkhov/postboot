class Collapse {
  static get KEY() {
    return 'collapse'
  }

  static get COLLAPSED_KEY() {
    return 'collapsed'
  }

  static get EVENT_KEY() {
    return 'Collapse'
  }

  static get ClassName() {
    return Object.freeze({
      COLLAPSE   : 'collapse',
      COLLAPSED  : 'collapsed',
      COLLAPSING : 'collapsing',
      SHOW       : 'show'
    })
  }

  static get Default() {
    return Object.freeze({
      parent : null,
      target : null
    })
  }

  static get Event() {
    return Object.freeze({
      HIDE   : `${Collapse.EVENT_KEY}Hide`,
      HIDDEN : `${Collapse.EVENT_KEY}Hidden`,
      SHOW   : `${Collapse.EVENT_KEY}Show`,
      SHOWN  : `${Collapse.EVENT_KEY}Shown`
    })
  }

  static get Selector() {
    return Object.freeze({
      ACTIVES     : '.show, .collapsing',
      COLLAPSE    : '.collapse',
      COLLAPSED   : `[${Collapse.COLLAPSED_KEY}]`,
      DATA_TOGGLE : '[data-toggle="collapse"]'
    })
  }

  constructor(element, config) {
    this.element = element
    this.config  = this.getConfig(config)
    this.parent  = this.config.parent || Collapse.getParent(this.element)
    this.target  = this.config.target || Collapse.getTarget(this.element)
  }

  addEventListeners() {
    this.element.addEventListener('click', (event) => {
      event.preventDefault()
      this.toggle()
    })
  }

  addHoverListeners() {
    this.element.addEventListener('mouseenter', (event) => this.show(event))
    this.element.addEventListener('mouseleave',  () => this.hide())
  }

  toggle() {
    if (!this.target.classList.contains(Collapse.ClassName.SHOW)) {
      this.show()
    } else {
      this.hide()
    }
  }

  show() {
    if (this.element.disabled || this.element.classList.contains(Collapse.ClassName.DISABLED)) {
      return
    }

    let showEvent = Util.createEvent(Collapse.Event.SHOW)
    this.target.dispatchEvent(showEvent)
    if (showEvent.defaultPrevented) {
      return
    }
    
    if (this.parent) {
      let collapsed = this.parent.querySelectorAll(Collapse.Selector.COLLAPSED)
      if (collapsed.length) {
        collapsed.forEach((element) => {
          if (!element.hasOwnProperty(Collapse.KEY)) {
            return true
          }

          let collapse = element[Collapse.KEY]
          collapse.hide()
        })
      }
    }

    this.element.setAttribute('aria-expanded', true)
    this.element.setAttribute(Collapse.COLLAPSED_KEY, '')

    window.requestAnimationFrame(() => {
      this.target.classList.add(Collapse.ClassName.COLLAPSING)
      this.target.classList.remove(Collapse.ClassName.COLLAPSE)
      this.target.style.height = `${this.target.scrollHeight}px`
    })

    function shown(event) {
      event.target.classList.remove(Collapse.ClassName.COLLAPSING)
      event.target.classList.add(Collapse.ClassName.COLLAPSE)
      event.target.classList.add(Collapse.ClassName.SHOW)

      let shownEvent = Util.createEvent(Collapse.Event.SHOWN)
      event.target.dispatchEvent(shownEvent)

      event.target.removeEventListener(event.type, shown)
    }
    this.target.addEventListener('transitionend', shown)
  }

  hide() {
    if (this.element.disabled || this.element.classList.contains(Collapse.ClassName.DISABLED)) {
      return
    }

    let hideEvent = Util.createEvent(Collapse.Event.HIDE)
    this.target.dispatchEvent(hideEvent)
    if (hideEvent.defaultPrevented) {
      return
    }

    this.element.setAttribute('aria-expanded', 'false')
    this.element.removeAttribute(Collapse.COLLAPSED_KEY)

    window.requestAnimationFrame(() => {
      this.target.classList.add(Collapse.ClassName.COLLAPSING)
      this.target.classList.remove(Collapse.ClassName.COLLAPSE)
      this.target.style.height = null
    })

    function hidden(event) {
      event.target.classList.remove(Collapse.ClassName.COLLAPSING)
      event.target.classList.add(Collapse.ClassName.COLLAPSE)
      event.target.classList.remove(Collapse.ClassName.SHOW)

      let hiddenEvent = Util.createEvent(Collapse.Event.HIDDEN)
      event.target.dispatchEvent(hiddenEvent)

      event.target.removeEventListener(event.type, hidden)
    }
    this.target.addEventListener('transitionend', hidden)
  }

  getConfig(config) {
    config = Object.assign({}, Collapse.Default, config)
    return config
  }

  static getParent(element) {
    let selector = Util.getParentSelector(element)
    return selector && document.querySelector(selector)
  }

  static getTarget(element) {
    let selector = Util.getSelector(element)
    return selector && document.querySelector(selector)
  }

  static init(element, config) {
    let collapse = null

    if (element.hasOwnProperty(Collapse.KEY)) {
      collapse = element[Collapse.KEY]
    }

    if (!collapse) {
      collapse = new Collapse(element, config)
      element[Collapse.KEY] = collapse
    }

    return collapse
  }
}

function collapse(element, config) {
  return Collapse.init(element, config)
}

if (typeof COLLAPSE_EVENT_OFF === 'undefined' || COLLAPSE_EVENT_OFF === true) {
  document.addEventListener('DOMContentLoaded', function () {
    let toggles = document.querySelectorAll(Collapse.Selector.DATA_TOGGLE)
    if (toggles.length) {
      toggles.forEach((element) => {
        collapse(element).addEventListeners()
      })
    }

    /*let dataHovers = document.querySelectorAll(Collapse.Selector.DATA_HOVER)
    if (dataHovers.length) {
      dataHovers.forEach((element) => {
        collapse(element).addHoverListeners()
      })
    }*/
  })
}
