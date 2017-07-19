const Web3 = require('web3');
const ProviderEngine = require('web3-provider-engine')
const FiltersSubprovider = require('web3-provider-engine/subproviders/filters.js');
const WalletSubprovider = require('web3-provider-engine/subproviders/wallet.js');
const Web3Subprovider = require("web3-provider-engine/subproviders/web3.js");

var EthereumConnection = function(wallet) {

    const provider_url = 'http://node1.izx.io:18555';

    this.engine = new ProviderEngine();

    if(wallet){
        this.wallet = wallet.wallet;
        this.engine.addProvider(new WalletSubprovider(this.wallet, {}));
        this.address = wallet.address;
    }

    this.engine.addProvider(new FiltersSubprovider());
    this.engine.addProvider(new Web3Subprovider(new Web3.providers.HttpProvider(provider_url)));

    this.engine.start();
    this.web3 = new Web3(this.engine);

    if(this.address){
        this.web3.eth.defaultAccount = this.address;
    }

};

module.exports = EthereumConnection;
