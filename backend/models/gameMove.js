const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const GameMoveSchema = new Schema({
    posX: {
        type: Number
    },
    posY: {
        type: Number
    },
    game: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game'
    },
    card: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Card'
    }
})

const GameMove = mongoose.model('GameMove', GameMoveSchema)

exports.module = {GameMove, GameMoveSchema}