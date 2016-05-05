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

// MongoClient.connect("mongodb://meet:helloworld@ds015902.mlab.com:15902/meetuniv", function(err, db) {
//   if(!err) {
//     console.log("We are connected");
//   }
// });


var url = "mongodb://meet:helloworld@ds015902.mlab.com:15902/meetuniv";
app.set('port', (3000));
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
  console.log(req.body);

     MongoClient.connect(url, function(err, db) {
    // assert.equal(null, err);
    console.log("Connected correctly to server");


    var collection = db.collection('meetuniv');
    collection.insertOne({'data':req.body}, function(err, result) { console.log('Hello');
    });
}); 
  // Process the Facebook updates here
  res.sendStatus(200);
});

app.post('/instagram', function(req, res) {
  console.log('Instagram request body:');
  console.log(req.body);
  // Process the Instagram updates here
  res.sendStatus(200);
});

app.listen();