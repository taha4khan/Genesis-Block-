var EC  = require('elliptic').ec
var ec = new EC ('secp256k1')

var key = ec.genKeyPair();
console.log(key);
console.log();

var publicKey = key.getPublic().encode('hex');
console.log(publicKey);

var msg = [123,159,756,56,35,5,45];
var signature = key.sign(msg)
var dersign = signature.toDER();
console.log(dersign);


console.log(key.verify(msg,dersign));
