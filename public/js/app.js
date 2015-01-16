;'use strict';
var $header;
var set = false;
var $intro;
var $firstSection;

var words = [
	"awesome",
	"wonderful",
	"innovative",
	"complex",
	"so fancy",
"shiny",
	"amazing",
	"Powerful",
	"brand new",
	"efficient",
	"exciting"
];

$(document).ready(function() {

	var intervalID = replaceText(words);

	$header = $("header");
	$intro = $(".intro");
	$input = $(".maillist-input");
	$firstSection = $("section:first-of-type");

	var $about = $(".about");

	$input.focus(function(event) {
		var $label = $(".maillist-label");
		$label.addClass('maillist-label-full');
		$label.removeClass('maillist-label-empty');
		$label.click(function(event) {
			addToMailingList();
		});
	});

	$input.blur(function(event) {
		var $label = $(".maillist-label");
		if (! $input.val().length) {
			$label.addClass('maillist-label-empty');
			$label.removeClass('maillist-label-full');
		}

	});


	$(window).scroll(function () {
     var scroll = $(window).scrollTop();     
     if (scroll > (window.innerHeight - 65) && !set) {
       $header.addClass('fixed');
       $firstSection.css('margin-top', '65');
			 set = true;
     } else if (scroll < (window.innerHeight - 65) && set) {
       $header.removeClass('fixed');
       $firstSection.css('margin-top', '0');
     set = false;
     }
	});	
});


function replaceText(words) {
	var $slot = $(".slot-visible");
		
	words.forEach(function(element, index){
		var string = "<span class=\"slot slot-hidden\">" + words[index] +"</span>";
		$slot.after(string);
	});

	function updateText() {
		var $afterSlot = $(".slot-visible + .slot-hidden:first");
		$afterSlot.removeClass('slot-hidden');
		$slot.removeClass('slot-visible');
		$afterSlot.addClass('slot-visible');
		$slot.addClass('slot-hidden');
		$slot = $(".slot-visible");

		if (! $slot.length) {
			$slot = $(".slot-hidden:first");
			$slot.removeClass('slot-hidden')
			$slot.addClass('slot-visible');
		}
	};

	return setInterval(updateText, 2000);
}

function addToMailingList() {
	email = $(".maillist-input").val();
	console.log(email);
	// post 

}

function emailSuccess() {
	$label = $(".maillist-label-full");
	$label.html("EmailSent");
}