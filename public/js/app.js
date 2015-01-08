;'use strict';



var $header;
var set = false;

$(document).ready(function() {

	$header = $("header");
	$(window).scroll(function () {
       var scroll = $(window).scrollTop();
       
       if (scroll > (window.innerHeight - 65) && !set) {
	       $header.addClass('fixed');
	       $(".about").css('margin-top', '100vh');
				 set = true;
       } else if (scroll < (window.innerHeight - 65) && set) {
	       $header.removeClass('fixed');
		     $(".about").css('margin-top', '0');
		     set = false;
       }
	});	
});


function scrollTo(location) {


};

function toggleHeader() {
	if ($header.hasClass('atTop')) {
		$header.addClass('scrolled');
		$header.removeClass('atTop');
	} else if ($header.hasClass('scrolled')) {
		$header.addClass('atTop');
		$header.removeClass('scrolled');
	};
};