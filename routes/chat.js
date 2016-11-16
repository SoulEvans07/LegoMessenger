var renderMW = require('../middleware/generic/render');

var authMW = require('../middleware/generic/auth');
var sendMsgMW = require('../middleware/message/sendMsg');
var receiveMsgMW = require('../middleware/message/receiveMsg');

var messageModel = require('../models/messageModel');

module.exports = function (app) {
    var objectRepository = {
        messageModel : messageModel
    };

    app.get('/chat',
        authMW(),
        renderMW(objectRepository, 'messenger')
    );

    app.post('/chat',
        authMW(),
        receiveMsgMW(objectRepository),
        sendMsgMW(objectRepository)
    );
};
