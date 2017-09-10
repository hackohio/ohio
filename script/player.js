var tag = document.createElement('script');
tag.src = 'https://www.youtube.com/iframe_api';

var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var playerDefaults = {
  modestbranding: 1,
  rel: 0,
  showinfo: 0,
  controls: 0,
  disablekb: 1,
  enablejsapi: 1,
  iv_load_policy: 3,
  playsinline: 1,
  loop: 1,
};

var tv;
function onYouTubePlayerAPIReady() {
  tv = new YT.Player('tv', {
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange,
      'onError': onPlayerError
    },
    playerVars: playerDefaults,
    videoId: 'CMHpWSEIsVs'
  });
}

function onPlayerReady() {
  tv.mute();
  tv.playVideo();
}

function onPlayerStateChange(e) {
  if (e.data === 1) {
    $('#tv').addClass('active');
  } else {
    $('#tv').removeClass('active');
    tv.playVideo();
  }
}

function onPlayerError(e) {

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
