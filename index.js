/**
 * Copyright 2016-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var request = require('request');

// MongoClient.connect("mongodb://meet:helloworld@ds015902.mlab.com:15902/meetuniv", function(err, db) {
//   if(!err) {
//     console.log("We are connected");
//   }
// });


var url = "mongodb://meet:helloworld@ds015902.mlab.com:15902/meetuniv";
app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'));

app.use(bodyParser.json());

app.get('/', function(req, res) {
  // console.log(req);
  res.send('It works!');
     MongoClient.connect(url, function(err, db) {
    // assert.equal(null, err);
    console.log("Connected correctly to server");


    var collection = db.collection('meetuniv');
    collection.insertOne({'hit':'some'}, function(err, result) { console.log('Hello');
    });
}); 
});

app.get(['/facebook', '/instagram'], function(req, res) {
  if (
    req.param('hub.mode') == 'subscribe' &&
    req.param('hub.verify_token') == 'token'
  ) {
    res.send(req.param('hub.challenge'));
  } else {
    res.sendStatus(400);
  }
});

app.post('/facebook', function(req, res) {
  console.log('Facebook request body:');
  // console.log(req.body);
    userData = req.body;
    if (userData.entry[0].changes[0].value.item == 'post') {
    console.log(userData.entry[0].changes[0].value.message);
    var userPost = userData.entry[0].changes[0].value.message;
    var post = userData.entry[0].changes[0].value;
    // var userPost = userData.entry.changes[0].value.message;
    // console.log(userPost);

     MongoClient.connect(url, function(err, db) {
    // assert.equal(null, err);
    console.log("Connected correctly to server");

    request({
    url: 'https://graph.facebook.com/'+post.post_id+'/comments', //URL to hit
  
    method: 'POST',
    //Lets post the following key/values as form
    json: {
      message: 'Hello '+post.sender_id+' we are currently working on it will get back to you asap.',
      access_token : 'EAAJS5MRqGFwBAPbdUI7UrSbzgLtfMOdgcCe9wxjNoAk4ZAukus5mgh5ouM89HXZAZCrIgwDFL3ioFY7DhJow1uZCYhDLnuOVZCxyf4hB1FvZAZBZAtNSZCrtuu33UvzOhXzyvpZCWrHTVMlGcOgepnsDUiMQQov2RMkTUZD' 
 
    }
  }, function(error, response, body){
    if(error) {
      console.log(error);
    } else {
      console.log(response.statusCode, body);
    }
  });
    var collection = db.collection('meetuniv');
    collection.insertOne({'userPost':userPost,'id':post.post_id,'sender_id':post.sender_id,'test':post}, function(err, result) { console.log('Hello');
    });
}); 

     }else{

       MongoClient.connect(url, function(err, db) {
 
    var collection = db.collection('meetuniv');
    collection.insertOne({'data':req.body}, function(err, result) { console.log('Hello');
    });
}); 
     }


//   // Process the Facebook updates here
  res.sendStatus(200);
});

app.post('/instagram', function(req, res) {
  console.log('Instagram request body:');
  console.log(req.body);
  // Process the Instagram updates here
  res.sendStatus(200);
});

// regex : (?<= )\w\w\w\w\w\w++|\w\w(?=%)|\w++(?= <)|\w\w\w\w(?= \w++ \w++ )
//  regex 1 : \w\w\w\w\w\w\w\w|\w++(?= with)|\w\d|(?<=% \w\w\w\w )\w++|icse

app.listen();