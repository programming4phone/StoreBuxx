var StoreBuxx = artifacts.require("./StoreBuxx.sol");

contract('StoreBuxx', function(accounts) {
  it('purchase buxx test', function() {

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
        return _instance.purchase(_etherPriceInPennies, {value: _weiAmount, from: accounts[6]});
    })
    .then(function(result) {
        //event Purchased(address _customer, uint256 _weiAmount, uint256 _buxxAmount);
        console.log('     - purchase result: ' + result);
        for (let i = 0; i < result.logs.length; i++) {
           var log = result.logs[i];
           if (log.event === 'Purchased') {

            var customer = log.args._customer;
            console.log('     - Purchased event log.args._customer: ' + customer);
            assert.isOk((accounts[6] == customer), "Purchase customer incorrect address");

            var weiAmount = log.args._weiAmount;
            console.log('     - Purchased event log.args._weiAmount: ' + weiAmount);
            assert.isOk((_weiAmount == weiAmount), "Purchase customer incorrect weiAmount");

            var buxxAmount = log.args._buxxAmount;
            console.log('     - Purchased event log.args._buxxAmount: ' + buxxAmount);
            assert.isOk((_buxxAmount == buxxAmount), "Purchase customer incorrect buxxAmount");
            break;
           }
       }
       return _instance.balanceOf.call(accounts[6]); 
    })
    .then(function(value) {
        var customerBalance = value;
        console.log('     - ' + accounts[6] + ' balanceOf: ' + customerBalance);
        assert.isOk((_buxxAmount == customerBalance), "Purchase customer incorrect balanceOf");
        return _instance.balanceOf.call(accounts[0]);
    })
    .then(function(value) {
        var ownerBalance = value;
        console.log('     - ' + accounts[0] + ' balanceOf: ' + ownerBalance);
        var _ownerBalance = _totalSupplyOfBuxx - _buxxAmount;
        assert.isOk((_ownerBalance == ownerBalance), "Purchase owner incorrect balanceOf");
    });
  });
});