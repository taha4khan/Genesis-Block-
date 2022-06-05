var sha256 = require('sha256')
var {v4:uuidv4}=require('uuid')
var EC = require ('elliptic').ec
var ec = new EC('secp256k1');

class Block {
    constructor(timestamp,transactions,nonce,prevHash,height){
        this.timestamp = timestamp
        this.transactions = transactions
        this.nonce = nonce
        this.prevHash = prevHash
        this.height = height
        this.hash = this.createHash(timestamp,transactions,nonce,prevHash,height)
    }

    createHash(timestamp,transactions,nonce,prevHash,height){
        //var nonce = this.proofOfWork(timestamp,transaction,prevHash);
        return sha256(timestamp+JSON.stringify(transactions)+nonce+prevHash+height)

    }

    static proofOfWork (timestamp,transactions,prevHash,height){
        var nonce = 0;
        var difficulty = "111"
        var success = true
        while(success){
            nonce++;
            var hash = sha256(timestamp+JSON.stringify(transactions)+nonce+prevHash+height)
            //shold open>-v
            //console.log(hash.slice(0,6));
            if (hash.slice(0,3) == difficulty){
                success = false;
                console.log("Hurry! We got Correct Nonce ---> "+ nonce);
            }
        }
        return nonce;
    }
}

class Transaction {
    constructor(fromAddress,toAddress,amount){
        this.txid = uuidv4().split('-').join("")
		this.from = fromAddress
		this.to = toAddress;
		this.amount = amount
		this.sign = null;
    }
}

class Blockchain{
    mempool=[]
    chain=[]
    constructor(){
        this.chain = [this.createGenesisBlock()];
        //this.mempool = [];
    }

    createGenesisBlock (){
        var time = Date.now().toString();
        var nonce = Block.proofOfWork(time,[],"0",1)
        var newblock = new Block(time,[],nonce,"0",1);
        console.log("'Genesis Block Created'");
        //this.mempool = []
        //reward transaction
        var rewardTx = new Transaction("0X00000","Ahmed",22)
        this.createTxAndSign("null",rewardTx)
        //this.createTx(0x00000,"taha",10)
        return newblock;
    }

    mineNewBlock(){
        var time = Date.now().toString();
        var prevhx = this .chain[this.chain.length-1].hash;
        var nonce = Block.proofOfWork(time,this.mempool,prevhx,this.chain.length+1)
        var newbloc = new Block(time,this.mempool,nonce,prevhx,this.chain.length+1)
        
        this.chain.push(newbloc)
        console.log("Hi ! We Got new blocknumber # " + (this.chain.length-1))
        //this.mempool = []
        //reward transaction
        var rewardTx = new Transaction("0X00000","Ahmed",22)
        console.log(rewardTx);
        this.createTxAndSign("null",rewardTx);
        // this.createTx(0x00000,"taha",78)
        
    }

    createTxAndSign (key,txObj){

        // var key = ec.genKeyPair();
        // // console.log(key);
        // var privateKey = key.getPrivate('hex')
        
        // console.log("privateKey -->" + privateKey)

        if(txObj.from != "0x00000"){
            var keyFromPriv = ec.keyFromPrivate(key,'hex');

            console.log("===============================");
            var publicKey = keyFromPriv.getPublic().encode('hex');
            console.log(publicKey);
                
			if(publicKey == txObj.from){
				var signTx = keyFromPriv.sign(JSON.stringify(txObj));
				var signatureHash = signTx.toDER();
				txObj.sign = signatureHash;
				this.mempool.push(txObj)
			}else{
				return "Invalid Signature"
			}
			
		}else{
			this.mempool.push(txObj)
        }
    }

    validateTx(txObj){
		var fromKey = txObj.from;
		var signhash = txObj.sign;

		var msg = txObj
		msg.sign = null
		var pubKey = ec.keyFromPublic(fromKey,'hex')
		return pubKey.verify(JSON.stringify(msg),signhash)
	}


    isChainValid(){
        var valid = true 
        if(this.chain[0].prevHash != "0" || this.chain[0].height != 1){
            return true;

        }
    console.log("this.chain");
    
        for (var i=1; i < this.chain.length ; i++){
            if (this.chain[i]?.height != i+1 ){
                console.log(this.chain[1].height);
                return false; 
            }
            if (this.chain[i-1].hash != this.chain[i].prevHash){
                    return false
            }
            if (this.chain[i].hash != sha256 (this.chain[i].timestamp+JSON.stringify(this.chain[i].transactions)+this.chain[i].nonce+this.chain[i].prevHash+this.chain[i].height)){
                return false
            }

        
        }
        return valid;
    }

    getTransactions(){
        var txs = [];

        for (var i=0; i<this.chain.length; i++){
            if(typeof(this.chain[i].transactions) != "undefined" && this.chain[i].transactions.length>0){
                console.log("We have some txs in block height --> " + this.chain[i].height);
                for (var j=0; j<this.chain[i].transactions.length; j++){
                    var tempTx = this.chain[i].transactions[j]
                    tempTx.blockHeightNO = this.chain[i].height;
                    tempTx.confirmations = this.chain.length -i;
                    txs.push(tempTx)
                }
            }
        }
        return txs;
    }
    getBalance(address){
        console.log(address)
        var txs=this.getTransactions();
    var balance=0;
    
        for (var i=0; i < txs.length; i++){
        
            if(txs[i].from==address){
                console.log(address);
                balance -=txs[i].amount;
            
            }else if(txs[i].to==address){
                balance = balance + txs[i].amount
            }
        
        }
        console.log("Current balance--> "+ balance );
        return balance;
    }
}

var newTx = new Transaction(
	"046b255d704a29dd65f3a0c807a916f7854725ba9b2ed3993759c4a800eb0e8948fdd36ffb609870bc0eae70738c915b5a034d91b4a936a3edf334be7e504c0635",
	"address2",
	10
);


// module.exports.Block = Block
// module.exports = Transaction
module.exports = {Blockchain,Transaction}

console.log("generate random string== " + uuidv4().split('-').join(""))

var xyzNetwork = new Blockchain();
xyzNetwork.createTxAndSign("532b3485dea67e51bdb97abad22a79a7d483fb35d7febe010bc76e04f9332aee",newTx)
console.log(xyzNetwork)
xyzNetwork.mineNewBlock()
xyzNetwork.createTxAndSign("haseeb1","anus2" ,3)
xyzNetwork.createTxAndSign("umair3","haris4" ,4)
//xyzNetwork.createTx("naim","adil" ,7)
// xyzNetwork.chain[2].transactions[0].from =="aqib"
console.log(xyzNetwork)
console.log("Is chain Valid ---> " + xyzNetwork.isChainValid())
console.log(xyzNetwork.getTransactions())
 
