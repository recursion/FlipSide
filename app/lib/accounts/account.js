var cex = require('coinbase-exchange'); 

// load accounts

// account loader?
// iterate through credentials (files/db/however they are stored)

  // create an object with the filename and the values

// export an account data and tools object
// takes an object with the info needed to connect to the exchange
module.exports = function(accountCredentials){
  'use strict';
  
  // create an object that allows us to make authed calls to the exchange
  var authedClient = new cex.AuthenticatedClient(accountCredentials.key, accountCredentials.b64secret, accountCredentials.passphrase, accountCredentials.uri);

  // a wallet holds a currency
  // CBex has 4 wallets: USD, GBP, EUR, BTC
  var wallets = {};

  // an account could have all sorts of orders
  // most likely we will want to store this in some other way
  var orders = {};
  var ordersList = [];
  
  // add order info to orders object
  var addOrder = function(order) {
    // only push this order if we dont have it
    if (ordersList.indexOf(order) === -1){
      ordersList.push(order);
    }
    orders[order.id] = order;
  };

  var updateOrders = function(){
    authedClient.getOrders({}, function(err, res, data) {
      for (var order in data){
        addOrder(data[order]);
      }
    });
  };

  // usd, gbp, eur, btc - each wallet contains data about itself
  // updates an accounts currency wallet info
  // currently takes a callback that runs at completion
  var updateWallets = function(){

    // getAccounts returns an array of 'wallets' for each currency
    authedClient.getAccounts(function(err, res, data){
      // TODO: error handling

      // iterate through the array(each element is a 'wallet' object)
      data.forEach(function(wallet, index, array){

        // create the wallet if it doesnt exist yet
        if (!wallets[wallet.currency]){
          wallets[wallet.currency] = {};
        }

        // copy returned data into our local wallet data
        for (var key in wallet){
          if(wallet.hasOwnProperty(key)){
            wallets[wallet.currency][key] = wallet[key];
          }
        }
      });
    });
  };

  var update = function(done){
    updateWallets();
    updateOrders();
    done();
  };

  var sell = function(price, size){
    var sellParams = {
      'price': price, // USD 
      'size': size,  // BTC 
      'product_id': 'BTC-USD',
    };
    authedClient.sell(sellParams, function(err, res, data){
      console.log('Recieved: ',  err, data, ' as sell response'); 
    }); 
  };
  var buy = function(price, size) {
    var buyParams = {
      'price': price, // USD 
      'size': size,  // BTC 
      'product_id': 'BTC-USD',
    };
    console.log(buyParams);
    authedClient.buy(buyParams, function(err, res, data){
      console.log('Recieved: ', err, data, ' as buy response'); 
    }); 
 
  };

  // return an object of useful account data and tools
  return {
    buy: buy,
    sell: sell,
    wallets: wallets,
    orders: orders,
    ordersList: ordersList,
    update: update,
  };// end of return obj
}; // end of module.exports functin
