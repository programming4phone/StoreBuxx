var StoreBuxx = artifacts.require("./StoreBuxx.sol");

contract('StoreBuxx', function(accounts) {
  it('credit buxx test', function() {

    var _totalSupplyOfBuxx = 100000000000;
    var _etherPriceInPennies = 100348;
    var _weiAmount = 49826603420098100;
    var _buxxAmount = 5000;
    var _creditAmount = 2500;
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
        console.log('     - credit ');
        return _instance.credit(accounts[6], _creditAmount, {from: accounts[0]});
    })
    .then(function(result) {
        //event Credited(address _customer, uint256 _buxxAmount, uint256 _newBalance);
        console.log('     - credit result: ' + result);
        for (let i = 0; i < result.logs.length; i++) {
           var log = result.logs[i];
           if (log.event === 'Credited') {

            var customer = log.args._customer;
            console.log('     - Credited event log.args._customer: ' + customer);
            assert.isOk((accounts[6] == customer), "Credit customer incorrect address");

            var buxxAmount = log.args._buxxAmount;
            console.log('     - Credited event log.args._buxxAmount: ' + buxxAmount);
            assert.isOk((_creditAmount == buxxAmount), "Credit customer incorrect redemption amount");            
            
            var newBalance = log.args._newBalance;
            console.log('     - Credited event log.args._newBalance: ' + newBalance);
            assert.isOk(((_buxxAmount + _creditAmount) == newBalance), "Credit customer incorrect new balance");
            break;
           }
       }
    });
  });
});