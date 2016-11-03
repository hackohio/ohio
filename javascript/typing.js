var captionLength = 0;
var wordNumber = 0;
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
    setInterval ('cursorAnimation()', 600);
    captionEl = $('#caption');
    caption = words[0];
    setInterval ( function(){
        typeWord();
        setTimeout('eraseText()', 1800);
    }, 3000);
});

function typeWord(){
    caption = words[wordNumber % words.length];
    wordNumber++;
    type();
}
function type() {
    captionEl.html(caption.substr(0, captionLength++));
    if(captionLength < caption.length+1) {
        setTimeout('type()', 50);
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
        setTimeout('erase()', 50);
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