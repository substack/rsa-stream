var ursa = require('ursa');
var toPEM = require('http-signature').sshKeyToPEM;
var inherits = require('inherits');
var BlockStream = require('block-stream');
var combine = require('stream-combiner');
var through = require('through2');

exports.encrypt = function (pub, opts) {
    if (!opts) opts = {};
    if (typeof pub !== 'string') pub = String(pub);
    if (/^ssh-\w+/.test(pub)) pub = toPEM(pub);
    
    var pubkey = ursa.createPublicKey(pub);
    var bufsize = pubkey.getModulus().length;
    var blocks = new BlockStream(bufsize - 42, { nopad: true });
    
    return combine(blocks, through(function (buf, e, next) {
        this.push(pubkey.encrypt(buf));
        next();
    }));
};

exports.decrypt = function (priv, opts) {
    if (!opts) opts = {};
    if (typeof priv !== 'string') priv = String(priv);
    if (/^ssh-\w+/.test(priv)) priv = toPEM(priv);
    
    var privkey = ursa.createPrivateKey(priv);
    var bufsize = privkey.getModulus().length;
    
    var blocks = new BlockStream(bufsize, { nopad: true });
    var decrypt = through(function (buf, e, next) {
        this.push(privkey.decrypt(buf));
        next();
    });
    return combine(blocks, decrypt);
};
