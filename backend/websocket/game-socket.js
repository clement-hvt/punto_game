const {Server} = require('socket.io');
const mongoose = require('mongoose');
require('../models/user');
require('../models/game');

class GameSocket {
    io;
    constructor(server) {
        this.io = new Server(server);
        this.startListening();
    }

    startListening() {
        this.io.on('connection', this.onConnection)
    }

    onConnection(socket) {
        socket.on('joinGame', GameSocket.#onJoinGame)
    }

    static #onJoinGame({gameId, userId}) {
        console.log(gameId)
        console.log(userId)
    }
}

module.exports = GameSocket;