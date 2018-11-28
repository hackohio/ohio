var tag = document.createElement('script');
tag.src = 'https://www.youtube.com/player_api';

var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var tv, playerDefaults = {
  autoplay: 0,
  autohide: 1,
  modestbranding: 0,
  rel: 0,
  showinfo: 0,
  controls: 0,
  disablekb: 1,
  enablejsapi: 0,
  iv_load_policy: 3
};

var vid = { 'videoId': 'CMHpWSEIsVs', 'startSeconds': 0, 'suggestedQuality': 'hd720' };

$('.hi em:last-of-type').html(vid.length);

function onYouTubePlayerAPIReady() {
  tv = new YT.Player('tv', {
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    },
    playerVars: playerDefaults
  });
}

function onPlayerReady() {
  tv.loadVideoById(vid);
  tv.mute();
}

function onPlayerStateChange(e) {
  if (e.data === 1) {
    $('#tv').addClass('active');
    $('.hi em:nth-of-type(2)').html(vid + 1);
  } else if (e.data === 2) {
    $('#tv').removeClass('active');

    tv.loadVideoById(vid);
    tv.seekTo(vid.startSeconds);
  }
}

function vidRescale() {
  var w = $(window).width() + 200,
  h = $(window).height() + 200;

  if (w/h > 16/9) {
    tv.setSize(w, w / 16 * 9);
    $('.tv .screen').css({'left': '0px'});
  } else {
    tv.setSize(h / 9 * 16, h);
    $('.tv .screen').css({ 'left': -($('.tv .screen').outerWidth() - w) / 2 });
  }
}

$(window).on('load resize', vidRescale);