var express = require('express');

var EthereumWallet = require('../lib/ethereum_wallet');
var EthereumConnection = require('../lib/ethereum_connection');

var router = express.Router();


router.use(function timeLog(req, res, next) {
    next();
});


router.post('/:address', function(req, res, next) {

    var address = req.params.address;
    var amount = req.body.amount;

    var wallet = new EthereumWallet();
    var euthereum = new EthereumConnection(wallet);

    console.log("Transfer "+amount+"ETH "+ wallet.address +" -> "+address);



    euthereum.web3.eth.sendTransaction( { from: wallet.address, to: address, value: euthereum.web3.toWei(amount), gas: '100000'},
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
