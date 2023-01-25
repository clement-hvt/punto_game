const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler')
require('../models/user');
require('../models/game');
require('../models/card');
const {Deck} = require("../models/deck");
const Game = mongoose.model('Game');
const User = mongoose.model('User');
const Card = mongoose.model('Card');

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


exports.getGameNotStarted = function (nbPlayers, playerId) {
    const arrayForNbPlayerPerGame = [
        {'players.1': {'$exists': false}},
        {'players.2': {'$exists': false}},
        {'players.3': {'$exists': false}}
    ];
    return Game.find(
        {
            '$and': [
                {
                    '$or': [...arrayForNbPlayerPerGame.slice(0, nbPlayers - 1)]
                },
                {nbPlayers},
                {players: {'$nin': [playerId]}}
            ]
        }
    );
}

exports.create = asyncHandler((req, res) => {
    const game = new Game({nbPlayers: req.body.nbPlayers ?? 2});
    game.save(function (err, user) {
        if (err) return res.status(500).send({error: err})
        res.send(user);
    });
})

exports.start = asyncHandler(async (req, res) => {
    const gameId = mongoose.Types.ObjectId(req.body.gameId);
    let game = await Game.findById(gameId);
    if (game) {
        cardAllocation(game)
            .then(game => {
                game.status = 'inprogress';

                res.send(game)
            })
            .catch(err => {
                res.status(500).send(err)
            })
    } else {
        res.status(404).send({error: 'The game was not found.'})
    }
})

exports.getNextCard = asyncHandler((req, res) => {

})

function cardAllocation(game) {
    return new Promise(async (resolve, reject) => {

        const colors = ['blue', 'red', 'yellow', 'green'];
        /**
         *
         * @returns {string} a random color and delete it for the next attribution
         */
        const randomColor = () => colors.splice((Math.random() * colors.length) | 0, 1)[0];

        const allCards = await Card.find()

        /**
         * @param color
         * @returns Deck
         */
        function createDeckWithColor([...colors]) {
            const deck = new Deck();
            colors.forEach(color => {
                const cardWithColor = allCards.filter(card => card.color === color)
                cardWithColor.map(card => deck.cards.push(card));
            })
            return deck;
        }

        // Initialize if there is 3 players
        let sharedCards = null;
        if (game.nbPlayers === 3) {
            sharedCards = createDeckWithColor([randomColor()])
        }

        for (let i = 0; i < game.nbPlayers; i++) {
            let deck;
            switch (game.nbPlayers) {
                case 2:
                    deck = createDeckWithColor([randomColor(), randomColor()]);
                    break;
                case 3:
                    deck = createDeckWithColor([randomColor()]);
                    // Get random card in the shared cards
                    for (let i = 0; i < 6; i++) {
                        let randomCard = sharedCards.cards.splice((Math.random() * sharedCards.cards.length) | 0, 1)
                        deck.cards.push(randomCard)
                    }
                    break;
                default:
                    deck = createDeckWithColor([randomColor()]);
                    break;
            }
            deck.player = game.players[i];
            await deck.save(err => {
                if (err) reject(err);
            });
            game.decks.push(deck);
        }
        game.save(function(err, game) {
            if(err) reject(err)
            resolve(game)
        })
    })
}