var EC  = require('elliptic').ec
var ec = new EC ('secp256k1')




var key = ec.genKeyPair();
//console.log(key);


var publicKey = key.getPublic().encode('hex');
console.log("PUBLIC FORM PRIVATE === " + publicKey);
console.log("              ");
var msg = [123,159,756,56,35,5,45];
var signature = key.sign(msg)
var dersign = signature.toDER();
//console.log(dersign);

var privateKey = key.getPrivate('hex')
console.log("PRIVATE KEYT|--->>> "+ privateKey);
console.log("              ");
var publicKey = key.getPublic('hex')
console.log("PUBLIC KEY |--->> " + publicKey);

console.log(key.verify(msg,dersign));
