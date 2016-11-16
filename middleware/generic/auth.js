var entities = require('html-entities').AllHtmlEntities;

/**
 * If the user is not logged in, redirects to /
 */
module.exports = function (objectrepository) {

    return function (req, res, next) {
        if (typeof req.session.userid === 'undefined') {
            return res.redirect('/');
        }
        res.tpl.username = entities.decode( req.session.username );

        return next();
    };

};
