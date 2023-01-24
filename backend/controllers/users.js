const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler')

require('../models/user');

const User = mongoose.model('User');

exports.register = asyncHandler(async (req, res) => {
    const user = new User();
    const query = req.body;

    const isAlreadyRegistered = await exports.findByEmail(query.email);

    if (!isAlreadyRegistered) {
        user.email = query.email;

        if (query.password && query.password === query.confirmPassword) {
            user.password = query.password;
        }
        await user.save();
        res.send({success: "The account has been created."});
    } else {
        res.status(409).send({error: "Account already exists."});
    }
})

exports.findByEmail = asyncHandler((email) => {
    return User.findOne({email});
})

exports.delete = asyncHandler(async (res, req) => {
    const email = res.body.email;
    User.deleteOne({email}, function (err) {
        if (err) req.status(500).send({error: 'The given account could not be deleted.'});

        req.send({success:'The given account could be deleted'})
    });
})