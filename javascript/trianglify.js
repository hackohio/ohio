var pattern = Trianglify({
	cell_size: 100,
	x_colors: ["#B00126", "#FDF2F3", "#B00126"],
	y_colors: 'match_x',
	width: window.innerWidth,
	height: 1130
});
var canvas = document.getElementById("headerCanvas");
pattern.canvas(canvas);

// Detect desktop browser resize; re-draw canvas when detected
jQuery(function($){
	var windowWidth = $(window).width();
	$(window).resize(function() {
		if(windowWidth != $(window).width()){
			location.reload();
			return;
		}
	});
});

(function($) {
	$(function() {
			$("#scroller").simplyScroll();
	});
 })(jQuery);