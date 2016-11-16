var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/chat');

module.exports = mongoose;