var express = require('express');

var EthereumWallet = require('../lib/ethereum_wallet');
var EthereumConnection = require('../lib/ethereum_connection');
var IzxCharity = require('../lib/contracts/izx_charity');

var router = express.Router();

router.use(function timeLog(req, res, next) {
    next();
});


router.post('/', function(req, res, next) {

    var wallet = new EthereumWallet();
    var euthereum = new EthereumConnection(wallet);
    var charity_contract = new IzxCharity(euthereum);


    var token = req.body.token;
    var wallet = req.body.wallet;
    var required_amount = req.body.required_amount;
    var name = req.body.name;
    var description = req.body.description;
    var image_url = req.body.image_url;
    var site_url = req.body.site_url;

    var arg_abi = charity_contract.constructor_args(token, wallet, required_amount, name, description, image_url, site_url);

    console.log("New IzxCharity with token "+token+" -> wallet "+wallet+" amt: "+required_amount+ " ABI: "+ arg_abi);

    charity_contract.deploy(token, wallet, required_amount, name, description, image_url, site_url,

        function(error, contract){
        euthereum.engine.stop();
        if(error || contract==undefined){
            res.json({
                error: String(error)
            } );
        }else{
            res.json({
                address: contract.address,
                hash: contract.transactionHash,
                constructor_abi: arg_abi
            } );
        }

            setTimeout(function(){  }, 3000);
    });



});

module.exports = router;
