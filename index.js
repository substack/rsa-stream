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
    var enc = opts.encoding || 'base64';
    
    var pubkey = ursa.createPublicKey(pub);
    var bufsize = pubkey.getModulus().length - 42;
    
    return combine(new BlockStream(bufsize), through(function (buf) {
        this.push(pubkey.encrypt(buf, undefined, enc));
    }));
};
