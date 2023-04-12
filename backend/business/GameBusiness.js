const {Game} = require("../models/game");
const {Card} = require("../models/card");
const {Deck} = require("../models/deck");

/**
 * Finds a new game where the player is not in it
 *
 * @param nbPlayers
 * @param playerId
 */
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

exports.cardAllocation = function(game) {
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
                    for (let i = 0; i < 3; i++) {
                        let randomCard = sharedCards.cards.splice((Math.random() * sharedCards.cards.length) | 0, 1)[0]
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
        resolve(game)
    })
}