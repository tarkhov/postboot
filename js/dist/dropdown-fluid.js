'use strict';

document.addEventListener('DOMContentLoaded', function () {
  var menus = document.querySelectorAll('.dropdown-fluid .dropdown-menu');
  if (menus.length) {
    menus.forEach(function (element) {
      element.addEventListener('click', function (e) {
        e.stopPropagation();
      });
    });
  }
});
