const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/see', {useNewUrlParser: true});
mongoose.connect( process.env.MONGODB_URI || 'mongodb://localhost/see');



module.exports = {
  User: require('./user'),
  Entry: require('./entry'),
  Contact: require('./contact')
}

