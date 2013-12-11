# rsa-stream

RSA encrypt/decrypt streams

# example

## encrypt

``` js
var rsa = require('rsa-stream');
var fs = require('fs');
var pubkey = fs.readFileSync(process.argv[2], 'utf8');

var enc = rsa.encrypt(pubkey, { encoding: 'base64' });
process.stdin.pipe(enc).pipe(process.stdout);
```

output:

```
$ echo beep boop | node enc.js ~/.ssh/id_rsa.pub
t1Lytqy7CoONohuzIDxoGpErAK4vN9xKWWO/IK4yH/2PvAOIldSAdNg/HhiAWg5PAPwCTSIfINYlpNSQgkw3kK/GtaeEIpAdRnlHh6wNzBcbT7L7R+EZthWzPKpPE9IO0tPM5kBpN8SDr16Z6PC0OxK5ArJAqmbv8hiWzjS384dMYcyYrK6Z0cUawkC2oeZhBf5z6ev1OLTesPF71evJSTIFD3XlbksziAgYIS4CAG+Gwx0avmHwJHnHuvAr/wY3FcVYc4788tmS1YVmRAPrqg/0UoGglnLaSR1DdOJNgw5y/oErlBxXtMV6jEjWLi8XK2hZiKk/ecA921Fx+483zw==
```

## decrypt

``` js
var rsa = require('rsa-stream');
var fs = require('fs');
var privkey = fs.readFileSync(process.argv[2], 'utf8');

var dec = rsa.decrypt(privkey, { encoding: 'base64' });
process.stdin.pipe(dec).pipe(process.stdout);
```

output:

```
$ echo beep boop | node enc.js ~/.ssh/id_rsa.pub | node dec.js ~/.ssh/id_rsa
Enter PEM pass phrase:
beep boop
```

# methods

``` js
var rsa = require('rsa-stream')
```

## var enc = rsa.encrypt(publicKey, opts)

Return an encryption stream `enc` that will encrypt the data written to it with
the given `publicKey` and output the encrypted stream with `opts.encoding`
('binary' buffers by default).

`publicKey` should be a string or buffer with PEM key data or the openssh-style
public keys typically found in ~/.ssh that begin with `/^ssh-rsa\b/`

## var dec = rsa.decrypt(privateKey, opts)

Return a decryption stream `dec` that will decrypt the data written to it in
`opts.encoding` format with the given `privateKey`.

`privateKey` should be a string or buffer with PEM or openssh-style
`/^ssh-rsa\b/` data.

# install

To get the library, with [npm](https://npmjs.org) do:

```
npm install rsa-stream
```

# license

MIT
