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

    if(req.query.token){
        var izx_token = new IzxToken(euthereum);

        izx_token.contract.balanceOf.call( address,
            function(error, result){

                if(error || !result) {
                    res.json({
                        error: String(error)
                    } );
                }else{
                    res.json({
                        address: address,
                        izx: result
                    } );
                }
                euthereum.engine.stop();
            }
        );
    }else{
        euthereum.web3.eth.getBalance(address,
            function(error, result){

                if(error || !result) {
                    res.json({
                        error: String(error)
                    } );
                }else{
                    res.json({
                        address: address,
                        eth: euthereum.web3.fromWei(result)
                    } );
                }
                euthereum.engine.stop();
            }
        )
    }



});

module.exports = router;
