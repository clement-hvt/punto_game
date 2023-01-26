const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jwt-simple')

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

UserSchema.methods.verifyPassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};

UserSchema.methods.getToken = function() {
    return jwt.encode({
        id: this._id,
        email: this.email,
        date: new Date().getTime()
    }, process.env.JWT_SECRET);
}

const User = mongoose.model('User', UserSchema);

module.exports = {User, UserSchema};