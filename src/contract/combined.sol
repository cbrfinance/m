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
        uint256 rSecondLeft;
        uint256 rate;
    }

    struct FrontIndInfo {
        uint256[3] rIndRound;
        uint256 rBalance;
        uint256 cbrBalance;
    }
    /************FRONT END DATA END**************/

 

    /************BACK END DATA*************/
    uint256 internal INDEX; // Index Gons - tracks rebase growth

    uint256 roundStartTime = 1651881600;
    uint256 roundDuration = 120;
    uint256 lastUpdateRound = 1;
    uint256 currentRate = 10030;
    uint256 private _gonsPerFragment;
    uint256 private _fragment;
    uint256 private _totalGonSupply;

    uint8[] roundType = [2, 4, 6];


    mapping(address => mapping(uint8 => uint256)) private _startRound;
    mapping(address => uint256) private _totalGon;
    mapping(address => mapping(uint8 => uint256)) private _gonLockedBalances;
    mapping(address => uint256) private _gonUnlockedBalances;


    /************BACK END DATA*************/



    constructor(address _tokenAddress) {
        CBR = TOKEN(_tokenAddress);
        _fragment = INITIAL_FRAGMENTS;
        _gonsPerFragment = TOTAL_GONS/_fragment;
        INDEX = (10**9) * _gonsPerFragment;
    }
    //TOTAL_GONS 는 분자 _totalSupply는 분모로 생각하자
    /********STAKE UNSTAKE REBASE***********/
    function rebase() public {
        _fragment = rFragment();
        _gonsPerFragment = TOTAL_GONS / _fragment;
        lastUpdateRound = rRound();
    }


    function transferToClaimable() public {
        for(uint8 i = 0; i < 3; i++){
            if(_startRound[msg.sender][i] + roundType[i] < rRound()){
                _gonUnlockedBalances[msg.sender] += _gonLockedBalances[msg.sender][i];
                _gonLockedBalances[msg.sender][i] = 0;
            }
        }
    }


    function stake(uint256 amount, uint8 stakeType) public {  //type 에 따라 컨트렉 제한걸기
        require(CBR.balanceOf(msg.sender) >= amount);
        if(lastUpdateRound != rRound()) rebase();
        transferToClaimable();

        CBR.burn(msg.sender, amount);
        _startRound[msg.sender][stakeType] = rRound();
        uint256 senderGons = amountToGons(amount);
        _gonLockedBalances[msg.sender][stakeType] += senderGons;
        _totalGon[msg.sender] += senderGons;
        _totalGonSupply += senderGons;
    }

    function unstake(uint256 amount) public {
        if(lastUpdateRound != rRound()) rebase();
        transferToClaimable();

        uint256 senderGons = amountToGons(amount);
        require(senderGons <= _gonUnlockedBalances[msg.sender]);
        _gonUnlockedBalances[msg.sender] -= senderGons;
        _totalGon[msg.sender] -= senderGons;

        CBR.mint(msg.sender, amount);
        _totalGonSupply -= senderGons;
    }

    function setRoundType(uint8 stake, uint8 bond, uint8 auctionSwap){
        roundType[0] = stake;
        roundType[1] = bond;
        roundType[2] = auctionSwap;
    }
    function setStartTime(uint256 time){
        roundStartTime = time;
    }
    /********STAKE UNSTAKE REBASE***********/




    
    /******************** Internal view Ind***************/

    function claimableAmount() public view returns(uint256){
        uint256 gonsAmount;

        for(uint8 i = 0; i < 3; i++){
            if(_startRound[msg.sender][i] + roundType[i] < rRound()) gonsAmount += _gonLockedBalances[msg.sender][i];
        }

        return gonsToAmount(gonsAmount + _gonUnlockedBalances[msg.sender]);
    }

    function lockedAmount() public view returns(uint256){
        uint256 gonsAmount;

        for(uint8 i = 0; i < 3; i++){
            if(_startRound[msg.sender][i] + roundType[i] >= rRound()) gonsAmount += _gonLockedBalances[msg.sender][i];
        }

        return gonsToAmount(gonsAmount);
    }

    function lockedAmountInd() public view returns(uint256[3] memory){
        uint256[3] memory round = rIndRoundforLocked();
        uint256[3] memory amountLocked;
        for(uint8 i = 0; i < 3; i++){
            if(round[i] > 0) 
                amountLocked[i] = gonsToAmount(_gonLockedBalances[msg.sender][i]);
            else
                amountLocked[i] = 0;
        }
        return amountLocked;
    }

    function rIndRoundforLocked() public view returns(uint256[3] memory) { //will return 0 if its unlocked or doesnt have balance
        
        uint256[3] memory round;
        for(uint8 i = 0; i < 3; i++){
            if(_gonLockedBalances[msg.sender][i] != 0)
            {
                if(_startRound[msg.sender][i] + roundType[i] < rRound())
                    round[i] = 0;
                else
                    round[i] = rRound() - _startRound[msg.sender][i] + 1;
            }
            else
            {
                round[i] = 0;
            }
        }
        return round;

    }

    function balanceOf(address who) public view returns (uint256) {
        return _totalGon[who] /rGonsPerFragment();
    }

    /******************** Internal view Ind END ***************/

    /********************** External view ***************/
     function decimals() public view virtual returns (uint8) {
        return 9;
    }
    function showlastupdateround() external view returns(uint256){
        return lastUpdateRound;
    }
    function showRFrac() external view returns(uint256){
        return rFragment();
    }
    function getFrontGenInfo() external view returns(FrontGenInfo memory) {

        FrontGenInfo memory frontGenInfo;

        frontGenInfo.rRound = rRound();
        frontGenInfo.rTotalSupply = totalSupply();
        frontGenInfo.rIndex = rIndex();
        frontGenInfo.rSecondLeft = rSecondLeft();
        frontGenInfo.rate = currentRate;

        return(frontGenInfo);
    }
    function getFrontInd() external view returns(uint256, uint256, uint256[3] memory, uint256[3] memory, uint256, uint256){
        uint256 claimable = claimableAmount();
        uint256 locked = lockedAmount();
        uint256[3] memory lockedInd = lockedAmountInd();
        uint256[3] memory lockedRound = rIndRoundforLocked();
        uint256 CBRBalance = CBR.balanceOf(msg.sender);
        uint256 sCBRBalance = balanceOf(msg.sender);
        return(claimable, locked, lockedInd, lockedRound, CBRBalance, sCBRBalance);
    }
    
    function getFrontIndInfo() external view returns(FrontIndInfo memory){

        FrontIndInfo memory frontIndInfo;

        frontIndInfo.rIndRound = rIndRoundforLocked();
        frontIndInfo.rBalance = balanceOf(msg.sender);
        frontIndInfo.cbrBalance = CBR.balanceOf(msg.sender);

        return(frontIndInfo);
    }


























        /******************** Internal view Gen***************/
    function rRound() public view returns(uint256) // 절대라운드시간.
    {
        return ((block.timestamp - roundStartTime) / roundDuration + 1);
    }
    function rSecondLeft() internal view returns(uint256){
        return roundDuration - ((block.timestamp - roundStartTime) % roundDuration);
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
}
