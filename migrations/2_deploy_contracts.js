var StoreBuxx = artifacts.require("./StoreBuxx.sol");

module.exports = function(deployer) {
    const _owner = '0x627306090abaB3A6e1400e9345bC60c78a8BEf57';
    const _totalSupply = 500000000000;
    deployer.deploy(StoreBuxx, _owner, _totalSupply);
};
