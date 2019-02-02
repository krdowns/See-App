const db = require('../models');
require('dotenv').config();

const ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');

var toneAnalyzer = new ToneAnalyzerV3({
    version_date: '2019-01-25',
    iam_apikey: 'RHyP_uDitxEWTNpPIGXy3W3Wg-9x96n5MVwiX5alnQZr',
    url: 'https://gateway.watsonplatform.net/tone-analyzer/api'
  });

module.exports = {
    read: (req, res) => {
        db.Entry.find({})
        .populate('entry')
        .populate('author')
        .exec(function(err, allEntries){
            if(err) return console.log(err);
            res.json({'data': allEntries});
        })
    },

    create: (req, res) => {
        let post = req.body
        let text = post.content

        var toneParams = {
        tone_input: { 'text': text },
        content_type: 'application/json'
        };

        toneAnalyzer.tone(toneParams, function (error, toneAnalysis) {
        if (error) {
            console.log(error);
        } else { 
            post.watson = toneAnalysis
            db.Entry.create(post, (err, newEntry) => {
                if (err) {
                    return console.log(err);
                } 
                res.json(newEntry);
            })
        }
        });
    },

    update: (req,res) => {
        let entryId = req.params.id;
        let entry = req.body;
        db.Entry.findByIdAndUpdate({_id: entryId}, entry, (err, updatedEntry) => {
            if (err) { 
                return console.log(err);
            }
            res.json(updatedEntry);
        })
    },

    delete: (req, res) => {
        let entryId = req.params.id;
        db.Entry.findByIdAndDelete({_id: entryId}, (err, deletedEntry) => {
            if (err) {
                return console.log(err);
            }
            res.json(deletedEntry);
        })
    },

    
    filter: (req, res) => {
        entry.find({})
        .populate(
            {
                path: 'author',
                match: {_id: req.params.userId}
            }
        )
        .exec((err, entries) => {
            if(err) return console.log(err);
            console.log(entries);
            entries = entries.filter((entry) => entry.author)
            res.json(entries);
        })
    }
}