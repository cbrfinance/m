// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IERC20 {
    function transfer(address, uint) external returns (bool);

    function transferFrom(
        address,
        address,
        uint
    ) external returns (bool);

    function mint(address who, uint256 amount) external;
}

interface Stake {
    function transfer(address, uint) external returns (bool);
    function stake(uint256 amount, uint8 stakeType, address user) external;

}

contract CrowdFund {
    struct Campaign {
        uint goal;
        uint currentBalance;
        uint32 startAt;
        uint32 endAt;
    }

    IERC20 public immutable token;
    Stake STK; 
    Campaign campaign;
    uint256 VTRPriceinKLAY = 30*(2**112);

    mapping(address => uint) public pledgedAmount;

    constructor(address _token, address _stake) {
        token = IERC20(_token);
        STK = Stake(_stake);
    }

    function setting( //only owner 설정
        uint _goal,
        uint32 _startAt,
        uint32 _endAt
    ) external {
        require(_startAt >= block.timestamp, "start at < now");
        require(_endAt >= _startAt, "end at < start at");
        require(_endAt <= block.timestamp + 1 days, "end at > max duration");
    
        campaign = Campaign({
            goal: _goal,
            currentBalance: 0,
            startAt: _startAt,
            endAt: _endAt

             
        });
    }

    function getVTRAmountforExactKlay(uint256 klay) public view returns(uint256){
        return(klay * VTRPriceinKLAY / (2**112) / (10**9));
    }

    function pledge(uint256 klayAmount) external payable{
        require(block.timestamp >= campaign.startAt, "not started");
        require(block.timestamp <= campaign.endAt, "ended");
        require(msg.value == klayAmount);

        campaign.currentBalance += klayAmount;
        pledgedAmount[msg.sender] += klayAmount;
        uint256 mintAmount = getVTRAmountforExactKlay(klayAmount);
        token.mint(msg.sender, mintAmount);
        STK.stake(mintAmount, 2, msg.sender);
    }


}


//<div className="rounded-lg max-w-3xl m-auto mt-5">
                <div className="bg-gray-100 rounded-lg p-10 text-slate-800 flex-1 rounded-lg rounded-b-none bg-gray-100"> 
                    <div className="mb-5">
                        <p className="text-lg text-stone-500">Your Total Purchase Amount</p>
                        <p className="text-4xl font-bold">12833 CBR</p>
                    </div>
                    <div className="mb-5">
                        <p className="text-lg text-stone-500">You already claimed</p>
                        <p className="text-4xl font-bold">1283 CBR</p>
                    </div>
                    <div className="mb-5">
                        <p className="text-lg text-stone-500">Your Claimable Amount</p>
                        <p className="text-4xl font-bold">6593 CBR</p>
                    </div>
                </div>
                <div className="rounded-lg rounded-t-none text-2xl cursor-pointer hover:bg-neutral-500 font-medium text-gray-100 flex justify-center items-center p-3 bg-neutral-400">
                    <p>CLAIM</p>
                </div>
            </div>