jQuery(document).ready(function ($) {
  var gt_ios8 = false;
  // 判断是否 iOS设备
  if ((navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i))) {
    // 判断系统版本号是否大于 8
    if (navigator.userAgent.match(/OS [8-9]_\d[_\d]* like Mac OS X/i)) {
      gt_ios8 = true;
      $("body").addClass("ios8");
    }
  }

  // !- Skills
  $.fn.animateSkills = function () {
    $(".skill-value", this).each(function () {
      var $this = $(this),
        $this_data = $this.data("width");

      $this.css({
        width: $this_data + '%'
      });
    });
  };

  // !- Animation "onScroll" loop
  function doAnimation() {
    var j = -1;
    $(".anim_emt:not(.start-animation):in-viewport").each(function () {
      var $this = $(this);

      if (!$this.hasClass("start-animation") && !$this.hasClass("animation-triggered")) {
        $this.addClass("animation-triggered");
        j++;
        setTimeout(function () {
          $this.addClass("start-animation");
          if ($this.hasClass("skills")) {
            $this.animateSkills();
          };
        }, 200 * j);
      };
    });
  };

  // !- Fire animation
  if ($("html").hasClass("no-touch") && $("html").hasClass("cssanimations")) {
    doAnimation();
    $(window).on("scroll", function () {
      doAnimation();
    });
  };

});