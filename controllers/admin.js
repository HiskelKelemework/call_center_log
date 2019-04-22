var User = require('../models/user');
var utils = require('../utils/utils');

module.exports = {
    createUser: function(req, res) {
        const username = req.body.username;
        const password = req.body.password;
      
        if (utils.areNonEmpty(username, password)) {
          const user = new User({
            username: username.trim(),
            password: password.trim(),
            type: 'user'
          });

          // converts password to hashed password
          user.hashPassword();

          user.save((err, result) => {
            if (err) {
                console.log(err);
                utils.sendErrorMessage(res, 'username already taken!');
            } else {
                utils.sendSuccessMessage(res, {message: 'successfully created user!'});
            }
          });
        } else {
          utils.sendErrorMessage(res, 'username and password required!');
        }
    }
}