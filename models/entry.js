const mongoose = require('mongoose');

const entrySchema = mongoose.Schema({
    title: String,
    content: String,
    author: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    date: {type:Date, default: new Date() },
    trigger: false,
    watson: Object
})

module.exports = mongoose.model('Entry', entrySchema);