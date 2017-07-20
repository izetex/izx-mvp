var express = require('express');

var EthereumWallet = require('../lib/ethereum_wallet');
var EthereumConnection = require('../lib/ethereum_connection');
var IzxToken = require('../lib/contracts/izx_token');

var router = express.Router();


router.use(function timeLog(req, res, next) {
    next();
});


router.get('/:address', function(req, res, next) {

    var address = req.params.address;
    var amount = req.query.amount;

    console.log("Mint "+amount+" -> "+address);

    var wallet = new EthereumWallet();
    var euthereum = new EthereumConnection(wallet);
    var izx_token = new IzxToken(euthereum);

    izx_token.contract.mintToken.sendTransaction( address, amount, { from: wallet.address, gas: '100000'},
        function(error, result){

            console.log(error, result);
            if(error || !result) {
                res.json({
                    error: String(error)
                } );
            }else{
                res.json({
                    address: address,
                    amount: amount,
                    hash: result
                } );
            }
            euthereum.engine.stop();
        }
    );


});

module.exports = router;
