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
    var bufsize = pubkey.getModulus().length - 42;
    
    return combine(new BlockStream(bufsize), through(function (buf) {
        this.push(pubkey.encrypt(buf, undefined, enc));
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
    var decrypt = through(function (buf) {
        this.push(privkey.decrypt(buf));
    });
    
    if (enc === 'binary') {
        return combine(blocks, decrypt);
    }
    
    var decode = through(function (buf) {
        this.push(Buffer(buf.toString(), enc));
    });
    return combine(decode, blocks, decrypt);
};
