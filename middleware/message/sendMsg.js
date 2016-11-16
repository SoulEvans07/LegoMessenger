var requireOption = require('../generic/common').requireOption;
var entities = require('html-entities').AllHtmlEntities;

module.exports = function (objectrepository) {

    var messageModel = requireOption(objectrepository, 'messageModel');

    return function (req, res, next) {

        if (req.body.user === undefined) {
            console.log("no request");
            res.end(JSON.stringify({}));
            return;
        }

        var user = entities.encode(req.body.user);
        var time = req.body.last;

        messageModel.find( { 'seen.user' : { $ne: user } } ).populate('user').exec(function (err, results) {
            if(err){
                res.tpl.error.push("cannot find messages");
                console.log("cannot find messages : " + err);
                return next();
            }

            if(parseInt(results.length) > 0){
                messageModel.update(
                    { 'seen.user' : { $ne: user } },
                    {$push:
                        {seen: {
                            user: user,
                            timestamp: time
                        }}
                    },
                    {multi: true},
                    function(err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("Successfully added");
                        }
                    });

                // * clear pwdhash TODO: not so nice in production .Soul
                results.forEach(function (msg) {
                    msg.user.pwdhash = 'nice try';
                });
                console.log("send msgs: " + JSON.stringify(results));
            }

            res.end(JSON.stringify(results));

            return next();
        });
    };

};
