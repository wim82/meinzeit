//imports
const Discogs = require('disconnect').Client;

//exports
module.exports.authorize = authorize;
module.exports.callback = callback;

//implementation
let reqData, accData;


function authorize(req, res) {

    var oAuth = new Discogs().oauth();
    oAuth.getRequestToken(
        process.env.CONSUMER_KEY,
        process.env.CONSUMER_SECRET,
        //make localhost work
        req.protocol + '://' + req.get('host').replace(/localhost/g, '127.0.0.1') + '/callback',
        function (err, requestData) {
            // Persist "requestData" here so that the callback handler can 
            // access it later after returning from the authorize url
            reqData = requestData;
            res.redirect(requestData.authorizeUrl);
        }
    );
}


function callback(req, res) {
    var oAuth = new Discogs(reqData).oauth();
    oAuth.getAccessToken(
        req.query.oauth_verifier, // Verification code sent back by Discogs
        function (err, accessData) {
            // Persist "accessData" here for following OAuth calls 
            accData = accessData;
            res.send('Received access token!');
        }
    );
}


//documentation
/*

{ method: 'oauth',
  level: 2,
  consumerKey: 'ePSerhfKqYsfWecXUWtJ',
  consumerSecret: 'lJHCOSEnCOEakHBqXIJCmLrUGtSEurLz',
  token: 'EPUKEAzRFAGaJJQrDlENKtUGXSZqxIRFDGzCgbFJ',
  tokenSecret: 'AVKoONNecLnuwzgIJAhliPqvFhRfarSwWUSxSuLk' }

  http://127.0.0.1:8080/api/database/search?q=Nirvana

  pathRewrite: {
        '^/api/old-path' : '/api/new-path',     // rewrite path
        '^/api/remove/path' : '/path'           // remove base path
    },

  */
