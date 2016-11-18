// Derived from code by Stathis
// https://codepen.io/stathisg/pen/Bkvhg

var captionLength = 0;
var wordNumber = 1;
var caption = '';
var words = [
"amazing", 
"beautiful",
"efficient",
"wonderful",
"fantastic",
"stellar",
"powerful",
"extraordinary",
"advanced"
]

$(document).ready(function() {
    setInterval ('cursorAnimation()', 800);
    captionEl = $('#caption');
    caption = words[0];
    setTimeout('eraseText()', 2400)
    setInterval ( function(){
        typeWord();
        setTimeout('eraseText()', 2400);
    }, 3000);
});

function typeWord(){
    caption = words[wordNumber % words.length];
    captionEl.html('');
    wordNumber++;
    type();
}
function type() {
    captionEl.html(caption.substr(0, captionLength++));
    if(captionLength < caption.length+1) {
        setTimeout('type()', 75);
    } else {
        captionLength = 0;
        caption = '';
    }
}

function eraseText() {
    caption = captionEl.html();
    captionLength = caption.length;
    erase();
}

function erase() {
    captionEl.html(caption.substr(0, captionLength--));
    if(captionLength >= 0) {
        setTimeout('erase()', 40);
    } else {
        captionLength = 0;
        caption = '';
    }	
}

function cursorAnimation() {
    $('#cursor').animate({
        opacity: 0
    }, 'fast', 'swing').animate({
        opacity: 1
    }, 'fast', 'swing');
}
