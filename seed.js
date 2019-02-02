const db = require("./models");


var entry_list = [

        
    ];
  
  
var user_list = [

    ];  
  
// SEED ENTRIES
    db.Entry.remove({}, function(err, entry) {
        console.log('removed all entries');
        db.Entry.create(entry_list, function(err, savedEntries){
            if(err){
                console.log(err);
                return;
            }
            console.log("seeding entries");
            console.log("create", entry_list.length, "entries");
        })
    });

// SEED USERS
    db.User.remove({}, function(err, user) {
    console.log('removed all users');
    db.User.create(user_list, function(err, savedUsers){
            if(err){
                console.log(err);
                return;
            }
            console.log("seeding users");
            console.log("create", user_list.length, "users");
        })
    });