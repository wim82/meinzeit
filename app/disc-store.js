const Discogs = require('disconnect').Client;
let collection, discs = [];

module.exports.getDiscs = () => discs;

module.exports.getRandomDiscs = (amount) => {
    let randomDiscs = [];

    while (amount > 0) {
        let record = discs[Math.floor(Math.random() * discs.length)];
        let image = record.basic_information.cover_image;
        let artist = record.basic_information.artists
            .reduce((artist, item, index, arr) => {
                var join = arr.length - 1 !== index ? item.join : '';
                return artist + item.name + ' ' + join + ' ';
            }, '');
        let title = record.basic_information.title;
        let randomRecord = {
            artist: artist,
            title: title,
            image: image,
        }

        randomDiscs.push(randomRecord);
        amount--;
    }
    console.log('gonna return', randomDiscs);
    return randomDiscs;

}

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
