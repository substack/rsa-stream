var rsa = require('../');
var fs = require('fs');
var pubkey = fs.readFileSync(process.argv[2], 'utf8');

var enc = rsa.encrypt(pubkey, { encoding: 'base64' });
process.stdin.pipe(enc).pipe(process.stdout);
