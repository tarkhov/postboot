const DROPDOWN_DATA_KEY   = 'bs.dropdown';
const DROPDOWN_SHOW       = 'show';
const DROPDOWN_DISABLED   = 'disabled';
const DROPDOWN_HOVER      = '.dropdown-hover';
const DROPDOWN_DATA_HOVER = '[data-hover="dropdown"]';

class DropdownHover {
  constructor(element) {
    // https://tutor.mantrajs.com/say-hello-to-ES2015/stop-self-this
    let parent = DropdownHover.getParent(element);

    element.addEventListener('mouseenter', this.show);
    parent.addEventListener('mouseleave', this.hide);
  }

  show(e) {
    if (this.disabled || this.classList.contains(DROPDOWN_DISABLED)) {
      return;
    }

    let parent = DropdownHover.getParent(this);

    DropdownHover.clearMenus(e);

    if (!parent.classList.contains(DROPDOWN_SHOW)) {
      parent.classList.add(DROPDOWN_SHOW);
    }
  }

  hide(e) {
    if (this.classList.contains(DROPDOWN_SHOW)) {
      this.classList.remove(DROPDOWN_SHOW);
    }
  }

  static clearMenus(event) {
    let toggles = document.querySelectorAll(DROPDOWN_DATA_HOVER);
    if (toggles.length) {
      toggles.forEach(function (toggle, i) {
        let parent = DropdownHover.getParent(toggle);
        if (!parent.classList.contains(DROPDOWN_SHOW)) {
          return true;
        }

        toggle.setAttribute('aria-expanded', 'false');

        parent.classList.remove(DROPDOWN_SHOW);
      });
    }
  }

  static getParent(element) {
    let selector;
    if (element.hasAttribute('data-target')) {
      selector = element.getAttribute('data-target');
    }

    if (!selector && element.hasAttribute('href')) {
      selector = element.getAttribute('href');
    }

    let parent;
    if (selector && /#[A-Za-z]/.test(selector)) {
      parent = document.querySelector(selector);
    } else {
      parent = element.parentNode;
    }

    return parent;
  }
}

function dropdownHover(elements, option) {
  elements.forEach(function (element) {
    let data;
    if (element.hasAttribute(DROPDOWN_DATA_KEY)) {
      data = element.getAttribute(DROPDOWN_DATA_KEY);
    }

    if (!data) {
      data = new DropdownHover(element);
      element.setAttribute(DROPDOWN_DATA_KEY, data);
    }

    if (typeof option === 'string') {
        if (data[option] === undefined) {
          throw new Error(`No method named "${option}"`);
        }

        data[option].call(element);
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  let dataHovers = document.querySelectorAll(DROPDOWN_DATA_HOVER);
  if (dataHovers.length) {
    dataHovers.forEach(function (element) {
      element.addEventListener('mouseenter', DropdownHover.prototype.show);
    });
  }

  let hovers = document.querySelectorAll(DROPDOWN_HOVER);
  if (hovers.length) {
    hovers.forEach(function (element) {
      element.addEventListener('mouseleave', DropdownHover.prototype.hide);
    });
  }

  let menus = document.querySelectorAll('.dropdown-static .dropdown-menu');
  if (menus.length) {
    menus.forEach(function (element) {
      element.addEventListener('click', function (e) {
        e.stopPropagation();
      });
    });
  }
});
