var StoreBuxx = artifacts.require("./StoreBuxx.sol");

contract('StoreBuxx', function(accounts) {
  it('halt buxx test', function() {

    var _totalSupplyOfBuxx = 100000000000;
    var _etherPriceInPennies = 100348;
    var _weiAmount = 49826603420098100;
    var _buxxAmount = 5000;
    console.log('     - owner: ' + accounts[0]);
    console.log('     - total supply: ' + _totalSupplyOfBuxx);
    console.log('     - ether price (in pennies): ' + _etherPriceInPennies);
    console.log('     - wei amount: ' + _weiAmount);
    var _instance;
    var _buxxInPennies;

    return StoreBuxx.new(accounts[0], _totalSupplyOfBuxx)
    .then(function(instance) {
        _instance = instance;
        console.log('     - halt');
        return _instance.halt({ from: accounts[0]});
    })
    .then(function(result) {
        //event Halted(address _owner);
        console.log('     - halt result: ' + result);
        for (let i = 0; i < result.logs.length; i++) {
           var log = result.logs[i];
           if (log.event === 'Halted') {

            var owner = log.args._owner;
            console.log('     - Halted event log.args._owner: ' + owner);
            assert.isOk((accounts[0] == owner), "Halt owner incorrect address");
            break;
           }
       }
       console.log('     - purchase');
       return _instance.purchase(_etherPriceInPennies, {value: _weiAmount, from: accounts[6]}); 
    })
    .then(function(result) {
        console.log('     - purchase result: ' + result);
        assert.isOk(!(result), "Purchase did not fail after halt");
    })
    .catch(function(err) {
        // Easily catch all errors along the whole execution.
        console.log('     - Error: ' + err.message);
        assert.isOk((err), "Halt error does not exist");
      });
  });
});