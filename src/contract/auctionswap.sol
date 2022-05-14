// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;


contract CrowdFund {
    
    IERC20 public immutable token;
    Stake STK; 

    uint256 totalFunded;
    uint256 goal;
    uint256 startAt;
    uint256 endAt;
    uint256 VTRPriceinKLAY = 30*(2**112);
    address owner = 0x544A9c2bDAb38145261c968b025Dc4daf1820b5A;  //나중에 바꿔야함

    mapping(address => uint) public pledgedVTR;

    constructor(address _token, address _stake) {
        token = IERC20(_token);
        STK = Stake(_stake);
        goal = 100000000000000000000;
        totalFunded = 0;
        startAt = uint32(block.timestamp);
        endAt = uint32(block.timestamp + 100000000000);
    }

    function setting( //only owner 설정
        uint _goal,
        uint32 _startAt,
        uint32 _endAt
    ) external {
        require(_startAt >= block.timestamp, "start at < now");
        require(_endAt >= _startAt, "end at < start at");
        require(_endAt <= block.timestamp + 1 days, "end at > max duration");
    

        goal = _goal;
        totalFunded = 0;
        startAt = _startAt;
        endAt = uint32(block.timestamp + 1000000);
    }
    

    function getVTRAmountforExactKlay(uint256 klay) public view returns(uint256){
        return(klay * VTRPriceinKLAY / (2**112) / (10**9));
    }

    function pledge(uint256 klayAmount) external payable{
        require(block.timestamp >= startAt, "not started");
        require(block.timestamp <= endAt, "ended");
        require(msg.value == klayAmount);

        pledgedVTR[msg.sender] += klayAmount;
        uint256 mintAmount = getVTRAmountforExactKlay(klayAmount);
        totalFunded += klayAmount;
        token.mint(msg.sender, mintAmount);
        STK.stake(mintAmount, 2, msg.sender);
        payable(owner).transfer(klayAmount);
    }

    function showBalance() public view returns(uint256){
        return pledgedVTR[msg.sender];
    }

    function showPercent() public view returns(uint256){
        uint256 totalFunded_112 = totalFunded * (2**112);
        return(totalFunded_112 / goal / 5192296858534827);
    }

    function getFrontInfo() public view returns(uint256, uint256, uint256, uint256, uint256){
        return(totalFunded, goal, msg.sender.balance, showPercent(), showBalance());
    }
}



