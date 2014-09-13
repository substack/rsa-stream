var ursa = require('ursa');
var toPEM = require('ssh-key-to-pem');
var inherits = require('inherits');
var BlockStream = require('block-stream');
var combine = require('stream-combiner2');
var through = require('through2');
var defined = require('defined');

exports.encrypt = function (pub, opts) {
    if (!opts) opts = {};
    if (typeof pub !== 'string') pub = String(pub);
    if (/^ssh-\w+/.test(pub)) pub = toPEM(pub);
    
    var pubkey = ursa.createPublicKey(pub);
    var bufsize = pubkey.getModulus().length;
    var blocks = new BlockStream(bufsize - 42, { nopad: true });
    
    var limit = defined(opts.limit, 100);
    var len = 0;
    var enc = through(function (buf, e, next) {
        len += buf.length;
        if (len > limit) {
            var err = new Error(
                'Encryption limit (' + opts.limit + ' bytes) reached.\n'
                + 'It is not advisable to encrypt over (n/8-11) bytes with'
                + 'asymmetric crypto for an `n` byte key.\n'
                + 'Instead, encrypt a key data with asymmetric crypto for a '
                + 'symmetric encryption cipher.\n'
                + 'See also: http://stackoverflow.com/questions/5583379'
            );
            err.type = 'LIMIT';
            return this.emit('error', err);
        }
        this.push(pubkey.encrypt(buf));
        next();
    });
    
    if (opts.encoding === 'buffer' || opts.encoding === undefined) {
        return combine(blocks, enc);
    }
    return combine(blocks, enc, through({ encoding: opts.encoding }));
};

exports.decrypt = function (priv, opts) {
    if (!opts) opts = {};
    if (typeof priv !== 'string') priv = String(priv);
    if (/^ssh-\w+/.test(priv)) priv = toPEM(priv);
    
    var privkey = ursa.createPrivateKey(priv);
    var bufsize = privkey.getModulus().length;
    
    var blocks = new BlockStream(bufsize, { nopad: true });
    var decrypt = through(function (buf, e, next) {
        var ciphertext
        try {
          ciphertext = privkey.decrypt(buf)
        } catch (err) {
          return this.emit('error', err)
        }
        this.push(ciphertext);        
        next();
    });
    if (opts.encoding === 'buffer' || opts.encoding === undefined) {
        return combine(blocks, decrypt);
    }
    var b64decode = through(function (buf, e, next) {
        this.push(Buffer(buf.toString(), opts.encoding));
    });
    return combine(b64decode, blocks, decrypt);
};
