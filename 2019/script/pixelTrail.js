$(document).ready(function() {
    // On render
    var stats = generateGrid();

    // delete and readd triggers on window resize
    $(window).resize( function() {
        $('.grid-item').remove();
        $('#grid').remove();

        var stats = generateGrid();
    });

    // generates outer grid div
    function generateGrid(){
        var width = getItemWidth();
        var pixels = getPixelAmount(width);
        var col = Math.floor(window.innerWidth/width);

        $("body").prepend('<div id="grid"></div>');
        for(var i = 0; i < pixels; i++){
            $("#grid").append('<div class="grid-item" id="_' + i + '"></div>');
        }

        var widthpx = width + 'px';
        $('.grid-item').css({'width': widthpx, 'height': widthpx});

        // returns number of columns and total pixels
        return [col, pixels];
    }

    function getItemWidth() {
        // Get column size between 30-45 where whitespace is the smallest
        var diff = window.innerWidth;
        var width = window.innerWidth;
        for(var i = 40; i < 51; i++){
            var temp = window.innerWidth % i;
            if(temp < diff) {
                diff = temp
                width = i;
            }
        }

        return width;
    }

    function getPixelAmount(w) {
        return (window.innerHeight/w + 1) * window.innerWidth/w;
    }

});
