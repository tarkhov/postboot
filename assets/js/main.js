jQuery(document).ready(function ($) {
  $(window).on('activate.bs.scrollspy', function (e, r) {
    var $sidebar = $('#sidebar');

    $sidebar.find('.nav-item.active, .nav-item .nav .nav-link.active:not([href="' + r.relatedTarget + '"])')
      .removeClass('active');
    $sidebar.find('.nav-link[href="' + r.relatedTarget + '"]')
      .parents('.nav-item')
      .addClass('active');
  });
});

document.addEventListener('DOMContentLoaded', function () {
  dropdownHover(document.querySelectorAll(DROPDOWN_DATA_HOVER));
});
