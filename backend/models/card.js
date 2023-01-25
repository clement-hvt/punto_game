const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CardSchema = new Schema({
    color: {
        type: String,
        required: true,
        enum: ['blue', 'yellow', 'red', 'green']
    },
    number: {
        type: Number,
        required: true
    }
});

const Card = mongoose.model('Card', CardSchema);

module.exports = {Card}