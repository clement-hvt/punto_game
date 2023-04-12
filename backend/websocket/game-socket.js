const {Server} = require('socket.io');
const mongoose = require('mongoose');
require('../models/user');
require('../models/game');
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
            const roomId = `${game._id}-${userId}`
            socket.join([gameId, roomId])

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

    static async start(game) {
        game.currentPlayer = game.players[0]
        const currentPlayerObjectId = game.currentPlayer.toString()
        const playerIndex = GameSocket.getPlayerIndex(game, game.currentPlayer)

        await GameSocket.#sendNextCard(game, playerIndex, currentPlayerObjectId)
    }
    static async nextPlayer(game) {
        const currentPlayer = game.currentPlayer
        const currentPlayerIndex = GameSocket.getPlayerIndex(game, currentPlayer)
        const nextPlayer = game.players[currentPlayerIndex + 1] ?? game.players[0]
        const nextPlayerIndex = game.players[currentPlayerIndex + 1] ? currentPlayerIndex + 1 : 0
        game.currentPlayer = nextPlayer

        await GameSocket.#sendNextCard(game, nextPlayerIndex, nextPlayer.toString())
    }

    static #sendNextCard(game, playerIndex, playerObjectId) {
        return new Promise((resolve, reject) => {
            game.save(async err => {
                const roomId = `${game._id}-${playerObjectId}`
                if (err) {
                    GameSocket.io.to(roomId).emit('next-card', {error: 'the card could not be distributed'})
                    reject()
                }
                const deckId = game.decks[playerIndex]._id;
                const deck = await Deck.findById(deckId)
                const randomCard = deck => deck.splice((Math.random() * deck.length) | 0, 1) //take random card and remove it

                const cardId = randomCard([...deck.cards])
                const card = await Card.findById(cardId, 'color number')

                deck.currentCard = cardId

                deck.save(err => {
                    if (err) {
                        GameSocket.io.to(roomId).emit('next-card', {error: err})
                        reject()
                    } else {
                        GameSocket.io.to(roomId).emit('next-card', {card})
                        resolve()
                    }
                })
            })
        })
    }

    static emitWinner(gameId, playerId) {
        GameSocket.io.to(gameId).emit('finished', {playerId})
    }

    static emitCardPlaced(gameId, roomId, card, move) {
        GameSocket.io.to(gameId).except(roomId).emit('card-placed', {card, move})
    }

    static getPlayerIndex(game, userId) {
        return game.players.indexOf(mongoose.Types.ObjectId(userId))
    }
}
module.exports = GameSocket;