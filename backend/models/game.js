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
    data: {
        type: Array
    }
});

const Game = mongoose.model('Game', GameSchema);

module.exports = {Game, GameSchema};