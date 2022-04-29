// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.8.0;

import "./HomoraMath.sol";



contract Bond {

    using HomoraMath for uint256;
    address USDT = 0xceE8FAF64bB97a73bb51E115Aa89C17FfA8dD167;
    IKlayswapStore store;

    constructor(address _store) {
        store = IKlayswapStore(_store);        
    }

    function getRatioWithStable(address stablePair) public view returns(uint256, uint256, uint256){
        uint112 reserve0;
        uint112 reserve1;
        
        address token0 = IKlayExchange(stablePair).tokenA();
        address token1 = IKlayExchange(stablePair).tokenB();
        (reserve0, reserve1, ) = store.getReserves(stablePair);
        require(reserve0 != 0 && reserve1 != 0, "Oracle: NO_RESERVES");
        uint256 reserve0_18 = reserve0*(10**(18-IKIP7(token0).decimals()));
        uint256 reserve1_18 = reserve1*(10**(18-IKIP7(token1).decimals()));
        uint256 reserve0_112_18 = reserve0_18 * (2**112);
        uint256 reserve1_112_18 = reserve1_18 * (2**112);
        if(token0 == USDT){
            uint256 token1inUSD_112 = reserve0_112_18 / reserve1_18;
            uint256 token1inUSD_18 = token1inUSD_112 / 5192296858534827;
            uint256 token1inUSD_0 = token1inUSD_18 / (10**18);
            return(token1inUSD_18, token1inUSD_0 ,token1inUSD_112);
        }
        else{
            uint256 token0inUSD_112 = reserve1_112_18 / reserve0_18;
            uint256 token0inUSD_18 = token0inUSD_112 / 5192296858534827;
            uint256 token0inUSD_0 = token0inUSD_18 / (10**18);
            return(token0inUSD_18, token0inUSD_0, token0inUSD_112);
        }
    }

    function getLPvalue(address pair, uint256 token0inUSD_112, uint256 token1inUSD_112) public view returns(uint256){
        uint112 reserve0;
        uint112 reserve1;
        address token0 = IKlayExchange(pair).tokenA();
        address token1 = IKlayExchange(pair).tokenB();
        (reserve0, reserve1, ) = store.getReserves(pair);
        require(reserve0 != 0 && reserve1 != 0, "Oracle: NO_RESERVES");
        uint256 reserve0_18 = reserve0*(10**(18-IKIP7(token0).decimals()));
        uint256 reserve1_18 = reserve1*(10**(18-IKIP7(token1).decimals()));
        uint256 totalSupply_n = IKlayExchange(pair).totalSupply();
        uint256 sqrtK_112_18_n = HomoraMath.sqrt(reserve0_18*reserve1_18).fdiv(totalSupply_n);
        uint256 lpValueinUSD_112_18_n = (2*sqrtK_112_18_n*HomoraMath.sqrt(token0inUSD_112)/2**56*HomoraMath.sqrt(token1inUSD_112)/2**56);
        return lpValueinUSD_112_18_n;
    }

    function getInputLPvalue(address pair, uint256 token0inUSD_112, uint256 token1inUSD_112, uint256 lpAmount_n) external view returns(uint256, uint256, uint256){
        uint256 lpValueinUSD_112_18_n = getLPvalue(pair, token0inUSD_112, token1inUSD_112);
        uint256 lpAmountValueinUSD_112_18 = lpValueinUSD_112_18_n * lpAmount_n;
        uint256 lpAmountValueinUSD_18 = lpAmountValueinUSD_112_18 / (2**112);
        uint256 lpAmountValueinUSD_0 = lpAmountValueinUSD_18 / (10**18);
        return(lpAmountValueinUSD_112_18, lpAmountValueinUSD_18, lpAmountValueinUSD_0);
    }

    function convertUSDtoCBR(uint256 USD_112, uint256 tokenPriceinUSD_4) external view returns(uint256, uint256) {//입력된lp 의가치, 받을수잇는 토큰수량
        uint256 tokenAmount_9 = USD_112 / tokenPriceinUSD_4 * (10**13) / (2**112);
        uint256 tokenAmount_0 = tokenAmount_9 / (10**9);
        return (tokenAmount_9, tokenAmount_0);
    }


}

interface IKlayExchange {
    function totalSupply() external view returns(uint256);
    function decimals() external view returns (uint8);
    function balanceOf(address user) external view returns(uint256);
    function tokenA() external view returns(address);
    function tokenB() external view returns(address);
    function getCurrentPool() external view returns(uint256 balance0, uint256 balance1);
    function estimatePos(address token, uint256 amount) external view returns(uint256);
    function estimateNeg(address token, uint256 amount) external view returns(uint256);
}

interface IKlayswapFactory {
    function tokenToPool(address tokenA, address tokenB) external view returns (address);
    function exchangeKlayPos(address token, uint amount, address[] calldata path) payable external;
    function exchangeKlayNeg(address token, uint amount, address[] calldata path) payable external;
    function exchangeKctPos(address tokenA, uint amountA, address tokenB, uint amountB, address[] calldata path) external;
    function exchangeKctNeg(address tokenA, uint amountA, address tokenB, uint amountB, address[] calldata path) external;
}


interface IKlayswapStore {
    function reserveA(address) external view returns (uint112);
    function reserveB(address) external view returns (uint112);
    function getReserves(address) external view returns(uint112 _reserveA, uint112 _reserveB, uint32 _blockTimestampLast);
    function priceACumulativeLast(address) external view returns(uint256);
    function priceBCumulativeLast(address) external view returns(uint256);
    function blockTimestampLast(address) external view returns(uint32);
    event Sync(address pool, uint112 reserveA, uint112 reserveB);
}

interface IKIP7 {
    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function decimals() external view returns (uint8);
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient,uint256 amount) external returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}