// This script allow you to create all the needed cards

const mongoose = require('mongoose')
require('dotenv').config();
require('../models/card')
const Card = mongoose.model('Card')

const numbers = [ ...Array(9).keys() ].map( i => i+1);
const colors = ['blue', 'red', 'yellow', 'green'];

const cards = [];
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost:27017/punto').then(async (res) => {
    mongoose.connection
    colors.forEach(color => {
        numbers.forEach(number => {
            cards.push({color, number})
        })
    });
    Card.insertMany(cards, function(err, cards) {
        if (err) throw new Error(`Les cartes n'ont pas pu être insérées`);
        console.log(`Ajouts des cartes réussis`);
        process.exit();
    })
});

