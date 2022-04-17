// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.5.0;
import "./TOKEN1.sol";
import "./TOKEN2.sol";
interface IUniswapV2Pair {
  event Approval(address indexed owner, address indexed spender, uint value);
  event Transfer(address indexed from, address indexed to, uint value);

  function name() external pure returns (string memory);
  function symbol() external pure returns (string memory);
  function decimals() external pure returns (uint8);
  function totalSupply() external view returns (uint);
  function balanceOf(address owner) external view returns (uint);
  function allowance(address owner, address spender) external view returns (uint);

  function approve(address spender, uint value) external returns (bool);
  function transfer(address to, uint value) external returns (bool);
  function transferFrom(address from, address to, uint value) external returns (bool);

  function DOMAIN_SEPARATOR() external view returns (bytes32);
  function PERMIT_TYPEHASH() external pure returns (bytes32);
  function nonces(address owner) external view returns (uint);

  function permit(address owner, address spender, uint value, uint deadline, uint8 v, bytes32 r, bytes32 s) external;

  event Mint(address indexed sender, uint amount0, uint amount1);
  event Burn(address indexed sender, uint amount0, uint amount1, address indexed to);
  event Swap(
      address indexed sender,
      uint amount0In,
      uint amount1In,
      uint amount0Out,
      uint amount1Out,
      address indexed to
  );
  event Sync(uint112 reserve0, uint112 reserve1);

  function MINIMUM_LIQUIDITY() external pure returns (uint);
  function factory() external view returns (address);
  function token0() external view returns (address);
  function token1() external view returns (address);
  function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast);
  function price0CumulativeLast() external view returns (uint);
  function price1CumulativeLast() external view returns (uint);
  function kLast() external view returns (uint);

  function mint(address to) external returns (uint liquidity);
  function burn(address to) external returns (uint amount0, uint amount1);
  function swap(uint amount0Out, uint amount1Out, address to, bytes calldata data) external;
  function skim(address to) external;
  function sync() external;
}


interface IUniswapV2Router01 {
  function factory() external pure returns (address);
  function WETH() external pure returns (address);

  function addLiquidity(
      address tokenA,
      address tokenB,
      uint amountADesired,
      uint amountBDesired,
      uint amountAMin,
      uint amountBMin,
      address to,
      uint deadline
  ) external returns (uint amountA, uint amountB, uint liquidity);
  function addLiquidityETH(
      address token,
      uint amountTokenDesired,
      uint amountTokenMin,
      uint amountETHMin,
      address to,
      uint deadline
  ) external payable returns (uint amountToken, uint amountETH, uint liquidity);
  function removeLiquidity(
      address tokenA,
      address tokenB,
      uint liquidity,
      uint amountAMin,
      uint amountBMin,
      address to,
      uint deadline
  ) external returns (uint amountA, uint amountB);
  function removeLiquidityETH(
      address token,
      uint liquidity,
      uint amountTokenMin,
      uint amountETHMin,
      address to,
      uint deadline
  ) external returns (uint amountToken, uint amountETH);
  function removeLiquidityWithPermit(
      address tokenA,
      address tokenB,
      uint liquidity,
      uint amountAMin,
      uint amountBMin,
      address to,
      uint deadline,
      bool approveMax, uint8 v, bytes32 r, bytes32 s
  ) external returns (uint amountA, uint amountB);
  function removeLiquidityETHWithPermit(
      address token,
      uint liquidity,
      uint amountTokenMin,
      uint amountETHMin,
      address to,
      uint deadline,
      bool approveMax, uint8 v, bytes32 r, bytes32 s
  ) external returns (uint amountToken, uint amountETH);
  function swapExactTokensForTokens(
      uint amountIn,
      uint amountOutMin,
      address[] calldata path,
      address to,
      uint deadline
  ) external returns (uint[] memory amounts);
  function swapTokensForExactTokens(
      uint amountOut,
      uint amountInMax,
      address[] calldata path,
      address to,
      uint deadline
  ) external returns (uint[] memory amounts);
  function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline)
      external
      payable
      returns (uint[] memory amounts);
  function swapTokensForExactETH(uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline)
      external
      returns (uint[] memory amounts);
  function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)
      external
      returns (uint[] memory amounts);
  function swapETHForExactTokens(uint amountOut, address[] calldata path, address to, uint deadline)
      external
      payable
      returns (uint[] memory amounts);

  function quote(uint amountA, uint reserveA, uint reserveB) external pure returns (uint amountB);
  function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) external pure returns (uint amountOut);
  function getAmountIn(uint amountOut, uint reserveIn, uint reserveOut) external pure returns (uint amountIn);
  function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts);
  function getAmountsIn(uint amountOut, address[] calldata path) external view returns (uint[] memory amounts);
}
contract Pair{
    TOKEN1 USD;
    TOKEN2 CBR;
    IUniswapV2Pair pair;
    IUniswapV2Router01 router;

    constructor(){
        pair = IUniswapV2Pair(0x537Af96b6a783E325fd2116EF788d21373D4A671);
        router = IUniswapV2Router01(0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D);
        USD = TOKEN1(0x296205377F8cCdD604CB92A7A0C1FFb01eBcbA83);
        CBR = TOKEN2(0x41A6AD607d252A5b7b60d3efAFDE68BC4d561721);
    }
    
    function getname() public view returns(string memory){
        return pair.name();
    }
    function getsymbol() public view returns(string memory){
        return pair.symbol();
    }
    function gettoken0() public view returns(address){
        return pair.token0();
    }
    function gettoken1() public view returns(address){
        return pair.token1();
    }
    function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast){
        return pair.getReserves();
    }
    function price0CumulativeLast() external view returns (uint){
        return pair.price0CumulativeLast();
    }
    function price1CumulativeLast() external view returns (uint){
        return pair.price1CumulativeLast();
    }
    
    function seeFac() external view returns (address){
        return router.factory();
    }
    function addLiquidity(uint256 _amount1, uint256 _amount2) external returns (uint amountA, uint amountB, uint liquidity){
            
            USD.approve(0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D, 100000000000000000000000);
            CBR.approve(0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D, 100000000000000000000000);
            USD.transferFrom(msg.sender, address(this), _amount1);
            CBR.transferFrom(msg.sender, address(this), _amount1);
            return router.addLiquidity(0x296205377F8cCdD604CB92A7A0C1FFb01eBcbA83, 0x41A6AD607d252A5b7b60d3efAFDE68BC4d561721, _amount1, _amount2, 90, 20, 0x544A9c2bDAb38145261c968b025Dc4daf1820b5A, 1650090000);
            
        }
    function swapExactTokensForTokens(
        uint amountIn
        ) external returns (uint[] memory amounts){
            address[] memory path = new address[](2);
                path[0] = address(USD);
                path[1] = address(CBR);
            router.swapExactTokensForTokens(amountIn, 10, path, 0x544A9c2bDAb38145261c968b025Dc4daf1820b5A, 1650090000);
        }
}