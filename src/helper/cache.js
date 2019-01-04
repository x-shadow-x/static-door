const crypto = require('crypto');

function setHash(rs, cb) {
    let hash = crypto.createHash('md5');
    let hex;

    rs.on('data', chunk => {
        hash.update(chunk);
    });

    rs.on('end', function() {
        hex = hash.digest('hex');
        cb(hex);
    });
}
function setCache(rs, conf, states, req, res, cb) {
    res.setHeader('Cache-Control', `max-age=${conf.maxAge}`);
    res.setHeader('Last-Modified', states.mtime.getTime());
    setHash(rs, (hex) => {
        res.setHeader('Etag', hex);
        const lastModified = req.headers['if-modified-since'];
        const eTag = req.headers['if-none-match'];
        let isFresh = false;
        if(!lastModified && !eTag) {
            isFresh = true;
        } else if(eTag && eTag === hex) {
            console.info('eTag:', eTag);
            isFresh = false;
        } else if(!eTag && lastModified && lastModified === states.mtime) {
            isFresh = false;
        } else {
            isFresh = true;
        }
        cb(isFresh);
    });
}

module.exports = (rs, conf, states, req, res, cb) => {
    setCache(rs, conf, states, req, res, cb);
};
