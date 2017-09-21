QuantstampSale.deployed().then(function(instance){q=instance});
QuantstampToken.deployed().then(function(instance){t=instance});
acc = web3.eth.accounts


contract = QuantstampSale.at(QuantstampSale.address);
var event = contract.TokenAddressEvent();
event.watch(function(err, result){ console.log(result.args) });
