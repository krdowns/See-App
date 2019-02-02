const db = require('../models')

module.exports = {
    
    create: (req, res) => {
        if (req.body!=='') {
            db.Contact.create(req.body, (err, newContact) => {
                if (err) {
                    return console.log(err);
                } 
                res.json(newContact);
            })
        }
    },

    read: (req, res) => {
        db.Contact.find({})
        .populate('user')
        .exec(function(err, allContacts){
            if(err) return console.log(err);
            res.json({'data': allContacts});
        })
    },

    update: (req,res) => {
        console.log(req.body)
        var contactId = req.params.id;
        var email = req.body;
        console.log(contactId);
        db.Contact.findByIdAndUpdate({_id: contactId}, email, {new: true},(err, updatedContact) => {
            if (err) { 
                return console.log(err);
            }
            res.json(updatedContact);
        })
    },

    delete: (req, res) => {
        console.log("hello")
        var contactId = req.params.id;
        db.Contact.findByIdAndDelete({_id: contactId}, (err, deletedContact) => {
            if (err) {
                return console.log(err);
            }
            res.json(deletedContact);
        })
    },

    filter: (req, res) => {
        contact.find({})
        .populate(
            {
                path: 'user',
                match: {id: req.params.userId}
            }
        )
        .exec((err, contacts) => {
            if(err) return console.log(err);
            console.log(contacts);
            contacts = contacts.filter((contact) => contact.user)
            res.json(contacts);
        })
    }
}