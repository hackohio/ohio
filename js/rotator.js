$(document).ready(function(){
  var rotators = $('.rotator');
  var length = rotators.length;
  var index = 0;
  var rb = $('.rotate-box');

  var mt = $('.master-title');
  var mtw = mt.width();

  var rotate = function() {
    var c = rotators.get(index);
    index++;
    if (index == length) { index = 0; }
    
    var r = rotators.get(index);
    var width = mtw + $(r).width();    
    mt.width(width + "px");

    $(r).children().each(function(l, child) {
      setTimeout(function() {
        $(child).addClass('fly-in').removeClass('fly-out');
      }, 20 + (30 * l));
    });
    
    $(c).children().each(function(l, child) {
      setTimeout(function() {
        $(child).addClass('fly-out').removeClass('fly-in');
      }, 20 + (30 * l));
    });
  }

  explode(rotators);
  setInterval(rotate, 3000);

  function explode(objs) {
    objs.each(function(index, obj) {
      var text = $(obj).html();
      var a = text.split('');
      for (var i = 0; i < a.length; i++) {
        a[i] = "<span class='rotate-element'>" + a[i] + "</span>";
      }
      $(obj).html(a.join(''));
    });
  }
});
