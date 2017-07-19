pragma solidity ^0.4.10;

import "browser/owned.sol";
import "browser/token.sol";

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