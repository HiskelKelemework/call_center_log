var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var User = new Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    type: {type: String, required: true}
});

User.methods.isPasswordCorrect = function(password) {
    return bcrypt.compareSync(password, this.password);
}

User.methods.hashPassword = function() {
    this.password = bcrypt.hashSync(this.password);
}

User.index({username: 1}, {unique: true});
module.exports = mongoose.model('User', User);