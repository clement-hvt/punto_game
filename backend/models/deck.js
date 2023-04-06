const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const DeckSchema = new Schema({
    player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    cards: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Card',
    },
    currentCard: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Card',
    }
});

const Deck = mongoose.model('Deck', DeckSchema);

module.exports = {Deck}