const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;
const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        index: { unique: true }
    },
    password: {
        type: String,
        required: true
    },
    games: {
        type: Array
    }
});

UserSchema.pre('save', function(next) {
    if (!this.isModified('password')) return next();

    bcrypt.hash(this.password, 10, function(err, hash) {
        if (err) return next(err);

        this.password = hash;
        next();
    });
})

module.exports = mongoose.model('User', UserSchema);