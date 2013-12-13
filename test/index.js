
var fs = require('fs')
var rsa = require('../')
var path = require('path')
var through = require('through2')
var crypto = require('crypto')

//ASYMMETRIC CRYPTO IS VERY SERIOUS, SO USE CAPSLOCK.
var PRIVATE = fs.readFileSync(path.join(__dirname, 'test-id_rsa'))
var PUBLIC  = fs.readFileSync(path.join(__dirname, 'test-id_rsa.pub'))
var WRONG   = fs.readFileSync(path.join(__dirname, 'wrong-id_rsa'))


function hashStream () {
  var hash = crypto.createHash('sha1')
  return through(function (data, enc, next) {
    hash.update(data, enc)
    this.push(data, enc)
    next()
  }, function (next) {
    this.shasum = hash.digest('hex')
    this.push(null)
    next()
  })
}


var plaintextIn = hashStream()
var ciphertext = hashStream()
var plaintextOut = hashStream()

var tape = require('tape')

tape('encrypt and decrypt the readme', function (t) {

  fs.createReadStream(path.join(__dirname, '..', 'readme.markdown'))
    .pipe(plaintextIn)
    .pipe(rsa.encrypt(PUBLIC))
    .pipe(ciphertext)
    .pipe(rsa.decrypt(PRIVATE))
    .pipe(plaintextOut)
    .on('end', function () {
      t.equal(plaintextIn.shasum, plaintextOut.shasum, 'plaintexts are equal')
      //TODO:
      //some way to test for good randomness? (but that is another module)
      t.notEqual(plaintextIn.shasum, ciphertext.shasum, 'ciphertext is different')
      t.end()
    })
    .resume()

})

tape('emit error on stream if the input is not valid', function (t) {
  t.plan(1)
  fs.createReadStream(path.join(__dirname, '..', 'readme.markdown'))
    .pipe(rsa.decrypt(PRIVATE))
    .on('error', function (err) {
      t.ok(err)
      t.end()
    })
    .resume()
})

tape('emit error if you attempt to decode a message that is not for you', function (t) {
  t.plan(1)
  fs.createReadStream(path.join(__dirname, '..', 'readme.markdown'))
    .pipe(rsa.encrypt(PUBLIC))
    .pipe(rsa.decrypt(WRONG))
    .on('error', function (err) {
      t.ok(err)
      t.end()
    })
    .resume()

})
