var requireOption = require('../generic/common').requireOption;
var entities = require('html-entities').AllHtmlEntities;
var bcrypt = require('bcrypt-nodejs');

/**
 * Check if the email address is already registered, if not
 * create the user (no extra checks on password)
 */
module.exports = function (objectrepository) {

    var userModel = requireOption(objectrepository, 'userModel');
    var SALT_WORK_FACTOR = 10;

    return function (req, res, next) {
        // * Not enough parameter
        if ((typeof req.body === 'undefined') || (typeof req.body.email === 'undefined') ||
            (typeof req.body.password === 'undefined')) {
            return next();
        }

        // * Find the User by email
        userModel.findOne({
            email: req.body.email
        }, function (err, user) {
            if ((err) || (user !== null)) {
                res.tpl.error.push('Your email address is already registered!');
                return next();
            }

            // * Find the User by username
            userModel.findOne({
                username: req.body.name
            }, function (err, user) {
                if ((err) || (user !== null)) {
                    res.tpl.error.push('Your username is taken!');
                    return next();
                }

                if (req.body.name.length < 3) {
                    res.tpl.error.push('The username should be at least 3 characters!');
                    return next();
                }

                // * Create User
                var newUser = new userModel();
                newUser.username = entities.encode(req.body.name);
                newUser.email = entities.encode(req.body.email);

                // * Password Hashing
                bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
                    if(err){
                        res.tpl.error.push('Failed at salt generation!');
                        return next();
                    }
                    bcrypt.hash(req.body.password, salt, null, function(err, hash) {
                        if(err){
                            res.tpl.error.push('Failed at password hash generation!');
                            return next();
                        }

                        newUser.pwdhash = hash;
                        newUser.save(function (err) {
                            //redirect to /login
                            return res.redirect('/login');
                        });
                    });
                });
            });
        });
    };
};
