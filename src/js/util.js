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

  e.parent = function (selector) {
    let node = this.parentElement

    while (node) {
      if (node.matches(selector)) {
        return node
      } else {
        node = node.parentElement
      }
    }

    return null
  }

  e.parentAll = function (selector, until) {
    let node = this.parentElement
    let nodes = []

    while (node) {
      if (until && node.matches(until)) {
        return nodes
      }

      if (node.matches(selector)) {
        nodes.push(node)
      }

      node = node.parentElement
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

  static getParentSelector(element) {
    let selector = null

    if (element.hasAttribute('data-parent')) {
      selector = element.getAttribute('data-parent')
    }

    return selector
  }
}
