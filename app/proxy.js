//imports
const proxy = require('http-proxy-middleware');

//exports
module.exports.discogsProxy = discogsProxy();

//implementation
function discogsProxy() {
    return proxy({
        target: 'https://api.discogs.com', // target host
        changeOrigin: true, // needed for virtual hosted sites
        pathRewrite: {
            '^/api': '' // remove base path
        },
        headers: {
            Authorization: 'Discogs token=' + process.env.DISCOGS_TOKEN
        }
    })
};
