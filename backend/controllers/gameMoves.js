const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');

require('../models/game');
require('../models/gameMove');
require('../models/user');

const {Card} = require("../models/card");
const {User} = require("../models/user");
const GameSocket = require("../websocket/game-socket");
const jwt = require("jwt-simple");
const {Deck} = require("../models/deck");

const GameMove = mongoose.model('GameMove');
const Game = mongoose.model('Game');

exports.addMove = asyncHandler(async (req, res) => {
    const {id: playerId} = jwt.decode(req.headers.authorization, process.env.JWT_SECRET)

    const gameId = mongoose.Types.ObjectId(req.body.gameId);
    let game = await Game.findOne({_id: gameId})
        .populate({
            path: 'moves',
            populate: {path: 'card'}
        })
        .populate({
            path: 'decks',
            populate: {path: 'cards'}
        })
        .exec()

    if (!game) {
        throw new Error(`Game was not found with id ${gameId}`)
    }

    const playerDeck = game.decks.filter(deck => deck.player.toString() === playerId)
    const colors = playerDeck[0].getPlayerColors()

    const cardId = mongoose.Types.ObjectId(req.body.cardId);
    const card = await Card.findById(cardId)
    if (!card) {
        throw new Error(`Card was not found with id ${card}`)
    }

    const gameMove = new GameMove({
        posX: req.body.posX,
        posY: req.body.posY,
    });

    const canBeHad = game.cardCanBeHad(gameMove.posX, gameMove.posY, card)

    if(canBeHad) {
        gameMove.card = card
        gameMove.save((err, gameMove) => {
            if (err) {
                res.status(500).send({error: err});
            } else {
                game.moves.push(gameMove)

                game.save(async (err, game) => {
                    if (err) {
                        res.status(500).send({error: err});
                    } else {
                        const playerIndex = GameSocket.getPlayerIndex(game, playerId)
                        const deckId = game.decks[playerIndex]._id;
                        await Deck.updateOne(
                            {_id: deckId},
                            { $pull: { cards: card._id }}
                        )

                        const roomId = `${game._id}-${playerIndex}`

                        const isWinning = game.isWinning(colors)

                        if (isWinning) {
                            GameSocket.emitWinner(gameId._id.toString(), playerId)
                            await Game.updateOne(
                                {_id: gameId},
                                { status: 'finish'}
                            )
                        } else {
                            GameSocket.emitCardPlaced(gameId._id.toString(), roomId, card, gameMove.toJSON())

                            await GameSocket.nextPlayer(game)
                        }

                        res.send({success: 'Move has been added to the game.'});
                    }
                })
            }
        })
    } else {
        res.status(500).send({success: 'Move has not been added to the game.'});
    }
});