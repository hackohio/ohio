import http from "http";

import express from "express";

import MongoClient from "mongodb";

import WebSocket from "ws";

const PORT = process.env.PORT || 3001;

const MONGODB_URI = process.env.MONGODB_URI || null;

const CANVAS_WIDTH = process.env.CANVAS_WIDTH;
const CANVAS_HEIGHT = process.env.CANVAS_HEIGHT;

const TIME_BETWEEN_PIXELS = process.env.TIME_BETWEEN_PIXELS;

let app = express();
app.use(express.static(__dirname + "/public/"));

let server = http.createServer(app);
server.listen(PORT);

let WebSocketServer = WebSocket.Server;

let timestamps = {};

let pixels = new Array(CANVAS_WIDTH);
for (let i = 0; i < CANVAS_WIDTH; i++) {
    pixels[i] = Array(CANVAS_HEIGHT);
}

function resetPixelArray() {
    for (let x = 0; x < CANVAS_WIDTH; x++) {
        for (let y = 0; y < CANVAS_HEIGHT; y++) {
            pixels[x][y] = {x, y, colorIdx: 0};
        }
    }
}

console.log("Grid Display Server Initializing");

let mongoclient, pixelCollection;
resetPixelArray();

if (MONGODB_URI) {
    MongoClient.connect(MONGODB_URI, function (err, db) {
        mongoclient = db;
        pixelCollection = mongoclient.collection("pixels");
        if (pixelCollection) {
            let dbPixels = pixelCollection.find().toArray(function (err, dbPixels) {
                for (let i = 0; i < dbPixels.length; i++)
                    pixels[dbPixels[i].x][dbPixels[i].y].colorIdx = dbPixels[i].colorIdx;

                console.log("Loaded", dbPixels.length, "pixels from MongoDB");
            });
        } else {
            mongoclient.createCollection("pixels");
            console.log("Creating MongoDB collection");
        }
    });
} else {
    console.log("No MongoDB connection, all pixels will be stored in RAM");
}

let ws = new WebSocketServer({server});

ws.on("connection", function (socket) {
    let remoteIP = socket._socket.remoteAddress;

    let log = function (text) {
        console.log("[Client " + remoteIP + "] ->\t" + text);
    };

    function sendPixelUpdate(x, y, receiver = socket) {
        receiver.send(JSON.stringify({
            "action": "updatePixel",
            x,
            y,
            "colorIdx": pixels[x][y].colorIdx
        }));
    }

    function sendTimer(type, time) {
        socket.send(JSON.stringify({
            "action": "timer",
            type,
            time
        }));
    }

    log("New client connected\t(" + ws.clients.size + " total)");

    socket.send(JSON.stringify({
        "action": "canvasInfo",
        "width": CANVAS_WIDTH,
        "height": CANVAS_HEIGHT
    }));

    socket.on("message", function (rawdata) {
        let message_timestamp = new Date();

        let data;
        try {
            data = JSON.parse(rawdata);
        } catch (e) {
        }

        let action;
        if (data && data.action) {
            action = data.action;
        } else {
            action = rawdata;
        }

        switch (action) {

            case "ping":
                socket.send('{"action":"pong"}');
                break;

            case "refreshPixels":
                let pixelArray = new Uint8Array(CANVAS_WIDTH * CANVAS_HEIGHT);
                for (let x = 0; x < CANVAS_WIDTH; x++) {
                    for (let y = 0; y < CANVAS_HEIGHT; y++) {
                        pixelArray[x + y * CANVAS_WIDTH] = pixels[x][y]["colorIdx"];
                    }
                }
                socket.send(pixelArray);
                break;

            case "paint":

                // Check rate limits
                if (remoteIP in timestamps) {
                    if (message_timestamp - timestamps[remoteIP] < TIME_BETWEEN_PIXELS * 1000) {
                        sendTimer("toofast", TIME_BETWEEN_PIXELS * 1000 - (message_timestamp - timestamps[remoteIP]));
                        sendPixelUpdate(data.x, data.y);
                        break;
                    }
                }

                if (data.x >= 0 && data.y >= 0 && data.x < CANVAS_WIDTH && data.y < CANVAS_HEIGHT) {

                    pixels[data.x][data.y]["colorIdx"] = data.colorIdx;
                    timestamps[remoteIP] = message_timestamp;
                    sendTimer("paintsuccess", TIME_BETWEEN_PIXELS * 1000);

                    // Update MongoDB document, if collection is available
                    if (pixelCollection) {
                        pixelCollection.findOneAndUpdate({
                            "x": data.x,
                            "y": data.y
                        }, {$set: {colorIdx: data.colorIdx}}, {upsert: true});
                    }

                    let broadcastPacket = JSON.stringify({
                        "action": "updatePixel",
                        'x': data.x,
                        'y': data.y,
                        'colorIdx': pixels[data.x][data.y].colorIdx
                    });
                    ws.clients.forEach(function (client) {
                        if ((client !== socket) && (client.readyState === WebSocket.OPEN)) {
                            client.send(broadcastPacket);
                        }
                    });

                } else {
                    log("Invalid paint request");
                }
                break;

            case "getPixel":
                log("GETPIXEL (" + data.x + ", " + data.y + ")");
                sendPixelUpdate(data.x, data.y);
                break;

            default:
                break;
        }
    });

    socket.on("error", function (exception) {
        log("Error encountered");
        log(exception);
    });

    socket.on("close", function () {
        log("Client disconnected (" + ws.clients.size + " total)");
    });
});

console.log("Pixel Server Listening on port " + PORT);