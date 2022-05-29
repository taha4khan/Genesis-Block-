var sha256 = require('sha256')

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
        //
        return sha256(timestamp+JSON.stringify(transactions)+nonce+prevHash+height)

    }

    static proofOfWork (timestamp,transactions,prevHash,height){
        var nonce = 0;
        var difficulty = "1111"
        var success = true
        while(success){
            nonce++;
            var hash = sha256(timestamp+JSON.stringify(transactions)+nonce+prevHash+height)
            
            if (hash.slice(0,4) == difficulty ){
                success = false;
                console.log("Hurry! We got Correct Nonce ---> "+ nonce);
            }
        }
        return nonce;
    }

}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.mempool = [];
    }

    createGenesisBlock (){
        var time = Date.now().toString();
        var nonce = Block.proofOfWork(time,this.mempool,"0",1)
        var newblock = new Block(time,this.mempool,nonce,"0",1);
        this.mempool = []
        return newblock;
    }

    mineNewBlock(){
        var time = Date.now().toString();
        var prevhx = this .chain[this.chain.length-1].hash;
        var nonce = Block.proofOfWork(time,this.mempool,nonce,prevhx,this.chain.length+1)
        var newbloc = new Block(time,this.mempool,nonce,prevhx,this.chain.length+1)
        this.chain.push(newbloc)
        console.log("Hi ! We Got new blocknumber # " + (this.chain.length-1))
        this.mempool = []
    }

    createTx (fromAddress, toAddress, value){
        var tx = {"from" : fromAddress, "to":toAddress , "amount":value}
        this.mempool.push(tx)
    }

    isChainValid(){
        var valid = true 
        if(this.chain[0].prevHash != "0" || this.chain[0].height != 1){
            return false;

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

}

var xyzNetwork = new Blockchain();
xyzNetwork.mineNewBlock()


xyzNetwork.createTx("address1","address2" ,123)
xyzNetwork.createTx("address2","address3", 543)

xyzNetwork.mineNewBlock()
//
//xyzNetwork.chain[2].transactions[0].from ="affan"
console.log(xyzNetwork)
console.log("Is chain Valid ---> " + xyzNetwork.isChainValid())