var express = require('express');

var EthereumWallet = require('../lib/ethereum_wallet');
var EthereumConnection = require('../lib/ethereum_connection');
var IzxToken = require('../lib/contracts/izx_token');

var router = express.Router();


router.use(function timeLog(req, res, next) {
    next();
});


router.post('/:pkey/:address', function(req, res, next) {

    var pkey = req.params.pkey;
    var address = req.params.address;
    var amount = req.body.amount;

    var wallet = new EthereumWallet({ pkey: pkey});
    var euthereum = new EthereumConnection(wallet);
    var izx_token = new IzxToken(euthereum);

    console.log("Transfer "+amount+"IZX "+ wallet.address +" -> "+address);

    izx_token.contract.transfer.sendTransaction( address, amount, { from: wallet.address, gas: '100000'},
        function(error, result){
            euthereum.engine.stop();
            console.log(error, result);
            if(error || !result) {
                res.json({
                    error: String(error)
                } );
            }else{
                res.json({
                    address: address,
                    amount: amount,
                    result: result
                } );
            }


        }
    );


});

module.exports = router;
