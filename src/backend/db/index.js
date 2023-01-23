const Mongoose = require('mongoose')
const mongoose = require("mongoose");

const DATABASE_URL = 'mongodb://localhost:27017/punto';

    db = mongoose.connect(DATABASE_URL);
    const User = require('../models/user')

//module.exports = db