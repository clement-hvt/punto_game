const mongoose = require('mongoose');

const Schema = mongoose.Schema;
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
    const cardPositions = []

    this.moves.forEach(move => cardPositions[posX][posY] = move.card)

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

const Game = mongoose.model('Game', GameSchema);

module.exports = {Game, GameSchema};

