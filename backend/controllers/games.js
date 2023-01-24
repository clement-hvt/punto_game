const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler')
require('../models/user');
require('../models/game');
const Game = mongoose.model('Game');
const User = mongoose.model('User');

exports.addPlayerToGame = asyncHandler(async (req, res) => {
    const nbPlayers = req.body.nbPlayers ?? 4;
    // add jwt auth
    const userObjectId = mongoose.Types.ObjectId(req.body.userId);

    const user = await User.findById(userObjectId);
    let game = await exports.getGameNotStarted(nbPlayers, userObjectId);

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
            res.send({success: 'User has been added to the game.'});
        }
    })
})


exports.getGameNotStarted = function(nbPlayers, playerId) {
    const arrayForNbPlayerPerGame = [
        {'players.1': {'$exists': false}},
        {'players.2': {'$exists': false}},
        {'players.3': {'$exists': false}}
    ];
    return Game.find(
        {
            '$and': [
                ...arrayForNbPlayerPerGame.slice(0, nbPlayers-1),
                {nbPlayers},
                {players: {'$nin': [playerId]}}
            ]
        }
    );
}

exports.create = function(req, res) {
    const game = new Game({nbPlayers: req.body.nbPlayers ?? 2});
    game.save(function (err, user) {
        if (err) return res.status(500).send({error: err})
        res.send(user);
    });
}