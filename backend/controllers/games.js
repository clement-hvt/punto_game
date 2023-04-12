const mongoose = require('mongoose')
const asyncHandler = require('express-async-handler')
require('../models/user')
require('../models/game')
require('../models/card')
const jwt = require("jwt-simple")
const {getGameNotStarted} = require("../business/GameBusiness");
const Game = mongoose.model('Game')
const User = mongoose.model('User')

exports.addPlayerToGame = asyncHandler(async (req, res) => {
    const nbPlayers = req.body.nbPlayers ?? 4;

    const token = req.headers.authorization;
    const {id} = jwt.decode(token, process.env.JWT_SECRET)

    // add jwt auth
    const userObjectId = mongoose.Types.ObjectId(id);

    const user = await User.findById(userObjectId);
    let game = await getGameNotStarted(nbPlayers, userObjectId);

    if (game.length === 0) { // check if it's a game object or an empty array (if there is no available game)
        game = new Game({nbPlayers});
    } else {
        game = game[0];
    }

    game.players.push(user);

    game.save(function (err, game) {
        if (err) {
            res.status(500).send({error: err});
        } else {
            res.send({success: {gameId: game._id}});
        }
    })
})