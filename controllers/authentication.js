var jwt = require('jsonwebtoken');

var User = require('../models/user');
var utils = require('../utils/utils');

const userSecret = 'USER@secret123456789';
const adminSecret = 'ADMIN@secret123456789';

module.exports = {
    authenticateUser: function (req, res, account_type) {
        const username = req.body.username;
        const password = req.body.password;

        const secret = account_type == 'admin' ? adminSecret : userSecret;

        if (username && password && username.trim() && password.trim()) {
            User.findOne({ username: username.trim() }).where({ type: account_type }).exec((err, user) => {
                if (err) {
                    utils.sendErrorMessage(res, err.message);
                    return;
                }

                if (!user) {
                    utils.sendErrorMessage(res, 'username does not exist');
                    return;
                }

                if (user.isPasswordCorrect(password.trim())) {
                    jwt.sign({ username: username.trim() }, secret, function (err, token) {
                        if (err) {
                            console.log(err);
                            // hopefully will never get called!
                            utils.sendErrorMessage(res, 'something went checking token!');
                        }
                        else {
                            utils.sendSuccessMessage(res, { token: token, username: username, isAdmin: account_type == 'admin' });
                        }
                    });
                } else {
                    utils.sendErrorMessage(res, 'incorrect usrename or password!');
                }
            });
        } else {
            utils.sendErrorMessage(res, 'username and password must be provided!');
        }
    },

    checkPoint: function (req, res, next, account_type) {
        const token = req.headers.token;
        const secret = account_type == 'admin' ? adminSecret : userSecret;

        if (token) {
            jwt.verify(token, secret, (err, decoded) => {
                if (err) {
                    utils.sendErrorMessage(res, 'Invalid token!');
                } else {
                    User.findOne({username: decoded.username}, (err, result) => {
                        if (err) utils.sendErrorMessage(res, 'could not validate user!');
                        else if (!result) utils.sendErrorMessage(res, 'user does not exist!');
                        else {
                            req.username = decoded.username;
                            next();
                        }
                    }); 
                }
            });
        } else {
            utils.sendErrorMessage(res, 'No authorization token sent!');
        }
    }


}