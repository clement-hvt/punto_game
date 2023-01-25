const mongoose = require('mongoose');
const GameSchema = require('./game')

const Schema = mongoose.Schema;
const GameMoveSchema = new Schema({
    posY: {
        type: Number
    },
    posY: {
        type: Number
    }
});

const GameMove = mongoose.model('GameMove', GameMoveSchema);

exports.module = {GameMove, GameMoveSchema}