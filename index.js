require('now-env').config();

const express = require('express')
const app = express()
const Discogs = require('disconnect').Client;
const proxy = require('./app/proxy');

const getRandomInt = require('./app/util').getRandomInt;
const oAuth = require('./app/oauth');
let discStore = require('./app/disc-store');

let reqData, accData;

//fucking awesome way to clear the console each time the app re-launches
console.log('\033c');
console.info('WELCOME TO MEIN ZEIT');
discStore.load();

//all static crap goes into static
app.use('/static', express.static('static'));

//proxy to the discogs api.. 
app.use('/api', proxy.discogsProxy);


//the crap i do
app.get('/', function (req, res) {
    let discs = discStore.getDiscs();

    let html = `
    <h1>Random Discogs</h1><p>Sorry - got no image for you</p>
    `;

    console.log();

    //get randomImage from all discs
    if (discs.length > 0) {

        let image = discs[Math.floor(Math.random() * discs.length)].basic_information.cover_image;
        html = `
        <h1>Haaallo</h1><img src="${image}">
    `
    }

    res.send(html);


});


//the crap i do
app.get('/crap', function (req, res) {

    //TODO: RECURSIVELY FETCH ALL RELEASES & STORE BASIC INFO IN MEMORY
    //IF I HAVE THAT DB / FETCH RANDOM IMAGE FROM IT
    //EVEN CRAZIER PUT ALL IMAGES ON NOW SERVER TO SERVE FASTER
    //FIGURE OUT WHERE TO SPLIT SERVER & CLIENT APP

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
        discs = data.releases.map((release) => release.basic_information.cover_image);
        image = data.releases[getRandomInt(0, 100)].basic_information.cover_image;

        res.send(`
                <h1>Haaallo</h1><img src="${image}">
            `);

    });
});

//oAuth
app.get('/authorize', oAuth.authorize);
app.get('/callback', oAuth.callback);


//start up
app.listen(8080, function () {
    console.log('App started listening');
});
