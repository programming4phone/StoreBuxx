pragma solidity ^0.4.18;

contract StoreBuxx  {

    address internal owner;
    uint256 public totalSupply;
    mapping (address => uint256) public balances;
    bool internal suspended;
    
    modifier onlyOwner() { require(msg.sender == owner); _; }

    function StoreBuxx(address _owner, uint256 _totalSupply) public {
        owner = _owner;
        balances[owner] = _totalSupply;               
        totalSupply = _totalSupply;                      
        suspended = false;
    }

    /// @notice convert wei to USD based on ether price
    function wei2buxx(uint256 _etherPrice, uint256 _weiAmount) public pure returns (uint256) {
        uint256 buxxAmount = (_weiAmount * _etherPrice) / 1 ether;
        return buxxAmount;
    }

    /// @notice convert USD to wei based on ether price
    /// @dev Do not use! may experience rounding issues, exact results may be off by a few wei
    function buxx2wei(uint256 _etherPrice, uint256 _buxxAmount) public pure returns (uint256) {
        uint256 weiAmount = (_buxxAmount * 1 ether) / _etherPrice;
        return weiAmount;
    }

    event Purchased(address _customer, uint256 _weiAmount, uint256 _buxxAmount);

    /// @notice Invoked by customer to purchase Store Buxx. The incoming payable wei
    /// is converted to the number of Store Buxx based on the provided price of Ether.
    /// The value of a single Store Buck is approximately 1 cent in USD. 
    /// The customer's balance is increased and the store owner's balance is decreased.
    /// This function terminates if purchases are suspended.
    /// This function fires the `Purchased` event upon successful completion.
    /// @param etherPrice Current price of ether
    /// @return true if the function was successful 
    function purchase(uint256 etherPrice) public payable returns (bool success) {
        require(suspended == false);
        uint256 buxxAmount = (msg.value * etherPrice) / 1 ether;
        require(balances[owner] >= buxxAmount);
        balances[msg.sender] += buxxAmount;
        balances[owner] -= buxxAmount;
        owner.transfer(msg.value);
        Purchased(msg.sender, msg.value, buxxAmount);
        return true;
    }

    event Redeemed(address _customer, uint256 _buxxAmount, uint256 _newBalance);

    /// @notice Invoked by store owner for customer redemption of Store Buxx.
    /// The customer's balance is decreased and the store owner's balance is increased.
    /// The value of a single Store Buck is approximately 1 cent in USD. This function
    /// The function terminates if the customer's balance contains insufficient funds 
    /// to complete the redemeption.
    /// This function fires the `Redeemed` event upon successful completion.
    /// @param customer Account number of the customer
    /// @param buxxAmount Number of StoreBuxx redeemed
    /// @return true if the function was successful 
    function redeem(address customer, uint256 buxxAmount) public onlyOwner returns (bool success) {
        require(balances[customer] >= buxxAmount);
        balances[owner] += buxxAmount;
        balances[customer] -= buxxAmount;
        Redeemed(customer, buxxAmount, balances[customer]);
        return true;
    }

    event Credited(address _customer, uint256 _buxxAmount, uint256 _newBalance);

    /// @notice Invoked by store owner for in store credit of Store Buxx.
    /// The customer's balance is increased and the store owner's balance is decreased.
    /// This function fires the `Credited` event upon successful completion.
    /// @param customer Account number of the customer
    /// @param buxxAmount Number of StoreBuxx credited
    /// @return true if the function was successful 
    function credit(address customer, uint256 buxxAmount) public onlyOwner returns (bool success) {
        require(balances[owner] >= buxxAmount);
        balances[customer] += buxxAmount;
        balances[owner] -= buxxAmount;
        Credited(customer, buxxAmount, balances[customer]);
        return true;
    }

    /// @notice Check customer balance of Store Buxx.
    /// @param customer Account number of the customer
    /// @return Number of StoreBuxx owned by the customer
    function balanceOf(address customer) public view returns (uint256 balance) {
        return balances[customer];
    }


    event Halted(address _owner);

    /// @notice Invoked by owner to halt purchases in case of major Ether price drop.
    /// This function fires the `Halted` event upon successful completion.
    function halt() public onlyOwner {
        suspended = true;
        Halted(owner);
    }

    event Resumed(address _owner);

    /// @notice Invoked by owner to resume purchases.
    /// This function fires the `Resumed` event upon successful completion.
    function resume() public onlyOwner {
        suspended = false;
        Resumed(owner);
    } 

    /// @notice Kill the EarnestMoney contract instance which removes it from the blockchain. 
    /// This function can only be executed by the owner.
    function kill() public onlyOwner {
        selfdestruct(owner);
    }
}