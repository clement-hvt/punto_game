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

// get colors of a player
DeckSchema.methods.getPlayerColors = function() {
    const colors = []
    for (const card of this.cards) {
        colors.indexOf(card.color) === -1 ? colors.push(card.color) : null
    }
    return colors
}

const Deck = mongoose.model('Deck', DeckSchema);

module.exports = {Deck}