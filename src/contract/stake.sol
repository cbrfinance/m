// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
import "./TOKEN.sol";
/**
 * @title Storage
 * @dev Store & retrieve value in a variable
 */
contract Stake{
    TOKEN CBR;   //TOKEN


    //CONST 

    uint256 private constant MAX_UINT256 = type(uint256).max;
    uint256 private constant INITIAL_FRAGMENTS = 5_000_000_000 * 10**9;
    uint256 private constant TOTAL_GONS = MAX_UINT256 - (MAX_UINT256 % INITIAL_FRAGMENTS);

    
    /************FRONT END DATA**************/
     struct FrontGenInfo {
        uint256 rRound;
        uint256 rTotalSupply;
        uint256 rIndex;
        uint256 rate;
    }

    struct FrontIndInfo {
        uint256 rIndRound;
        uint256 rBalance;
        uint256 cbrBalance;
    }
    /************FRONT END DATA END**************/

 

    /************BACK END DATA*************/
    uint256 internal INDEX; // Index Gons - tracks rebase growth

    uint256 roundStartTime = 1649554200;
    uint256 roundDuration = 300;
    uint256 lastUpdateRound = 1;
    uint256 currentRate = 10030;
    uint256 private _gonsPerFragment;
    uint256 private _fragment;
    uint256 private _totalGonSupply;

    mapping(address => uint256) private _gonBalances;
    mapping(address => uint256) private _startRound;
    /************BACK END DATA*************/



    constructor(address _tokenAddress) {
        CBR = TOKEN(_tokenAddress);
        _fragment = INITIAL_FRAGMENTS;
        _gonsPerFragment = TOTAL_GONS/_fragment;
        INDEX = amountToGons(10**9);
    }
    //TOTAL_GONS 는 분자 _totalSupply는 분모로 생각하자
    /********STAKE UNSTAKE REBASE***********/
    function rebase() public {
        _fragment = rFragment();
        _gonsPerFragment = TOTAL_GONS / _fragment;
        lastUpdateRound = rRound();
    }

    function stake(uint256 amount) public {
        require(CBR.balanceOf(msg.sender) >= amount);
        if(lastUpdateRound != rRound()) rebase();
        CBR.burn(msg.sender, amount);
        _startRound[msg.sender] = rRound();
        uint256 senderGons = amountToGons(amount);
        _gonBalances[msg.sender] += senderGons;
        _totalGonSupply += senderGons;
    }

    function unstake(uint256 amount) public {
        if(lastUpdateRound != rRound()) rebase();
        uint256 senderGons = amountToGons(amount);
        require(senderGons <= _gonBalances[msg.sender]);
        _gonBalances[msg.sender] -= senderGons;
        _startRound[msg.sender] = rRound();
        CBR.mint(msg.sender, amount);
        _totalGonSupply -= senderGons;
    }
    /********STAKE UNSTAKE REBASE***********/


    /******************** Internal view Gen***************/
    function rRound() internal view returns(uint256) // 절대라운드시간.
    {
        return ((block.timestamp - roundStartTime) / roundDuration + 1);
    }

    function rFragment() internal view returns(uint256) {

        uint256 roundDiff = rRound() - lastUpdateRound;
        uint256 temFragment = _fragment;
        if (roundDiff != 0) {
            for (uint256 i = 0; i < roundDiff; i++) {
                temFragment = temFragment * currentRate / 10000;
            }
            return temFragment;
        } else {
            return _fragment;
        }
    }
    function rIndex() internal view returns(uint256)
    {
        return gonsToAmount(INDEX);
    }

    function rGonsPerFragment() public view returns (uint256) {
        return TOTAL_GONS / rFragment();
    }


    function totalSupply() public view returns (uint256) {
        return _totalGonSupply / rGonsPerFragment();
    }

    function gonsToAmount(uint256 gons) view internal returns (uint256){
        return (gons / rGonsPerFragment());
    }

    function amountToGons(uint256 amount) view internal returns (uint256){
        return (amount * rGonsPerFragment());
    }
    /******************** Internal view Gen END ***************/


    
    /******************** Internal view Ind***************/
    function rIndRound() internal view returns(uint256) {
        if(_gonBalances[msg.sender] != 0)
            return (rRound() - _startRound[msg.sender]);
        else
            return 0;
    }

    function balanceOf(address who) public view returns (uint256) {
        return _gonBalances[who] /rGonsPerFragment();
    }

    /******************** Internal view Ind END ***************/

    /********************** External view ***************/
     function decimals() public view virtual returns (uint8) {
        return 9;
    }
    function getFrontGenInfo() external view returns(FrontGenInfo memory) {

        FrontGenInfo memory frontGenInfo;

        frontGenInfo.rRound = rRound();
        frontGenInfo.rTotalSupply = totalSupply();
        frontGenInfo.rIndex = rIndex();
        frontGenInfo.rate = currentRate;

        return(frontGenInfo);
    }

    
    function getFrontIndInfo() external view returns(FrontIndInfo memory){

        FrontIndInfo memory frontIndInfo;

        frontIndInfo.rIndRound = rIndRound();
        frontIndInfo.rBalance = balanceOf(msg.sender);
        frontIndInfo.cbrBalance = CBR.balanceOf(msg.sender);

        return(frontIndInfo);
    }
}
