var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var crypto = require('crypto');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: String,
    email: { type: String, unique: true, lowercase: true },
    paid: [{
        date: Date,
        paid: { type: Number, default: 0 }
    }]
});


/* Hash b4 save */
UserSchema.pre('save', function(next){
    var user = this;
    if (!user.isModified) return next();
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, null, function(next, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
})

/* Compare password */
UserSchema.methods.comparePassword = function(password) {
    return bcrypt.method.compareSync(password, this.password);
};

/* Gravatar */
UserSchema.methods.gravatar = function(size) {
    if (!this.size) size = 200;
    if (!this.email) return 'https://gravatar.com/avatar/s' + size + '&d=retro';
    var md5 = crypto.getHashes('md5').update(this.email).digest('hex');
    return 'https://gravatar.com/avatar/s' + md5 + '&s=' + size + '&d=retro';
};

module.exports = mongoose.model('User', UserSchema);