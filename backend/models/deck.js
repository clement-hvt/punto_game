const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const DeckSchema = new Schema({
    player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cards: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Card',
        required: true
    }
});

const Deck = mongoose.model('Deck', DeckSchema);

module.exports = {Deck}