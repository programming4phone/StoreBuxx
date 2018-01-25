var StoreBuxx = artifacts.require("./StoreBuxx.sol");

contract('StoreBuxx', function(accounts) {
  it('wei to buxx test', function() {

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
        return _instance.wei2buxx.call(_etherPriceInPennies, _weiAmount, {from: accounts[0]});
    })
    .then(function(buxxInPennies) {
        _buxxInPennies = buxxInPennies.toNumber()
        console.log('     - buxxInPennies: ' + _buxxInPennies);
        assert.isOk((_buxxInPennies == _buxxAmount), 'buxxInPennies should be 5000');
    });
  });

  it('buxx to wei test', function() {

    var _totalSupplyOfBuxx = 100000000000;
    var _etherPriceInPennies = 100348;
    var _buxxAmountInPennies = 5000;
    var _weiAmount = 49826603420098100;
    console.log('     - owner: ' + accounts[0]);
    console.log('     - total supply: ' + _totalSupplyOfBuxx);
    console.log('     - ether price (in pennies): ' + _etherPriceInPennies);
    console.log('     - buxx amount (in pennies): ' + _buxxAmountInPennies);
    var _instance;
    var _buxxInWei;

    return StoreBuxx.new(accounts[0], _totalSupplyOfBuxx)
    .then(function(instance) {
        _instance = instance;
        return _instance.buxx2wei.call(_etherPriceInPennies, _buxxAmountInPennies, {from: accounts[0]});
    })
    .then(function(buxxInWei) {
        _buxxInWei = buxxInWei.toNumber()
        console.log('     - buxxInWei: ' + _buxxInWei);
        assert.isOk((_buxxInWei == _weiAmount), 'wei amount should be 49826603420098100');
    });
  });
});