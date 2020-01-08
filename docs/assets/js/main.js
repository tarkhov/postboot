jQuery(document).ready(function ($) {
  setTimeout(function () {
    $.get('content.html', function (data) {
      $('.spinner').remove();
      $('.content').html(data);
      Prism.highlightAll();
      $('.collapse-content').collapse('show');
    });
  }, 2000);
});
