var test = require('tape')
var rsa = require('../')

var fs = require('fs')
var path = require('path')

var through = require('through2')
var crypto = require('crypto')
var concat = require('concat-stream');

var files = {
    private: fs.readFileSync(path.join(__dirname, 'files', 'private')),
    public: fs.readFileSync(path.join(__dirname, 'files', 'public'))
};

test('over limit', function (t) {
    t.plan(1);
    var msg = Array(100+1).join('A');
    var enc = rsa.encrypt(files.public);
    enc.on('error', function (err) {
        t.equal(err.type, 'LIMIT');
    });
    enc.end(msg);
});

test('under limit', function (t) {
    t.plan(1);
    var msg = Array(99+1).join('A');
    var enc = rsa.encrypt(files.public);
    var dec = rsa.decrypt(files.private);
    dec.pipe(concat(function (body) {
        t.equal(body.toString('utf8'), msg);
    }));
    enc.on('error', function (err) {
        t.fail(err);
    });
    enc.pipe(dec);
    enc.end(msg);
});
