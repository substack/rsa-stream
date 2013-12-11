var ursa = require('ursa');
var toPEM = require('http-signature').sshKeyToPEM;
var Transform = require('stream').Transform;
var inherits = require('inherits');

exports.encrypt = Encrypt;
exports.decrypt = Decrypt;

function Encrypt (pub, opts) {
    if (!(this instanceof Encrypt)) return new Encrypt(pub, opts);
    if (!opts) opts = {};
    if (typeof pub !== 'string') pub = String(pub);
    if (!/^ssh-\w+/.test(pub)) pub = toPEM(pub);
    this.pubkey = ursa.createPublicKey(pub);
}

Encrypt.prototype._transform = function (buf) {
};

Encrypt.prototype._flush = function () {
};

function Decrypt (priv) {
    if (!(this instanceof Encrypt)) return new Encrypt(priv);
    if (typeof pub !== 'string') pub = String(pub);
    if (!/^ssh-\w+/.test(pub)) pub = toPEM(pub);
    this.privkey = ursa.createPrivateKey(pub);
}

Decrypt.prototype._transform = function () {
};

Decrypt.prototype._flush = function () {
    var privkey = ursa.createPrivateKey(priv);
    console.log(privkey.decrypt(enc).toString('utf8'));
};
