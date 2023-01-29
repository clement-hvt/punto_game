const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler')
const userController = require('./users')
const jwt = require('jwt-simple')

require('../models/user');

const User = mongoose.model('User');

exports.connection = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    let user = await User.findOne({email});
    if (user) {
        user.verifyPassword(password, function(err, isMatch) {
            if (err || !isMatch) res.status(401).send({error: 'Authentication failed.'});
            const token = user.getToken();
            res.send({token, id: user._id})
        })
    } else {
        res.status(404).send({error: 'Email or password is invalid.'})
    }
});

exports.connectionWithToken = asyncHandler(async (req, res) => {
    const {token} = req.body;
    const {id, email} = jwt.decode(token, process.env.JWT_SECRET);

    if (!id) res.status(401).send({error: 'Authentication failed.'});

    const user = await User.findById(mongoose.Types.ObjectId(id))

    if (!user) res.status(401).send({error: 'Authentication failed.'});

    const newToken = user.getToken()
    res.send({token: newToken, id: user._id});
})