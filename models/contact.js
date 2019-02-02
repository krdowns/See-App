const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    email: {type: String, unique: true}
})

module.exports = mongoose.model('Contact', contactSchema);