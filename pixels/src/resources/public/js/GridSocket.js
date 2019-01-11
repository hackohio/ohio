(function (window) {
    "use strict";

    function GridSocket(server, autoconnect = false) {
        this.server = server;
        this.expectedRefreshSize = null;
        if (autoconnect) this.connect();
    }

    GridSocket.prototype.connect = function () {
        this.socket = new WebSocket(this.server);
        this.socket.binaryType = "arraybuffer";

        this.socket.onmessage = function (event) {

            if (event.data.byteLength && event.data.byteLength === this.expectedRefreshSize) {

                if (this.refreshCallback)
                    this.refreshCallback(new Uint8Array(event.data));
                else
                    console.log("No refresh callback specified.");

            } else if (this.messageHandler) {
                let received;
                try {
                    received = JSON.parse(event.data);
                } catch (e) {
                    return;
                }
                if (!received || !received.action) {
                    console.log("ERROR: Received poorly formatted or unknown command from server", data);
                    return;
                }

                if (received.action === 'canvasInfo') {
                    this.expectedRefreshSize = received.width * received.height;
                    return;
                }

                this.messageHandler(received);
            }

        }.bind(this);

        this.socket.onclose = function (event) {
            console.log("GridSocket closed");
            if (this.onclose) this.onclose(event);
        }.bind(this);

        this.socket.onerror = function (event) {
            console.log("GridSocket websocket error", event.data);
            if (this.onerror) this.onerror(event);
        }.bind(this);

        this.socket.onopen = function (event) {
            console.log("GridSocket opened");
            if (this.onopen) this.onopen(event);
            this.requestRefresh();

            setInterval(function () {
                this.socket.send('{"action":"ping"}');
            }, 15000);
        }.bind(this);
    };

    GridSocket.prototype.sendPixel = function (x, y, colorID) {
        this.socket.send(JSON.stringify({"action": "paint", x, y, colorIdx: colorIdx}));
    };

    GridSocket.prototype.getPixel = function (x, y) {
        this.socket.send(JSON.stringify({"action": "getPixel", x, y}));
    };

    GridSocket.prototype.setMessageHandler = function (callback) {
        this.messageHandler = callback;
    };

    GridSocket.prototype.setCanvasRefreshHandler = function (callback) {
        this.refreshCallback = callback;
    };

    GridSocket.prototype.requestRefresh = function () {
        this.socket.send("refreshPixels");
    };

    window.GridSocket = GridSocket;
})(window);