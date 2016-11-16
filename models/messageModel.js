var Schema = require('mongoose').Schema;
var db = require('../config/db');


var Message = db.model('Message', {
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    msg: String,
    timestamp: { type: Date, default: Date.now },
    seen: [{
        user: String,
        timestamp: Date
    }]
});

module.exports = Message;