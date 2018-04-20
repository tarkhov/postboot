class ScrollSpy {
  static get KEY() {
    return 'scrollSpy'
  }

  static get EVENT_KEY() {
    return 'ScrollSpy'
  }

  static get ClassName() {
    return Object.freeze({
      ACTIVE        : 'active',
      DROPDOWN_ITEM : 'dropdown-item',
      DROPDOWN_MENU : 'dropdown-menu',
      NAV_LINK      : 'nav-link',
      SHOW          : 'show'
    })
  }

  static get Default() {
    return Object.freeze({
      offset : 10,
      method : 'auto',
      target : ''
    })
  }

  static get Event() {
    return Object.freeze({
      ACTIVATE : `${ScrollSpy.EVENT_KEY}Activate`
    })
  }

  static get OffsetMethod() {
    return Object.freeze({
      OFFSET   : 'offset',
      POSITION : 'position'
    })
  }

  static get Selector() {
    return Object.freeze({
      ACTIVE          : '.active',
      DATA_SPY        : '[data-spy="scroll"]',
      DROPDOWN        : '.dropdown',
      DROPDOWN_ITEM   : '.dropdown-item',
      DROPDOWN_MENU   : '.dropdown-menu',
      DROPDOWN_TOGGLE : '.dropdown-toggle',
      DROPDOWNS       : '.dropup, .dropright, .dropdown, .dropleft',
      HIDE            : '.hide',
      LIST_ITEM       : '.list-group-item',
      NAV_ITEM        : '.nav-item',
      NAV_LINK        : '.nav-link',
      NAV_LIST_GROUP  : '.nav, .list-group',
      SHOW            : '.show'
    })
  }

  constructor(element, config) {
    this.element       = element
    this.scrollElement = element.tagName === 'BODY' ? window : element
    this.config        = this.getConfig(config)
    this.target        = document.querySelector(this.config.target)
    this.selector      = `${this.config.target} ${ScrollSpy.Selector.NAV_LINK},`
                        + `${this.config.target} ${ScrollSpy.Selector.LIST_ITEM},`
                        + `${this.config.target} ${ScrollSpy.Selector.DROPDOWN_ITEM}`
    this.offsets       = []
    this.targets       = []
    this.activeTarget  = null
    this.scrollHeight  = 0

    this.scrollElement.addEventListener('scroll', (event) => this.process(event))

    this.refresh()
    this.process()
  }

  refresh() {
    let autoMethod = this.scrollElement !== this.scrollElement.window ?
      ScrollSpy.OffsetMethod.POSITION : ScrollSpy.OffsetMethod.OFFSET

    let offsetMethod = this.config.method === 'auto' ?
      autoMethod : this.config.method

    let offsetBase = offsetMethod === ScrollSpy.OffsetMethod.POSITION ?
      this.getScrollTop() : 0

    this.offsets = []
    this.targets = []

    this.scrollHeight = this.getScrollHeight()

    let targets = Array.prototype.slice.call(document.querySelectorAll(this.selector))

    targets
      .map((element) => {
        let target
        let targetSelector = Util.getSelector(element)

        if (targetSelector) {
          target = document.querySelector(targetSelector)
        }

        if (target) {
          let targetBCR = target.getBoundingClientRect()
          if (targetBCR.width || targetBCR.height) {
            // todo (fat): remove sketch reliance on jQuery position/offset
            return [
              target[offsetMethod]().top + offsetBase,
              targetSelector
            ]
          }
        }
        return null
      })
      .filter((item)  => item)
      .sort((a, b)    => a[0] - b[0])
      .forEach((item) => {
        this.offsets.push(item[0])
        this.targets.push(item[1])
      })
  }


  getConfig(config) {
    config = Object.assign({}, ScrollSpy.Default, config)
    return config
  }

  getScrollTop() {
    return this.scrollElement === window ?
        this.scrollElement.pageYOffset : this.scrollElement.scrollTop
  }

  getScrollHeight() {
    return this.scrollElement.scrollHeight || Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    )
  }

  getOffsetHeight() {
    return this.scrollElement === window ?
        window.innerHeight : this.scrollElement.getBoundingClientRect().height
  }

  process() {
    let scrollTop    = this.getScrollTop() + this.config.offset
    let scrollHeight = this.getScrollHeight()
    let maxScroll    = this.config.offset
      + scrollHeight
      - this.getOffsetHeight()

    if (this.scrollHeight !== scrollHeight) {
      this.refresh()
    }

    if (scrollTop >= maxScroll) {
      let target = this.targets[this.targets.length - 1]

      if (this.activeTarget !== target) {
        this.activate(target)
      }
      return
    }

    if (this.activeTarget && scrollTop < this.offsets[0] && this.offsets[0] > 0) {
      this.activeTarget = null
      this.clear()
      return
    }

    for (let i = this.offsets.length; i--;) {
      const isActiveTarget = this.activeTarget !== this.targets[i]
          && scrollTop >= this.offsets[i]
          && (this.offsets[i + 1] === undefined ||
              scrollTop < this.offsets[i + 1])

      if (isActiveTarget) {
        this.activate(this.targets[i])
      }
    }
  }

  activate(target) {
    this.activeTarget = target

    this.clear()

    let queries = this.selector.split(',')
    queries = queries.map((selector) => {
      return `${selector}[data-target="${target}"],` +
             `${selector}[href="${target}"]`
    })

    let link = this.target.querySelector(queries.join(','))

    if (link.classList.contains(ScrollSpy.ClassName.DROPDOWN_ITEM)) {
      let dropdowns = link.parentAll(`${ScrollSpy.Selector.DROPDOWNS}, ${ScrollSpy.Selector.DROPDOWN_MENU}`, this.config.target)
      if (dropdowns.length) {
        dropdowns.forEach((dropdown) => {
          dropdown.classList.add(ScrollSpy.ClassName.SHOW)
        })
      }
    } else if (link.classList.contains(ScrollSpy.ClassName.NAV_LINK)) {
      let items = link.parentAll(ScrollSpy.Selector.NAV_ITEM, this.config.target)
      if (items.length) {
        items.forEach((item) => {
          item.classList.add(ScrollSpy.ClassName.SHOW)
        })
      }
    } else {
      //$link.parents(ScrollSpy.Selector.NAV_LIST_GROUP).prev(`${ScrollSpy.Selector.NAV_LINK}, ${ScrollSpy.Selector.LIST_ITEM}`).addClass(ScrollSpy.ClassName.ACTIVE)
    }
    link.classList.add(ScrollSpy.ClassName.ACTIVE)

    let activateEvent = Util.createEvent(ScrollSpy.Event.ACTIVATE, {relatedTarget: target})
    this.scrollElement.dispatchEvent(activateEvent)
  }

  clear() {
    let active = this.target.querySelector(ScrollSpy.Selector.ACTIVE)
    if (active) {
      active.classList.remove(ScrollSpy.ClassName.ACTIVE)
      if (active.classList.contains(ScrollSpy.ClassName.NAV_LINK) || active.classList.contains(ScrollSpy.ClassName.DROPDOWN_ITEM)) {
        let items = active.parentAll(ScrollSpy.Selector.SHOW, this.config.target)
        if (items.length) {
          items.forEach((item) => {
            item.classList.remove(ScrollSpy.ClassName.SHOW)
          })
        }
      }
    }
  }

  static init(element, options) {
    let scrollspy = null

    if (element.hasOwnProperty(ScrollSpy.KEY)) {
      scrollspy = element[ScrollSpy.KEY]
    }

    if (!scrollspy) {
      let config = typeof options === 'object' && options
      scrollspy = new ScrollSpy(element, config)
      element[ScrollSpy.KEY] = scrollspy
    }

    return scrollspy
  }
}

function scrollSpy(element, config) {
  return ScrollSpy.init(element, config)
}

if (typeof SCROLLSPY_EVENT_OFF === 'undefined' || SCROLLSPY_EVENT_OFF === true) {
  document.addEventListener('DOMContentLoaded', function () {
    window.addEventListener('load', () => {
      let scrollSpys = document.querySelectorAll(ScrollSpy.Selector.DATA_SPY)
      if (scrollSpys.length) {
        scrollSpys.forEach((element) => {
          scrollSpy(element, element.dataset)
        })
      }
    })
  })
}
