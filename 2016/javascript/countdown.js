$(document).ready(function() {
	"use strict";

	// NOTE: this is the UTC time of the event!
	var hackingStarts = moment("2016-11-20 11:00:00-04:00");
	var timeUntilStart = hackingStarts.diff(moment(), 'seconds');

	var clock = $('.countdown').FlipClock(timeUntilStart, {
		clockFace: 'DailyCounter',
		countdown: true,
		showSeconds: true,
		autostart: true
	});
});
