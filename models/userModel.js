var db = require('../config/db');


var User = db.model('User', {
    username : String,
    pwdhash : String,
    email : String,
    signupdate : { type: Date, default: Date.now }
});

module.exports = User;