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

    var euthereum = new EthereumConnection();
    var izx_token = new IzxToken(euthereum);

    izx_token.contract.balanceOf.call( address,
        function(error, result){
            res.json({
                address: address,
                izx: result,
                error: error

            } )
            euthereum.engine.stop();
        }
    );


});

module.exports = router;
