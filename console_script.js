migrate --reset ;
Quantstamp.deployed().then(function(instance){q=instance});
contract = Quantstamp.at(Quantstamp.address);
var event = contract.TokenAddressEvent();
event.watch(function(err, result){ console.log(result.args) });
