var express = require('express');

var EthereumWallet = require('../lib/ethereum_wallet');
var EthereumConnection = require('../lib/ethereum_connection');

var router = express.Router();


router.use(function timeLog(req, res, next) {
    next();
});


router.get('/', function(req, res, next) {

    var wallet = new EthereumWallet();
    var euthereum = new EthereumConnection(wallet);

    euthereum.web3.eth.getBalance( euthereum.address,
        function(error, result){
            res.json({
                address: euthereum.address,
                balance: euthereum.web3.fromWei(result),
                error: error

            } )
            euthereum.engine.stop();
        }
    );


});

module.exports = router;
