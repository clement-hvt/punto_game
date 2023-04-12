const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler')

require('../models/user');

const User = mongoose.model('User');

exports.register = asyncHandler(async (req, res) => {
    const user = new User();
    const {email, password, confirmPassword} = req.body;

    const isAlreadyRegistered = await exports.findByEmail(email);

    if (!isAlreadyRegistered) {
        user.email = email;

        if (password && password === confirmPassword) {
            user.password = password;
        }
        await user.save();
        const token = user.getToken()

        res.send({token, id: user._id});
    } else {
        res.status(409).send({error: "Account already exists."});
    }
})

exports.findByEmail = asyncHandler((email) => {
    return User.findOne({email});
})

exports.delete = asyncHandler(async (req, res) => {
    const {email} = req.body;
    User.deleteOne({email}, function (err) {
        if (err) res.status(500).send({error: 'The given account could not be deleted.'});

        res.send({success:'The given account could be deleted'})
    });
})