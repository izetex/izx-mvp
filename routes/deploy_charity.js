var express = require('express');

var EthereumWallet = require('../lib/ethereum_wallet');
var EthereumConnection = require('../lib/ethereum_connection');
var IzxCharityNetwork = require('../lib/contracts/izx_charity_network');

var router = express.Router();

router.use(function timeLog(req, res, next) {
    next();
});


router.get('/', function(req, res, next) {

    var wallet = new EthereumWallet();
    var euthereum = new EthereumConnection(wallet);
    var token = new IzxCharityNetwork(euthereum);

    token.deploy(function(error, contract){

        if(error || contract==undefined){
            res.json({
                error: String(error)
            } );
        }else{
            res.json({
                address: contract.address,
                hash: contract.transactionHash
            } );
        }

        euthereum.engine.stop();
    });




});

module.exports = router;
