var requireOption = require('../generic/common').requireOption;
var bcrypt = require('bcrypt-nodejs');

/**
 * This middleware loads the user from model and checks the credentials,
 * if they are ok, set session values and redirect to /
 * if they are wrong, set error message
 */
module.exports = function (objectrepository) {

    var userModel = requireOption(objectrepository, 'userModel');

    return function (req, res, next) {

        //not enough parameter
        if ((typeof req.body === 'undefined') || (typeof req.body.email === 'undefined') ||
            (typeof req.body.password === 'undefined')) {
            return next();
        }

        //lets find the user
        userModel.findOne({
            email: req.body.email
        }, function (err, user) {
            if ((err) || (!user)) {
                res.tpl.error.push('Your email address is not registered!');
                return next();
            }



            // * Check password
            bcrypt.compare(req.body.password, user.pwdhash, function (err, match) {
                if (err) {
                    res.tpl.error.push('Error in password hash compare!');
                    return next();
                }

                console.log(match);
                if(match){
                    // * Login is ok, save id to session
                    req.session.userid = user._id;
                    req.session.username =  user.username;
                    // * Redirect to / so the app can decide where to go next
                    return res.redirect('/');
                } else {
                    res.tpl.error.push('Wrong password!');
                    return next();
                }
            });
        });
    };

};