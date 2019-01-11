(function (window) {
    "use strict";

    // Pixel Settings
    window.Config = {
        GRID_SERVER: location.origin.replace(/^http/, 'ws'),
        CANVAS_WIDTH: 100, // The width and height must be the same as the values set for the server
        CANVAS_HEIGHT: 100,
        CANVAS_INITIAL_ZOOM: 30,
        CANVAS_MIN_ZOOM: 20,
        CANVAS_MAX_ZOOM: 40,
        CANVAS_COLORS: ["#cccccc", "red", "orange", "yellow", "green", "blue", "purple", "magenta", "white", "black"],
        CANVAS_ELEMENT_ID: "gridDisplay",
        TIME_BETWEEN_PIXELS: 60,

        onload: function () {
            toastr["info"]('Select a color by tapping the button!', "Instructions");
            setTimeout(function () {
                toastr["info"]("Keep in mind, you have a 30 second delay between each pixel you draw");
            }, 4000);
        }
    };

    // toastr Notifications
    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-bottom-center",
        "preventDuplicates": true,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "100",
        "timeOut": "3500",
        "extendedTimeOut": "100",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };

})(window);