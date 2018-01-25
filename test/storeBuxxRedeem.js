var StoreBuxx = artifacts.require("./StoreBuxx.sol");

contract('StoreBuxx', function(accounts) {
  it('redeem buxx test', function() {

    var _totalSupplyOfBuxx = 100000000000;
    var _etherPriceInPennies = 100348;
    var _weiAmount = 49826603420098100;
    var _buxxAmount = 5000;
    var _redemptionAmount = 2500;
    console.log('     - owner: ' + accounts[0]);
    console.log('     - total supply: ' + _totalSupplyOfBuxx);
    console.log('     - ether price (in pennies): ' + _etherPriceInPennies);
    console.log('     - wei amount: ' + _weiAmount);
    var _instance;
    var _buxxInPennies;

    return StoreBuxx.new(accounts[0], _totalSupplyOfBuxx)
    .then(function(instance) {
        _instance = instance;
        console.log('     - purchase ');
        return _instance.purchase(_etherPriceInPennies, {value: _weiAmount, from: accounts[6]});
    })
    .then(function(result) {
        console.log('     - redeem ');
        return _instance.redeem(accounts[6], _redemptionAmount, {from: accounts[0]});
    })
    .then(function(result) {
        //event Redeemed(address _customer, uint256 _buxxAmount, uint256 _newBalance);
        console.log('     - redeem result: ' + result);
        for (let i = 0; i < result.logs.length; i++) {
           var log = result.logs[i];
           if (log.event === 'Redeemed') {

            var customer = log.args._customer;
            console.log('     - Redeemed event log.args._customer: ' + customer);
            assert.isOk((accounts[6] == customer), "Redeem customer incorrect address");

            var buxxAmount = log.args._buxxAmount;
            console.log('     - Redeemed event log.args._buxxAmount: ' + buxxAmount);
            assert.isOk((_redemptionAmount == buxxAmount), "Redeem customer incorrect redemption amount");            
            
            var newBalance = log.args._newBalance;
            console.log('     - Redeemed event log.args._newBalance: ' + newBalance);
            assert.isOk(((_buxxAmount - _redemptionAmount) == newBalance), "Redeem customer incorrect new balance");
            break;
           }
       }
    });
  });
});