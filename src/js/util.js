// https://developer.mozilla.org/ru/docs/Web/API/Element/closest#Specification
(function (e) {
  e.closest = e.closest || function (selector) {
    let node = this

    while (node) {
      if (node.matches(selector)) {
        return node
      } else {
        node = node.parentElement
      }
    }

    return null
  }

  e.offset = function () {
    let box = this.getBoundingClientRect();

    return {
      top: box.top + window.pageYOffset - document.documentElement.clientTop,
      left: box.left + window.pageXOffset - document.documentElement.clientLeft
    }
  }

  e.position = function () {
    return {
      left: this.offsetLeft,
      top: this.offsetTop
    }
  }
})(Element.prototype)


const ESCAPE_KEYCODE = 27 // KeyboardEvent.which value for Escape (Esc) key


class Util {
  static createEvent(type, detail) {
    let event
    if (window.CustomEvent) {
      event = new CustomEvent(type, {detail: detail})
    } else {
      event = document.createEvent('CustomEvent')
      event.initCustomEvent(type, true, true, detail)
    }

    return event
  }

  static getSelector(element) {
    let selector
    if (element.hasAttribute('data-target')) {
      selector = element.getAttribute('data-target')
    }

    if (!selector && element.hasAttribute('href')) {
      selector = element.getAttribute('href')
    }

    return (selector && selector !== '#') ? selector : null
  }

  static toType(obj) {
    return {}.toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
  }

  static isElement(obj) {
    return (obj[0] || obj).nodeType
  }

  static getUID(prefix) {
    do {
      // eslint-disable-next-line no-bitwise
      prefix += ~~(Math.random() * MAX_UID) // "~~" acts like a faster Math.floor() here
    } while (document.getElementById(prefix))
    return prefix
  }

  static typeCheckConfig(componentName, config, configTypes) {
    for (const property in configTypes) {
      if (configTypes.hasOwnProperty(property)) {
        const expectedTypes = configTypes[property]
        const value         = config[property]
        const valueType     = value && Util.isElement(value) ?
                              'element' : Util.toType(value)

        if (!new RegExp(expectedTypes).test(valueType)) {
          throw new Error(
            `${componentName.toUpperCase()}: ` +
            `Option "${property}" provided type "${valueType}" ` +
            `but expected type "${expectedTypes}".`)
        }
      }
    }
  }
}
