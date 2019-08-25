var hackingStarts = "2019-11-02T10:00:00-04:00";
initializeClock('countdown', hackingStarts);

function getTimeRemaining(endTime){
  var t = Date.parse(endTime) - Date.parse(new Date());
  var seconds = Math.floor( (t/1000) % 60 );
  var minutes = Math.floor( (t/1000/60) % 60 );
  var hours = Math.floor( (t/(1000*60*60)) % 24 );
  var days = Math.floor( t/(1000*60*60*24) );
  return {
    'total': t,
    'days': days,
    'hours': hours,
    'minutes': minutes,
    'seconds': seconds
  };
}

function initializeClock(id, endTime){
    var clock = document.getElementById(id);
    clock.innerHTML = '<div><span class="days time"></span><div class="time-label">days</div></div>'
        + '<div><span class="hours time"></span><div class="time-label">hours</div></div>'
        + '<div><span class="minutes time"></span><div class="time-label">minutes</div></div>'
        + '<div><span class="seconds time"></span><div class="time-label">seconds</div></div>';

    var daysSpan = clock.querySelector('.days');
    var hoursSpan = clock.querySelector('.hours');
    var minutesSpan = clock.querySelector('.minutes');
    var secondsSpan = clock.querySelector('.seconds');

    function updateClock(){
        var t = getTimeRemaining(endTime);
        daysSpan.innerHTML = t.days;
        hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
        minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
        secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);
        if(t.total<=0){
            clearInterval(timeInterval);
        }
    }

    updateClock(); // run function once at first to avoid delay
    var timeInterval = setInterval(updateClock,1000);
}

