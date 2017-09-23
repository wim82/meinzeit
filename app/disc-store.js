const Discogs = require('disconnect').Client;
let collection, discs = [];

module.exports.getDiscs = () => discs;

module.exports.load = () => {
    collection = new Discogs({
        method: 'oauth',
        level: 2,
        consumerKey: 'ePSerhfKqYsfWecXUWtJ',
        consumerSecret: 'lJHCOSEnCOEakHBqXIJCmLrUGtSEurLz',
        token: 'EPUKEAzRFAGaJJQrDlENKtUGXSZqxIRFDGzCgbFJ',
        tokenSecret: 'AVKoONNecLnuwzgIJAhliPqvFhRfarSwWUSxSuLk'
    }).user().collection();

    fetchDiscsFromPage(1);
    console.log('i have loaded');

}



function fetchDiscsFromPage(pageNumber) {
    collection.getReleases('wim82', 39994, {
        page: pageNumber,
        per_page: 100
    }).then(data => {
        console.log('done fetching page', pageNumber);
        discs = discs.concat(data.releases);

    }).catch(err => console.log(err));
}
