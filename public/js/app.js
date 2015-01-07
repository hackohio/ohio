;'use strict';



var $header;

$(document).ready(function() {

	$header = $("header");
	$(window).scroll(function(event) {
		/* Act on the event */
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