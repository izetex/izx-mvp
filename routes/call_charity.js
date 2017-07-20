var express = require('express');

var EthereumWallet = require('../lib/ethereum_wallet');
var EthereumConnection = require('../lib/ethereum_connection');
var IzxCharity = require('../lib/contracts/izx_charity');

var router = express.Router();


router.use(function timeLog(req, res, next) {
    next();
});


router.post('/:method/:address', function(req, res, next) {

    const contract_method = req.params.method;
    const contract_address = req.params.address;

    const wallet = new EthereumWallet();
    const euthereum = new EthereumConnection(wallet);
    const izx_charity = new IzxCharity(euthereum);
    const contract = euthereum.web3.eth.contract(izx_charity.abi).at(contract_address);

    const callback = function(error, result){
        console.log(error, result);
        if(error) {
            res.json({
                error: String(error)
            } );
        }else{
            res.json({
                hash: result
            } );
        }
        euthereum.engine.stop();
    }

    const options = { from: wallet.address, gas: '500000'};

    switch (contract_method) {
        case "accept_donation":
            contract.accept_donation.sendTransaction( req.body.donator,
                                               req.body.donated_amount,
                                               req.body.transaction_hash, options, callback);
            break;
        case "transfer_donation":
            contract.transfer_donation.sendTransaction( req.body.donation_index,
                req.body.transaction_hash, options, callback);
            break;
        case "return_donation":
            contract.return_donation.sendTransaction( req.body.donation_index,
                req.body.transaction_hash, options, callback);
            break;
        default:
            callback("Unknown contract_method:"+contract_method);
    }



});


router.get('/:method/:address', function(req, res, next) {

    const contract_method = req.params.method;
    const contract_address = req.params.address;

    const euthereum = new EthereumConnection();
    const izx_charity = new IzxCharity(euthereum);
    const contract = euthereum.web3.eth.contract(izx_charity.abi).at(contract_address);

    const callback = function(error, result){
        console.log(error, result);
        if(error) {
            res.json({
                error: String(error)
            } );
        }else{
            res.json({
                return: result
            } );
        }
        euthereum.engine.stop();
    }

    switch (contract_method) {
        case "last_donation":
            contract.last_donation.call(callback);
            break;
        case "donation":
            contract.donation.call(req.query.donation_index, callback);
            break;
        case "donations_num":
            contract.donations_num.call(callback);
            break;
        case "remaining_amount":
            contract.remaining_amount.call(callback);
            break;
        case "collected_amount":
            contract.collected_amount.call(callback);
            break;
        case "transfered_amount":
            contract.transfered_amount.call(callback);
            break;
        case "name":
            contract.name.call(callback);
            break;
        case "token":
            contract.token.call(callback);
            break;
        case "wallet":
            contract.wallet.call(callback);
            break;
        case "required_amount":
            contract.required_amount.call(callback);
            break;
        case "description":
            contract.description.call(callback);
            break;
        case "image_url":
            contract.image_url.call(callback);
            break;
        case "site_url":
            contract.site_url.call(callback);
            break;
        default:
            callback("Unknown contract_method:"+contract_method);
    }


});


module.exports = router;
