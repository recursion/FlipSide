var cex = require('coinbase-exchange'); 

// so we may want to instantiate different instances of this
// object so that we can connect to multiple exchanges at once
// could this be as simple as passing in the config we need to use
// when requiring it?
module.exports = function(config){
  'use strict';
  return new cex.AuthenticatedClient(config.key, config.b64secret, config.passphrase, config.uri);
};
