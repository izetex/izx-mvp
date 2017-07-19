var express = require('express');

var EthereumWallet = require('../lib/ethereum_wallet');

var router = express.Router();


router.use(function timeLog(req, res, next) {
    next();
});


router.get('/:seed', function(req, res, next) {

    var seed = req.params.seed;

    console.log("Generate new from seed "+seed);

    var wallet = new EthereumWallet({ seed: seed });
    res.json({
                    pk: wallet.getPrivateKey(),
                    address: wallet.address
                } );

});

module.exports = router;
