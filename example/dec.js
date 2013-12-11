var rsa = require('../');
var fs = require('fs');
var privkey = fs.readFileSync(process.argv[2], 'utf8');

var dec = rsa.decrypt(privkey, { encoding: 'base64' });
process.stdin.pipe(dec).pipe(process.stdout);
