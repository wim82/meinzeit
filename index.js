require('now-env').config();

const express = require('express');
const app = express();
const path = require('path');
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

app.get('/random', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(discStore.getRandomDiscs(10));
});

//the crap i do
app.get('crap/', function (req, res) {
    let discs = discStore.getDiscs();

    let html = `
    <h1>Random Discogs</h1><p>Sorry - got no image for you</p>
    `;

    //get randomImage from all discs
    if (discs.length > 0) {
        let record = discs[Math.floor(Math.random() * discs.length)];
        console.log(record.basic_information);
        let image = record.basic_information.cover_image;
        let artist = record.basic_information.artists
            .reduce((artist, item, index, arr) => {
                var join = arr.length - 1 !== index ? item.join : '';
                return artist + item.name + ' ' + join + ' ';
            }, '');
        let title = record.basic_information.title;

        html =
            `
            <!DOCTYPE html>
            <html lang="en">
            
            <head>
                <title></title>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <style>
                    body {
                        margin: 0;
                        padding: 0;
                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
                    }
            
                    @keyframes colorchange {
                        0% {
                            background: lightgray;
                        }
                        50% {
                            background: aliceblue;
                        }
                        100% {
                            background: lightgray;
                        }
                    }
            
                    .grid {
                        display: flex;
                        flex-direction: column;
                        padding: 0;
                        padding: 10px 20px;
                    }
            
                    .page-title {
                        width: 100%;
                        max-height: 64px;
                        margin: 0;
                        padding: 10px 0;
                    }
            
                    .record-cover {
                        width: 100%;
                        display: flex;
                        flex: 1 1 auto;
                        height: 340px;
                    }
            
                    .record-cover>img {
                        object-position: 0% 0%;
                        object-fit: contain;
                        max-height: 340px;
                        max-width: 100%;
                        background-color: lightgray;
                        animation: colorchange 5s infinite;
                    }
            
                    .details ul {
                        list-style: none;
                        padding: 20px 0;
                        position: relative;
                    }
            
                    .details ul:before {
                        content: '';
                        width: 20vw;
                        height: 1px;
                        background: lightgray;
                        position: absolute;
                        top: 5px;
                    }
            
                    .details .artist {
                        font-weight: 100;
                        font-size: 1.5em;
                    }
            
                    .details .title {
                        font-weight: 300;
                        font-size: 1.5em;
                    }
                </style>
                <script>
                    function removeBackgroundColor() {
                        document.querySelector('.record-cover>img').style.animation = 'none';
                        document.querySelector('.record-cover>img').style.backgroundColor = 'transparent';
                    }
            
                    function loadNewImage() {
                        console.log('need to load a new image');
                        location.reload();
                    }
                </script>
            </head>
            
            <body>
                <div class="grid">
                    <h1 class="page-title">Records</h1>
                    <div class="record-cover" ontouchstart="loadNewImage();">
                        <img width="340px" id="c" onload="removeBackgroundColor();" src="${image}"">
                    </div>
                    <div class="details">
                        <ul>
                        <li class="title">${title}</li>
                        <li class="artist">${artist}</li>
                        </ul>
                    </div>
                </div>
            </body>
            
            </html>
            
            `
    }

    res.send(html);


});


app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});


//oAuth; not really used at the moment, but good for later.
app.get('/authorize', oAuth.authorize);
app.get('/callback', oAuth.callback);


//start up
app.listen(8080, function () {
    console.log('App started listening');
});
