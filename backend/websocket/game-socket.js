const {Server} = require('socket.io');
const mongoose = require('mongoose');
require('../models/user');
require('../models/game');
const {start} = require("../controllers/games");
const {Deck} = require("../models/deck");
const {Card} = require("../models/card");
const {cardAllocation} = require("../business/GameBusiness");
const Game = mongoose.model('Game');

class GameSocket {
    static io;
    constructor(server) {
        GameSocket.io = new Server(server, {
            cors: 'http://localhost:3001'
        })
        GameSocket.startListening()
    }

    static startListening() {
        GameSocket.io.on('connection', GameSocket.onConnection)
    }

    static onConnection(socket) {
        socket.on('join-game', (args, callback) => GameSocket.#onJoinGame(socket, args, callback))
    }

    static async #onJoinGame(socket, {gameId, userId}, callback) {
        const game = await Game.findById(mongoose.Types.ObjectId(gameId))

        if (!game) {
            callback({status: 'error', msg:`You have not been added to the room ${gameId}`})
        } else {
            socket.join([gameId, `player${GameSocket.getPlayerIndex(game, userId)}`])

            if (game.players.length === game.nbPlayers) {
                cardAllocation(game)
                    .then(game => {
                        game.status = 'inprogress';
                        game.save((err) => {
                            if(err) {
                                socket.to(gameId).emit('start-game', {error: err})
                            } else {
                                socket.to(gameId).emit('start-game', true)
                                callback({status: 'success', msg:`You have been added to the room ${gameId}`, isStart: true})
                            }
                            GameSocket.start(game)
                        })
                    })
                    .catch(err => {
                        if(err) socket.to(gameId).emit('start-game', {error: err})
                    })
            } else {
                callback({status: 'success', msg:`You have been added to the room ${gameId}`, isStart: false})
            }
        }
    }

    static start(game) {
        game.currentPlayer = game.players[0]
        const playerIndex = GameSocket.getPlayerIndex(game, game.currentPlayer)

        game.save(async err => {
            if (err) {
                GameSocket.io.to([game._id, `player${playerIndex}`]).emit('next-card', {error: 'the card could not be distributed'})
            } else {
                const deckId = game.decks[playerIndex]._id;

                const deck = await Deck.findById(deckId)
                const randomCard = deck => deck.splice((Math.random() * deck.length) | 0, 1) //take random card and remove it

                const cardId = randomCard([...deck.cards])
                const card = await Card.findById(cardId, 'color number')

                deck.currentCard = cardId

                deck.save(err => {
                    if (err) {
                        GameSocket.io.to([game._id, `player${playerIndex}`]).emit('next-card', {error: err})
                    } else {
                        GameSocket.io.to([game._id, `player${playerIndex}`]).emit('next-card', {card})
                    }
                })
            }
        })

    }

    static getPlayerIndex(game, userId) {
        return game.players.indexOf(mongoose.Types.ObjectId(userId))
    }
}
module.exports = GameSocket;