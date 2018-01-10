var Conf = function(){
    switch(process.env.NODE_ENV){
        case 'production':
            return {
                eth_url: 'https://ropsten.infura.io'
            };
        default:
            return {
                eth_url: 'https://ropsten.infura.io'
            };
    }
};
module.exports = Conf;