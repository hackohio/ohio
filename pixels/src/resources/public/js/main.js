(function (window) {
    "use strict";
    let $ = window.jQuery;
    let createjs = window.createjs;
    let toastr = window.toastr;

    let stage, canvas, refreshData;
    let colors = Config.CANVAS_COLORS;
    let zoom = Config.CANVAS_INITIAL_ZOOM;
    let gridSocket = new GridSocket(Config.GRID_SERVER);
    let isPlacingPixel = false;
    let userShape = new createjs.Shape();
    let selectedColorIdx = 0;

    let pixels = new Array(Config.CANVAS_WIDTH);
    for (let i = 0; i < Config.CANVAS_WIDTH; i++) {
        pixels[i] = Array(Config.CANVAS_HEIGHT);
    }

    gridSocket.setCanvasRefreshHandler(function (pixelData) {
        if (!canvas) {
            refreshData = pixelData;
            return;
        }
        for (let x = 0; x < Config.CANVAS_WIDTH; x++) {
            for (let y = 0; y < Config.CANVAS_HEIGHT; y++) {
                let colorID = pixelData[x + y * Config.CANVAS_WIDTH];
                pixels[x][y]["shape"].graphics.beginFill(colors[colorID]).drawRect(x, y, 1, 1);
                pixels[x][y]["color"] = colorID;
            }
        }
        stage.update();
    });

    gridSocket.setMessageHandler(function (data) {

        switch (data.action) {
            case "updatePixel":
                if (!canvas) return;
                pixels[data.x][data.y]["shape"].graphics.beginFill(data.colorIdx).drawRect(data.x, data.y, 1, 1);
                data["shape"] = pixels[data.x][data.y]["shape"];
                pixels[data.x][data.y] = data;
                stage.update();
                break;

            case "timer":
                if (data.type === "toofast")
                    toastr["warning"]("Try again in a little bit", "You're drawing too fast!", {
                        "progressBar": true,
                        "timeOut": data.time
                    });
                break;

            default:
                console.log("Unknown action:", data.action);
                break;
        }

    });

    console.log("Connecting to ", gridSocket.server);
    gridSocket.connect();


    function beginPlacingPixel(colorIdx = 0) {
        selectedColorIdx = colorIdx;
        let p = canvas.globalToLocal(stage.mouseX, stage.mouseY);
        userShape.graphics.clear().beginFill(colors[selectedColorIdx]).drawRect(0, 0, 1, 1);
        userShape.x = Math.floor(p.x);
        userShape.y = Math.floor(p.y);
        userShape.visible = true;
        isPlacingPixel = true;
        $(screen.canvas).trigger("mousemove");
        stage.update();
    }

    /* Disable pixel selector, update canvas, and send data to server */
    function endPlacingPixel(x, y) {
        if (x >= 0 && y >= 0 && x < Config.CANVAS_WIDTH && y < Config.CANVAS_HEIGHT) {
            pixels[x][y]["shape"].graphics.beginFill(colors[selectedColorIdx]).drawRect(x, y, 1, 1);
            gridSocket.sendPixel(x, y, selectedColorIdx);
        }
        userShape.visible = false;
        isPlacingPixel = false;
        stage.update();
    }

    $(document).ready(function () {

        console.log("Initializing EaselJS Stage");
        stage = new createjs.Stage(Config.CANVAS_ELEMENT_ID);

        let context = stage.canvas.getContext("2d");
        context.webkitImageSmoothingEnabled = context.mozImageSmoothingEnabled = false;

        canvas = new createjs.Container();
        canvas.scaleX = canvas.scaleY = zoom;

        for (let x = 0; x < Config.CANVAS_WIDTH; x++) {
            for (let y = 0; y < Config.CANVAS_HEIGHT; y++) {
                let shape = new createjs.Shape();
                canvas.addChild(shape);
                pixels[x][y] = {"color": 0, "shape": shape};
            }
        }

        if (refreshData) {
            gridSocket.refreshCallback(refreshData);
        }

        canvas.addChild(userShape);
        stage.addChild(canvas);

        $(window).trigger("resize");
        canvas.x = (window.innerWidth - (zoom * Config.CANVAS_WIDTH)) / 2;
        canvas.y = (window.innerHeight - (zoom * Config.CANVAS_HEIGHT)) / 2;

        stage.update();
        console.log("Canvas Initialization done.");

        $('#sidebarCollapse').on('click', function () {
            $('#sidebar').toggleClass('active');
        });

        $('#red').on('click', function () {
            beginPlacingPixel(1);
        });

        $('#orange').on('click', function () {
            beginPlacingPixel(2);
        });

        $('#yellow').on('click', function () {
            beginPlacingPixel(3);
        });

        $('#green').on('click', function () {
            beginPlacingPixel(4);
        });

        $('#blue').on('click', function () {
            beginPlacingPixel(5);
        });

        $('#purple').on('click', function () {
            beginPlacingPixel(6);
        });

        $('#magenta').on('click', function () {
            beginPlacingPixel(7);
        });

        $('#white').on('click', function () {
            beginPlacingPixel(8);
        });

        $('#black').on('click', function () {
            beginPlacingPixel(9);
        });

        /* User selects the pixel to paint (if selector is active) */
        stage.addEventListener("click", function (e) {
            if (isPlacingPixel) {
                let p = canvas.globalToLocal(e.rawX, e.rawY);
                endPlacingPixel(Math.floor(p.x), Math.floor(p.y));
            }
        });

        /* While the selector is active, move it to the pixel over the cursor */
        stage.on("stagemousemove", function (e) {
            if (isPlacingPixel) {
                let p = canvas.globalToLocal(e.rawX, e.rawY);
                userShape.x = Math.floor(p.x);
                userShape.y = Math.floor(p.y);
                stage.update();
            }
        });

        Config.onload();
    });

    // zoom functionality
    $(window).on("mousewheel", function (e) {
        e.preventDefault();
        if (e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0) {
            zoom += 1;
        } else {
            zoom -= 1;
        }
        zoom = Math.min(Math.max(zoom, Config.CANVAS_MIN_ZOOM), Config.CANVAS_MAX_ZOOM);
        console.log(zoom);
        // zoom in/out to cursor position
        let centerX = stage.mouseX;
        let centerY = stage.mouseY;

        let local = canvas.globalToLocal(centerX, centerY);
        canvas.regX = local.x;
        canvas.regY = local.y;
        canvas.x = centerX;
        canvas.y = centerY;
        canvas.scaleX = canvas.scaleY = zoom;
        stage.update();
    });



    $(window).on("resize", function (e) {
        // canvas MUST always be a square, otherwise it will get distorted
        stage.canvas.width = stage.canvas.height = Math.max(window.innerHeight, window.innerWidth);
        stage.update();
    });

    Config.gridSocket = gridSocket;
    Config.beginPlacingPixel = beginPlacingPixel;
    Config.endPlacingPixel = endPlacingPixel;
    window.Config = Config;
})(window);
