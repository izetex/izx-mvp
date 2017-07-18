const Web3 = require('web3');
const ProviderEngine = require('web3-provider-engine')
const FiltersSubprovider = require('web3-provider-engine/subproviders/filters.js');
//var WalletSubprovider = require('web3-provider-engine/subproviders/wallet.js');
const Web3Subprovider = require("web3-provider-engine/subproviders/web3.js");



var EthereumConnection = function() {

    const mnemonic = 'satisfy test used phone glue air pyramid aerobic heavy nation moon syrup';
    const address = '0xc6333447926f047bc972ad53add8ae8dd963537c';
    const provider_url = 'http://node1.izx.io:8545';


    this.address = address;

    this.engine = new ProviderEngine();

    // this.engine.addProvider(new WalletSubprovider(this.wallet, {}));
    this.engine.addProvider(new FiltersSubprovider());
    this.engine.addProvider(new Web3Subprovider(new Web3.providers.HttpProvider(provider_url)));

    this.engine.start();
    this.web3 = new Web3(this.engine);


};


module.exports = EthereumConnection;
