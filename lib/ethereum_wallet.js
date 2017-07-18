const bip39 = require('bip39');
var hdkey = require('ethereumjs-wallet/hdkey');

var EthereumWallet = function() {

    const mnemonic = 'satisfy test used phone glue air pyramid aerobic heavy nation moon syrup';
    const address_index = 0;

    this.hdwallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic));

    this.wallet_hdpath = "m/44'/60'/0'/0/";
    this.wallet = this.hdwallet.derivePath(this.wallet_hdpath + address_index).getWallet();
    this.address = "0x" + this.wallet.getAddress().toString("hex");

};

module.exports = EthereumWallet;