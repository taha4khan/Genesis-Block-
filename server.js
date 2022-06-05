var express = require ('express')
var network = require ('./main')

var app = express();

var myBlockchain = new network.Blockchain()

app.get("/init",(req,res)=>{
	console.log("Blockchain Started!!")
	myBlockchain = new network.Blockchain();
	console.log(myBlockchain)
	res.send(myBlockchain)
});



app.get("/mine",(req,res)=>{
	myBlockchain.mineNewBlock()
	res.send("Mined Successfully");
})

app.get("/getAllBlocks",(req,res)=>{
	res.send(myBlockchain.chain);
})

app.get("/crTx",(req,res)=>{
    myBlockchain.createTxAndSign()
    res.send("Tx Successfull");
    
})

app.get("/transaction",(req,res)=>{
    res.send(myBlockchain.getTransactions());

})

app.get("/balance",(req,res)=>{
    myBlockchain.getBalance()
    res.send("Updated Recent Balance")
})

app.listen(5003,()=>{
	console.log("Server started at port 5003")
}); 