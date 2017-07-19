const bip39 = require('bip39');
var hdkey = require('ethereumjs-wallet/hdkey');
var ethereumjs_wallet = require('ethereumjs-wallet');

var EthereumWallet = function(data) {

    if(data && data.pkey){
        this.wallet = ethereumjs_wallet.fromPrivateKey(Buffer.from(data.pkey, 'hex'));
    }else{

        const mnemonic = 'satisfy test used phone glue air pyramid aerobic heavy nation moon syrup';
        const address_index = 0;

        this.hdwallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic));

        this.wallet_hdpath = "m/44'/60'/0'/0/";
        this.wallet = this.hdwallet.derivePath(this.wallet_hdpath + address_index).getWallet();

    }

    if(this.wallet){
        this.address = "0x" + this.wallet.getAddress().toString("hex");
    }

};

module.exports = EthereumWallet;