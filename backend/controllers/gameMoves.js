const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');

require('../models/game');
require('../models/gameMove');
const {Card} = require("../models/card");

const GameMove = mongoose.model('GameMove');
const Game = mongoose.model('Game');

exports.addMove = asyncHandler(async (req, res) => {
    const gameId = mongoose.Types.ObjectId(req.body.gameId);
    const game = await Game.findById(gameId)
    if (!game) {
        throw new Error(`Game was not found with id ${gameId}`)
    }

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
        gameMove.save(function (err, gameMove) {
            if (err) {
                res.status(500).send({error: err});
            } else {
                game.moves.push(gameMove)
                game.save(function (err, game) {
                    if (err) {
                        res.status(500).send({error: err});
                    } else {
                        res.send({success: 'Move has been added to the game.'});
                    }
                })
            }
        })
    } else {
        res.status(500).send({success: 'Move has not been added to the game.'});
    }
});