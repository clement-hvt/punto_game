const mongoose = require('mongoose');
const GameSchema = require('./game')

const Schema = mongoose.Schema;
const GameMoveSchema = new Schema({
    moveX: {
        type: Number
    },
    moveY: {
        type: Number
    }
});

const GameMove = mongoose.model('GameMove', GameMoveSchema);

exports.module = {GameMove, GameMoveSchema}