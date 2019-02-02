const 
  bcrypt = require('bcrypt'),
  db = require('../models'),
  jwt = require('jsonwebtoken')

module.exports = {

    read: (req, res) => {
      console.log(req.params)
      db.User.find()
      .exec(function(err, Found){
          if(err) return console.log(err);
          res.json({'data': Found});
      })
    },

    readOne: (req, res) => {
      console.log(req.params)
      db.User.find({_id: req.params.userId})
      .exec(function(err, Found){
          if(err) return console.log(err);
          res.json({'data': Found});
      })
    },
    
    entries: (req, res) => {
      console.log(req.params)
      db.Entry.find({author: req.params.userId})
      .exec(function(err, foundEntries){
          if(err) return console.log(err);
          res.json({'data': foundEntries});
      })
    },

    contacts: (req, res) => {
      console.log(req.params)
      db.Contact.find({user: req.params.userId})
      .exec(function(err, foundContacts){
          if(err) return console.log(err);
          res.json({'data': foundContacts});
      })
    },

    signup : (req, res) => {
        console.log(req.body);
        db.User.find({email: req.body.email})
          .exec()
          .then( user => {
            if (user.length >= 1) {
              return res.status(409).json({
                message: "email already exists"
              })
            } else {
              bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err){ 
                  console.log("hashing error:", err);
                  res.status(200).json({error: err})
                } else {
                  db.User.create({
                    email: req.body.email,
                    password: hash,
                    emergencyContacts: [req.body.tel] 
                  }, {password: 0}, (err, result) => {
                      
                  let token = jwt.sign(
                      {result},
                      "debbie",
                      )
                        res.status(200).json({
                          message: 'User Created',
                          result,
                          token
                        })                      
                  })
                }
              })
            }
          })
          .catch( err => {
            console.log(err);
            res.status(500).json({err})
          })
    },

    login: (req, res) => {
        console.log("LOGIN CALLED");
        console.log("body", req.body)
        db.User.find({email: req.body.email})
          .select('+password')
          .exec()
          .then( users => {
            console.log("USERS: ", users);
            if(users.length < 1) {
              return res.status(401).json({
                message: "Email/Password incorrect"
              })
            }
            console.log("body", req.body);
            console.log("hash", users[0].password);
            bcrypt.compare(req.body.password, users[0].password, (err, match) => {
              console.log(match)
              if(err){console.log(err);return res.status(500).json({err})}
              if(match){
                console.log("MATCH: ", match)
                const token = jwt.sign(
                  {
                    email: users[0].email,
                    _id: users[0]._id
                  }, 
                  "debbie",
                  {
                    expiresIn: "8h"
                  },
                );
                console.log("NEW TOKEN: ", token)
                return res.status(200).json(
                  {
                    message: 'Auth successful',
                    token
                  }
                )
              } else {
                console.log("NOT A MATCH")
                res.status(401).json({message: "Email/Password incorrect"})
              }
            })
          })
        .catch( err => {
          console.log("OUTSIDE ERROR_")
          console.log(err);
          res.status(500).json({err})
        })
    },

      delete: (req, res) => {
        console.log("hitting delete");
        db.User.deleteOne({_id: req.params.userId}, (err, result) =>{
          if(err){return res.status(500).json({err})}
          res.status(200).json({result})
        })
      },

      getUserHistory: (req, res) => {
        db.User.findById(req.params.userId, (err, user) => {
          if(err){
            return res.status(500).json({err})
          }
          db.Entry.find({})
          .populate(
              {
                  path: 'author',
                  match: {_id: user._id}
              }
          )
          .exec((err, entries) => {
              if(err) return console.log(err);
              console.log(entries);
              entries = entries.filter((entry) => entry.author)
              res.render('/history', {currentUser: user, entries: entries});
          })
        }) 
      },
}