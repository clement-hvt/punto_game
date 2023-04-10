const mongoose = require('mongoose')
require('../models/gameMove')
const GameMove = mongoose.model('GameMove')

const Schema = mongoose.Schema
const GameSchema = new Schema({
    players: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User'
    },
    nbPlayers: {
        type: Number,
        required: true
    },
    moves: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'GameMove'
    },
    status: {
        type: String,
        enum: ['pending', 'inprogress', 'finish', 'cancel'],
        required: true,
        default: 'pending'
    },
    decks: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Deck'
    },
    currentPlayer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

GameSchema.methods.cardCanBeHad = function (posX, posY, card) {
   const cardPositions = this.getCardPositions()

    let hasCardAround = false;
    if (posX && posY) {
        const bottomLeftCorner = cardPositions?.[posX-1]?.[posY-1]
        const bottomRightCorner = cardPositions?.[posX+1]?.[posY-1]
        const upperLeftCorner = cardPositions?.[posX-1]?.[posY+1]
        const upperRightCorner = cardPositions?.[posX+1]?.[posY+1]
        const toTheLeft = cardPositions?.[posX-1]?.[posY]
        const toTheRight = cardPositions?.[posX+1]?.[posY]
        const up = cardPositions?.[posX]?.[posY+1]
        const down = cardPositions?.[posX]?.[posY-1]
        if (
            bottomLeftCorner ||
            bottomRightCorner ||
            upperLeftCorner ||
            upperRightCorner ||
            toTheLeft ||
            toTheRight ||
            up ||
            down
        ) {
            hasCardAround = true
        }
    }
    if (posX === 5 && posY === 5) {
        hasCardAround = true
    }

    let isOccupied = cardPositions?.[posX]?.[posY]

    return (isOccupied && isOccupied.number < card.number) || (!isOccupied && hasCardAround)
}

GameSchema.methods.isWinning = function (playerColors) {
    const alignedCardsForWin = this.nbPlayers === 2 ? 5 : 4

    const cardPositions = this.getCardPositions()

    let followedCards = 1
    let isWinning = false
    function checkPosition(previousCard, startPointX, startPointY , nextX, nextY) {

        const nextCard = cardPositions?.[startPointX + nextX]?.[startPointY + nextY]
        if (nextCard?.color === previousCard.color) {
            followedCards++;
            checkPosition(nextCard, startPointX + nextX, startPointY + nextY, nextX, nextY)
        }

        if (followedCards !== 1 && followedCards !== alignedCardsForWin) {
            followedCards = 1
        } else if (followedCards === alignedCardsForWin) {
            isWinning = true
        }
    }

    for (let i = 0; i < cardPositions.length; i++) {
        for (let j = 0; j < cardPositions.length; j++) {
            const card = cardPositions[i][j]
            if (!card || isWinning || !playerColors.includes(card.color) ) {
                continue
            }

            if (cardPositions?.[i + 1][j]?.color === card.color) { // check right
                checkPosition(cardPositions?.[i + 1][j], i, j, 1, 0)
            }
            if (cardPositions[i]?.[j + 1]?.color === card.color && !isWinning) { // check below
                checkPosition(cardPositions[i]?.[j + 1], i, j, 0, 1)
            }
            if (cardPositions?.[i + 1]?.[j + 1]?.color === card.color) { // check diagonally right
                checkPosition(cardPositions?.[i + 1]?.[j + 1], i, j, 1, 1)
            }
            if (cardPositions?.[i - 1]?.[j - 1]?.color === card.color && !isWinning) { // check diagonally left
                checkPosition(cardPositions?.[i - 1]?.[j - 1], i, j, -1, -1)
            }
        }
    }

    return isWinning
}

GameSchema.methods.getCardPositions = function () {
    let cardPositions = Array(11)
    for(let i = 0; i < cardPositions.length; i++) {
        cardPositions[i] = Array(11)
    }

    for (const move of this.moves) {
        cardPositions[move.posX][move.posY] = move.card
    }
    return cardPositions
}

const Game = mongoose.model('Game', GameSchema);

module.exports = {Game, GameSchema};

