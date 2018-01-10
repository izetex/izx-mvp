var express = require('express');

var EthereumWallet = require('../lib/ethereum_wallet');
var EthereumConnection = require('../lib/ethereum_connection');
var Controller = require('../lib/contracts/proxy_controller');

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
    var controller = new Controller(euthereum);

    console.log("generate tokens "+amount+" DRIVE's by owner "+ wallet.address +" -> "+address);

    controller.contract.generateTokens.sendTransaction( address, amount, { from: wallet.address, gas: '200000'},
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
