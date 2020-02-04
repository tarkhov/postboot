jQuery(document).ready(function ($) {
  setTimeout(function () {
    $.ajax({
      url: 'content.html',
      cache: false,
      success: function (data) {
        $('.spinner').remove();
        $('.content').html(data);
        Prism.highlightAll();
        $('.collapse-content').collapse('show');
      }
    });
  }, 2000);
});
