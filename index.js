const express = require('express')
require('now-env').config();
const app = express()
var Discogs = require('disconnect').Client;
let image, reqData, accData;

//fucking awesome way to clear the console each time the app re-launches
console.log('\033c');
console.info('WELCOME TO MEIN ZEIT');

var db = new Discogs(accData).database();


/*

{ method: 'oauth',
  level: 2,
  consumerKey: 'ePSerhfKqYsfWecXUWtJ',
  consumerSecret: 'lJHCOSEnCOEakHBqXIJCmLrUGtSEurLz',
  token: 'EPUKEAzRFAGaJJQrDlENKtUGXSZqxIRFDGzCgbFJ',
  tokenSecret: 'AVKoONNecLnuwzgIJAhliPqvFhRfarSwWUSxSuLk' }

  */

//all static crap goes into static
app.use('/static', express.static('static'));

app.get('/', function (req, res) {

    var col = new Discogs({
        method: 'oauth',
        level: 2,
        consumerKey: 'ePSerhfKqYsfWecXUWtJ',
        consumerSecret: 'lJHCOSEnCOEakHBqXIJCmLrUGtSEurLz',
        token: 'EPUKEAzRFAGaJJQrDlENKtUGXSZqxIRFDGzCgbFJ',
        tokenSecret: 'AVKoONNecLnuwzgIJAhliPqvFhRfarSwWUSxSuLk'
    }).user().collection();
    col.getReleases('wim82', 39994, {
        page: 1,
        per_page: 100
    }, function (err, data) {
        console.log('err,', err);
        console.log(data);
        console.log(data.releases[2].basic_information);
        image = data.releases[3].basic_information.cover_image;

        var html = `
        <h1>Haaallo</h1><img src="${image}">
        `;

        res.send(html);

    });



});


app.get('/authorize', function (req, res) {
    console.log('gonna redirect to', req.get('host').replace(/localhost/g, '127.0.0.1') + '/callback');
    var oAuth = new Discogs().oauth();
    oAuth.getRequestToken(
        process.env.CONSUMER_KEY,
        process.env.CONSUMER_SECRET,
        req.protocol + '://' + req.get('host').replace(/localhost/g, '127.0.0.1') + '/callback',
        function (err, requestData) {
            // Persist "requestData" here so that the callback handler can 
            // access it later after returning from the authorize url
            reqData = requestData;
            res.redirect(requestData.authorizeUrl);
        }
    );
});


app.get('/callback', function (req, res) {
    console.log('goddamn please work !');
    var oAuth = new Discogs(reqData).oauth();
    oAuth.getAccessToken(
        req.query.oauth_verifier, // Verification code sent back by Discogs
        function (err, accessData) {
            // Persist "accessData" here for following OAuth calls 
            accData = accessData;
            console.log(accessData);
            res.send('Received access token!');
        }
    );
});



app.listen(8080, function () {
    console.log('App started listening');
})
