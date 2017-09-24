const Discogs = require('disconnect').Client;
let collection, discs = [];

module.exports.getDiscs = () => discs;

module.exports.load = async() => {
    collection = new Discogs({
        userToken: process.env.DISCOGS_TOKEN
    }).user().collection();

    let getMore = true;
    let pageNumber = 1;
    //limiting pageNumber to 50 to make really sure i don't spin off into an endless loop.
    while (getMore && pageNumber < 50) {
        getMore = await fetchDiscsFromPage(pageNumber++);
    }

    console.info('Loaded', discs.length, 'records');
}

function fetchDiscsFromPage(pageNumber) {
    return collection.getReleases('wim82', 39994, {
        page: pageNumber,
        per_page: 100
    }).then(data => {
        //storing discs in memory
        discs = discs.concat(data.releases);
        return data.pagination.urls.next;
    }).catch(err => console.log(err));
}
