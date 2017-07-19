pragma solidity ^0.4.10;

contract Owned {

    address public owner;

    function Owned() {
        owner = msg.sender;
    }

    modifier owner_only {
        require (msg.sender == owner);
        _;
    }

    function transferOwnership(address newOwner) owner_only {
        owner = newOwner;
    }
}

contract tokenRecipient { function receiveApproval(address _from, uint256 _value, address _token, bytes _extraData); }


contract StandardToken {
    uint256 public totalSupply;
    function balanceOf(address _owner) constant returns (uint256 balance);
    function transfer(address _to, uint256 _value);
    function transferFrom(address _from, address _to, uint256 _value) returns (bool success);
    function approve(address _spender, uint256 _value) returns (bool success);
    function allowance(address _owner, address _spender) constant returns (uint256 remaining);
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
}

contract IzxToken is Owned, StandardToken{
    /* Public variables of the token */
    string public standard = 'Token 0.1';
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;

    /* This creates an array with all balances */
    mapping (address => uint256) public balanceOf;
    mapping (address => mapping (address => uint256)) public allowance;


    /* Initializes contract with initial supply tokens to the creator of the contract */
    function IzxToken(
        uint256 initialSupply,
        string tokenName,
        uint8 decimalUnits,
        string tokenSymbol
        ) {
        balanceOf[msg.sender] = initialSupply;              // Give the creator all initial tokens
        totalSupply = initialSupply;                        // Update total supply
        name = tokenName;                                   // Set the name for display purposes
        symbol = tokenSymbol;                               // Set the symbol for display purposes
        decimals = decimalUnits;                            // Amount of decimals for display purposes
    }

    function balanceOf(address _owner) constant returns (uint256 balance) {
        return balanceOf[_owner];
    }


    function allowance(address _owner, address _spender) constant returns (uint256 remaining) {
      return allowance[_owner][_spender];
    }

    /* Send coins */
    function transfer(address _to, uint256 _value) {
        require (_to != 0x0);                               // Prevent transfer to 0x0 address. Use burn() instead
        require (balanceOf[msg.sender] >= _value);           // Check if the sender has enough
        require (balanceOf[_to] + _value >= balanceOf[_to]); // Check for overflows
        balanceOf[msg.sender] -= _value;                     // Subtract from the sender
        balanceOf[_to] += _value;                            // Add the same to the recipient
        Transfer(msg.sender, _to, _value);                   // Notify anyone listening that this transfer took place
    }

    /* Allow another contract to spend some tokens in your behalf */
    function approve(address _spender, uint256 _value)
        returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        Approval(msg.sender, _spender, _value);
        return true;
    }

    /* Approve and then communicate the approved contract in a single tx */
    function approveAndCall(address _spender, uint256 _value, bytes _extraData)
        returns (bool success) {
        tokenRecipient spender = tokenRecipient(_spender);
        if (approve(_spender, _value)) {
            spender.receiveApproval(msg.sender, _value, this, _extraData);
            return true;
        }
    }

    /* A contract attempts to get the coins */
    function transferFrom(address _from, address _to, uint256 _value) returns (bool success) {
        require (_to != 0x0);                                // Prevent transfer to 0x0 address. Use burn() instead
        require (balanceOf[_from] >= _value);                 // Check if the sender has enough
        require (balanceOf[_to] + _value >= balanceOf[_to]);  // Check for overflows
        require (_value <= allowance[_from][msg.sender]);     // Check allowance
        balanceOf[_from] -= _value;                           // Subtract from the sender
        balanceOf[_to] += _value;                             // Add the same to the recipient
        allowance[_from][msg.sender] -= _value;
        Transfer(_from, _to, _value);
        return true;
    }


    function mintToken(address target, uint256 mintedAmount) owner_only {
        balanceOf[target] += mintedAmount;
        totalSupply += mintedAmount;
        Transfer(0, owner, mintedAmount);
        Transfer(owner, target, mintedAmount);
    }


}

contract Charity {

    function last_donation() constant
            returns(address donator,  uint amount, uint timestamp, bool transfered, bool returned);

    function donation(uint donation_index) constant
            returns(address donator,  uint amount, uint timestamp, bool transfered, bool returned);

    function remaining_amount() constant returns(uint256 remaining);

    function collected_amount() constant returns(uint256 collected);

    function transfered_amount() constant returns(uint256 transfered);

    function donate( uint256 amount) returns(uint index, uint256  donated_amount);

    function transfer_donations() returns(uint256 amount);

    function return_donations() returns(uint256 amount);

}

contract IzxCharity is Owned, Charity {

    struct Donation {
        address     donator;
        uint256     amount;
        uint        timestamp;
        bool        transfered;
        bool        returned;
    }

    IzxToken    public  token;
    address     public  wallet;
    uint256     public  required_amount;
    string      public  name;
    string      public  description;
    string      public  image_url;
    string      public  site_url;

    uint        public donations_num = 0;
    mapping(uint => Donation) donations;

    function IzxCharity(address _token, address _wallet, uint256 _required_amount,
    string _name, string _description, string _image_url, string _site_url){
        token = IzxToken(_token);
        wallet = _wallet;
        required_amount = _required_amount;
        name = _name;
        description = _description;
        image_url = _image_url;
        site_url = _site_url;
    }

    function last_donation() constant
            returns(address donator,  uint amount, uint timestamp, bool transfered, bool returned){
        Donation storage d = donations[donations_num-1];

        donator = d.donator;
        amount = d.amount;
        transfered = d.transfered;
        returned = d.returned;
        timestamp = d.timestamp;
    }

    function donation(uint donation_index) constant
            returns(address donator,  uint amount, uint timestamp, bool transfered, bool returned){
        require(donation_index<donations_num && donation_index>=0);
        Donation storage d = donations[donation_index];

        donator = d.donator;
        amount = d.amount;
        transfered = d.transfered;
        returned = d.returned;
        timestamp = d.timestamp;
    }

    function remaining_amount() constant returns(uint256 remaining){
        remaining = required_amount - collected_amount();
        return remaining;
    }

    function collected_amount() constant returns(uint256 collected){
        collected = 0;
        for(uint i=0;i<donations_num;i++){
                collected += donations[i].amount;
        }
        return collected;
    }

    function transfered_amount() constant returns(uint256 transfered){
        transfered = 0;
        for(uint i=0;i<donations_num;i++){
            if(donations[i].transfered){
                transfered += donations[i].amount;
            }
        }
        return transfered;
    }

    function donate( uint256 amount) returns(uint index, uint256  donated_amount){

        donated_amount = amount;

        if(donated_amount>remaining_amount()){
            donated_amount = remaining_amount();
        }

        require(donated_amount>0);

        var success = token.transferFrom(msg.sender, this, donated_amount);
        require(success);

        index = donations_num;

        donations[index] = Donation( msg.sender, donated_amount, block.timestamp,
            false, false);
        donations_num += 1;
    }

    function transfer_donations() owner_only returns(uint256 amount){
        amount = 0;
        for(uint i=0;i<donations_num;i++){
            Donation storage d = donations[i];
            if(!d.transfered && !d.returned){
                d.transfered = true;
                amount += d.amount;
            }
        }
        token.transfer(wallet, amount);
        return amount;
    }

    function return_donations() owner_only returns(uint256 amount){
        amount = 0;
        for(uint i=0;i<donations_num;i++){
            Donation storage d = donations[i];
            if(!d.transfered && !d.returned){
                d.returned = true;
                token.transfer(d.donator, d.amount);
                amount += d.amount;
            }
        }
        return amount;
    }



}