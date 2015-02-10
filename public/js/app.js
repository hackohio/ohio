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

	addScrollClicks();

	$header = $("header");
	$intro = $(".intro");
	$input = $(".maillist-input");
	$firstSection = $("section:first-of-type");
	$label = $(".maillist-label");
	$emailLabel = $("#email-label");
	$label = $(".maillist-label");

	var $about = $(".about");

	$("#mail-link").click(function(event) {
		event.preventDefault();
		$input.focus();
	});

	$input.focus(function(event) {
		$label.addClass('maillist-label-full');
		$label.removeClass('maillist-label-empty');
		$label.click(function(event) {
			addToMailList();
		});
	});

	$input.blur(function(event) {
		
		if (! $input.val().length) {
			$label.addClass('maillist-label-empty');
			$label.removeClass('maillist-label-full');
		}

	});

	$("#hb").click(function(event) {
		event.preventDefault();

		if ($header.hasClass('header-open')) {

		} else {
			$.scrollTo($(".about"), 500);
			$("li").addClass('hb-open');
			$header.addClass('header-open');
		}
	
	});

	$("#sendit").click(function(event) {
		event.preventDefault();
		sendEmail(this);
	});

	$("#email").focus(function(event) {
		$emailLabel.removeClass('invalid');
	});

	$("#email").blur(function(event) {
		if (!itBeAGoodEmail($(this).val())) {
			$emailLabel.addClass('invalid');
		} else {
			$emailLabel.removeClass('invalid');
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

function addScrollClicks() {
	$("#contact-link").click(function(event) {
		event.preventDefault();
		closeHeader();
		$.scrollTo($(".contact"), 500);
	});

	$("#about-link").click(function(event) {
		event.preventDefault();
		closeHeader();
		$(window).scrollTo($(".about"), 500);
	});

	$("#events-link").click(function(event) {
		event.preventDefault();
		closeHeader();
		$(window).scrollTo($(".events"), 500);
	});	

	$("#stats-link").click(function(event) {
		event.preventDefault();
		closeHeader();
		$(window).scrollTo($(".stats"), 500);
	});		
}

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

function sendEmail(button) {
	var email = $("#email").val();
	var subject = $("#subject").val();
	var message = $("#message").val();
	
	if (!itBeAGoodEmail(email)) {
		return;
	}

	// post the email 
	$.post('/contact', 
	{
		email: email,
		subject: subject,
		content: message
	}, function(data, textStatus, xhr) {
		console.log("sent");
		emailSuccess(button)
	});

}

function itBeAGoodEmail(email) {
	console.log(email);
	var emailRegex = /[a-zA-Z0-9.+%-]+[@][a-zA-Z0-9.+%-]+[.][A-Za-z]+/
	return email.match(emailRegex);
}

function emailSuccess(button) {
	$(button).html("Sent!");
	$(button).unbind('click');
}

function addToMailList() {
	if (itBeAGoodEmail($input.val())) {
		$.post('/subscribe', {email: $input.val()}, function(data, textStatus, xhr) {
			$label.html("We'll keep you updated");
			$label.addClass('maillist-label-empty');
			$label.removeClass('maillist-label-full');
			$input.val('');

			setTimeout(function() {
				$label.html("Get on the mailing list");
			}, 4000);

		});
	}
}

function closeHeader() {
	$header.removeClass('header-open');
	$("li").removeClass('hb-open');
}