(function ($) {
  $(window).on('activate.bs.scrollspy', function (event, obj) {
    var target = obj.relatedTarget;
    var selector = '[href="' + target + '"], [data-target="' + target + '"]';

    $('[data-spy="scroll"]').each(function () {
      var spyTarget = $(this).attr('data-target');
      var $spyTarget = $(spyTarget);
      var $item = $spyTarget.find(selector);
      if ($item) {
        $spyTarget.find('.show').removeClass('show');
        $item.parents('.nav-item').addClass('show');
      }
    });
  });
})(jQuery);
