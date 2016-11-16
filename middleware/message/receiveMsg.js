var requireOption = require('../generic/common').requireOption;
var Schema = require('mongoose').Schema;
var entities = require('html-entities').AllHtmlEntities;

module.exports = function (objectrepository) {

    var messageModel = requireOption(objectrepository, 'messageModel');

    return function (req, res, next) {

        if (req.body.message === undefined) {
            return next();
        }
        var message = req.body.message;

        console.log(req.sessionID);
        message.user = req.session.userid;
        message.msg = entities.encode(message.msg);
        message.msg = message.msg.replace("\n", "<br/>");

        messageModel.create(message, function (err, small) {
            if (err) {
                console.log("failed : "+ JSON.stringify(message));
                console.log("because: " + err);
                return;
            }
            // saved!
            console.log("saved: " + JSON.stringify(message) );
            res.end();
        });
    };

};
