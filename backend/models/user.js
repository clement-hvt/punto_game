const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;
const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique:true,
        sparse: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    games: {
        type: Array
    }
});

UserSchema.pre('save', function(next) {
    if (!this.isModified('password') && !this.isNew) {
        return next();
    }
    bcrypt.hash(this.password, parseInt(process.env.BCRYPT_SALT), (err, hash) => {
        if (err) return next(err);
        this.password = hash;
        next();
    });
});

const User = mongoose.model('User', UserSchema);

module.exports = {User, UserSchema};