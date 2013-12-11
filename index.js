var ursa = require('ursa');
var toPEM = require('http-signature').sshKeyToPEM;
var Duplex = require('stream').Duplex;
var inherits = require('inherits');

exports.encrypt = Encrypt;
exports.decrypt = Decrypt;

inherits(Encrypt, Duplex);
inherits(Decrypt, Duplex);

function Encrypt (pub) {
    if (!(this instanceof Encrypt)) return new Encrypt(pub);
    Duplex.call(this);
    
    if (typeof pub !== 'string') pub = String(pub);
    if (/^ssh-\w+/.test(pub)) pub = toPEM(pub);
    this.pubkey = ursa.createPublicKey(pub);
    this.bufsize = this.pubkey.getModulus().length;
    this._buffer = [];
    this._pending = 0;
}

Encrypt.prototype._write = function (buf, enc, next) {
    console.log(buf);
    if (this._pending) {
    }
};

Encrypt.prototype._read = function (size) {
};

function Decrypt (priv) {
    if (!(this instanceof Encrypt)) return new Encrypt(priv);
    Duplex.call(this);
    
    if (typeof pub !== 'string') pub = String(pub);
    if (/^ssh-\w+/.test(pub)) pub = toPEM(pub);
    this.privkey = ursa.createPrivateKey(pub);
}

Decrypt.prototype._transform = function () {
};

Decrypt.prototype._flush = function () {
    var privkey = ursa.createPrivateKey(priv);
    //console.log(privkey.decrypt(enc).toString('utf8'));
};
