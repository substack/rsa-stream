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
    var enc = opts.encoding || 'binary';
    if (enc === 'binary') enc = undefined;
    
    var pubkey = ursa.createPublicKey(pub);
    var bufsize = pubkey.getModulus().length;
    var blocks = new BlockStream(bufsize - 42);
    
    return combine(blocks, through(function (buf, e, next) {
        this.push(pubkey.encrypt(buf, undefined, enc));
        next();
    }));
};

exports.decrypt = function (priv, opts) {
    if (!opts) opts = {};
    if (typeof priv !== 'string') priv = String(priv);
    if (/^ssh-\w+/.test(priv)) priv = toPEM(priv);
    var enc = opts.encoding || 'binary';
    
    var privkey = ursa.createPrivateKey(priv);
    var bufsize = privkey.getModulus().length;
    
    var blocks = new BlockStream(bufsize);
    var decrypt = through(function (buf, e, next) {
        this.push(privkey.decrypt(buf));
        next();
    });
    
    if (enc === 'binary') {
        return combine(blocks, decrypt);
    }
    
    var decode = through(function (buf, e, next) {
        this.push(Buffer(buf.toString(), enc));
        next();
    });
    return combine(decode, blocks, decrypt);
};
