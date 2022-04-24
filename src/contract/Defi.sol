// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.5.0 <0.9.0;
import "./TOKEN.sol";

contract Bond {
    uint totalSaleInUSD_4;
    struct Pair { // Struct
        address pairAddress;
        address tokenA;
        address tokenB;
        bool onSale;
        uint256 pairTotalSaleInUSD_4;
    }
    address treasuryAccount;
    mapping(string =>address) pairToAddress;


    TOKEN CBR;   //TOKEN
    function getLPvalue(address pair) internal view returns(uint256){
        uint112 reserve0;
        uint112 reserve1;
        address token0 = IKlayExchange(pair).tokenA();
        address token1 = IKlayExchange(pair).tokenB();.
        (reserve0, reserve1, ) = store.getReserves(pair);
        require(reserve0 != 0 && reserve1 != 0, "Oracle: NO_RESERVES");
        reserve0_18 = reserve0*(10**(18-KIP7(token0).decimals()));
        reserve1_18 = reserve1*(10**(18-KIP7(token0).decimals()));
        totalSupply_18 = IKlayExchange(pair).totalSupply();
        uint256 token0inUSD_112 = 
        uint256 token1inUSD_112 =
        uint256 sqrtK = HomoraMath.sqrt(reserve0_18*reserve1_18).fdiv(totalSupply_18);
        uint256 lpValueinUSD_112 = (2*sqrtK*HomoraMath.sqrt(token0inUSD_112)/2**56*HomoraMath.sqrt(token1inUSD_112)/2**56);
        return lpValueinUSD_112;
    }

    function getUserLPvalue(address pair) external view returns(uint256, uint256){
        uint256 lpValueinUSD_112 = getLPvalue(pair);
        uint256 userLP_18 = IKlayExchange(pair).balanceOf(msg.sender);
        return(userLP_18, lpValueinUSD_112*userLP_18/(2**112));
    }

    function convertLPtoCBR(address pair, uint256 lpAmount_18, uint256 tokenPriceinUSD_4) external view returns(uint256, uint256) {//입력된lp 의가치, 받을수잇는 토큰수량
        uint256 lpValueinUSD_112 = getLPvalue(pair);
        uint256 inputLPvalueinUSD_112_18 = lpValueinUSD_112 * lpAmount_18;
        uint256 tokenAmount_9 = inputLPvalueinUSD_112_18 / tokenPriceinUSD_4 / 10**5 / (2**112);
        return tokenAmount_9;
    }
    function purchaseCBRforLP(address pair, uint256 lpAmount_18, uint256 minToken, uint256 tokenPriceinUSD_4) external {
        ERC20(pair).transferFrom(msg.sender, treasuryAccount, lpAmount_18);
        uint256 lpValueinUSD_112 = getLPvalue(pair);
        uint256 inputLPvalueinUSD_112_18 = lpValueinUSD_112 * lpAmount_18;
        uint256 tokenAmount_9 = inputLPvalueinUSD_112_18 / tokenPriceinUSD_4 / 10**5 / (2**112);
        require(minToken <= tokenAmount_9);
        CBR.mint(msg.sender, tokenAmount_9);
    }
}

interface IKlayExchange {
    function totalSupply() external view returns(uint256)
    function decimals() external view returns (uint8);
    function balanceOf(address user) external view returns(uint256)
    function tokenA() external view returns(address);
    function tokenB() external view returns(address);
    function getCurrentPool() external view returns(uint256 balance0, uint256 balance1);
    function estimatePos(address token, uint256 amount) external view returns(uint256);
    function estimateNeg(address token, uint256 amount) external view returns(uint256);
}

interface IKlayswapFactory {
    function exchangeKlayPos(address token, uint amount, address[] calldata path) payable external;
    function exchangeKlayNeg(address token, uint amount, address[] calldata path) payable external;
    function exchangeKctPos(address tokenA, uint amountA, address tokenB, uint amountB, address[] calldata path) external;
    function exchangeKctNeg(address tokenA, uint amountA, address tokenB, uint amountB, address[] calldata path) external;
}

pragma solidity >= 0.5.0;

interface IKlayswapStore {
    function reserveA(address) external view returns (uint112);
    function reserveB(address) external view returns (uint112);
    function getReserves(address) external view returns(uint112 _reserveA, uint112 _reserveB, uint32 _blockTimestampLast);
    function priceACumulativeLast(address) external view returns(uint256);
    function priceBCumulativeLast(address) external view returns(uint256);
    function blockTimestampLast(address) external view returns(uint32);
    event Sync(address pool, uint112 reserveA, uint112 reserveB);
}