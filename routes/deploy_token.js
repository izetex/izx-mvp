var express = require('express');

var EthereumConnection = require('../lib/ethereum_connection');
var IzxToken = require('../lib/contracts/izx_token');

var router = express.Router();


router.use(function timeLog(req, res, next) {
    next();
});


router.get('/', function(req, res, next) {

    var euthereum = new EthereumConnection();
    var token = new IzxToken(euthereum);

    token.deploy(10000, 'IZX token',2, 'IZX', function(error, contract){

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
