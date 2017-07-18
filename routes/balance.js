var express = require('express');

var Web3 = require('web3');
var HDWalletProvider = require("truffle-hdwallet-provider");

var router = express.Router();

var provider, web3;

var mnemonic = 'satisfy test used phone glue air pyramid aerobic heavy nation moon syrup';


router.use(function timeLog(req, res, next) {
    provider = new HDWalletProvider(mnemonic, "http://node1.izx.io:8545");
    web3 = new Web3(provider);
    next();
});


router.get('/', function(req, res, next) {

    web3.eth.getBalance( provider.address,
        function(error, result){
            res.json({
                address: provider.address,
                balance: web3.fromWei(result),
                error: error

            } )
        }
    );


});

module.exports = router;
