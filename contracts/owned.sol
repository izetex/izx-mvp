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

contract AddressList {
    function list_members() constant returns (address[] member_adrs);
    function add_member(address new_member) returns (uint index);
    function remove_member(address member);
    function is_member(address member) constant returns(bool exists);
}

contract OwnedAddressList is Owned {

    uint public num_members = 0;
    uint max_index = 0;
    mapping( uint => address) members;

    function list_members() constant returns (address[] member_adrs){
        member_adrs = new address[](num_members);
        uint j = 0;
        for(uint i=0;i<max_index;i++){
            address addr = members[i];
            if(addr != address(0)){
               member_adrs[j++] = addr;
            }
        }
        return member_adrs;
    }

    function add_member(address new_member) owner_only returns (uint index){
        index = max_index;
        members[index] = new_member;
        max_index += 1;
        num_members += 1;
        return index;
    }

    function remove_member(address member) owner_only{
        uint index = findMember(member);
        delete members[index];
        num_members -= 1;
    }


    function is_member(address member) constant returns(bool exists){
        for(uint i=0;i<max_index;i++){
            if(members[i] == member)
               return true;
        }
        return false;
    }

    function all_included(address[] _members) constant returns(bool exists){
        for(uint i=0;i<_members.length;i++){
            if(!is_member(_members[i]))
                return false;
        }
        return true;
    }

    function findMember(address member) internal returns (uint index){
        for(uint i=0;i<max_index;i++){
            if(members[i] == member)
               return i;
        }
        throw;
    }
}
