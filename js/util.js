// https://developer.mozilla.org/ru/docs/Web/API/Element/closest#Specification
(function (e) {
 e.closest = e.closest || function (css) {
   let node = this
  
   while (node) {
      if (node.matches(css)) {
        return node
      } else {
        node = node.parentElement
      }
   }

   return null
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
}
