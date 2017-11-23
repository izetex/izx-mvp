var Conf = function(){
    switch(process.env.NODE_ENV){
        case 'production':
            return {
                eth_url: 'http://node1.izx.io:18555'
            };
        default:
            return {
                eth_url: 'http://node1.ph2:18555'
            };
    }
};
module.exports = Conf;