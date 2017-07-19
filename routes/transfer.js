var express = require('express');

var EthereumWallet = require('../lib/ethereum_wallet');
var EthereumConnection = require('../lib/ethereum_connection');
var IzxToken = require('../lib/contracts/izx_token');

var router = express.Router();


router.use(function timeLog(req, res, next) {
    next();
});


router.get('/:pkey/:address', function(req, res, next) {

    var pkey = req.params.pkey;
    var address = req.params.address;
    var amount = req.query.amount;


    var wallet = new EthereumWallet({ pkey: pkey});
    var euthereum = new EthereumConnection(wallet);
    var izx_token = new IzxToken(euthereum);

    console.log("Transfer "+amount+" "+ wallet.address +" -> "+address);

    izx_token.contract.transfer.sendTransaction( address, amount, { from: wallet.address, gas: '4700000'},
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
                    result: result
                } );
            }

            euthereum.engine.stop();
        }
    );


});

module.exports = router;
