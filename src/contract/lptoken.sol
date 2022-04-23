   
// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.8.0;


import "./HomoraMath.sol";

contract Calculator{
    using HomoraMath for uint;
    uint reseveredETH = 23282592115161903556371;
    uint reseveredUSD = 71537139645692000000000000;
    uint totalSupply = 649077916377283094;
    uint lpamout = 123412;
    uint sqrtK = HomoraMath.sqrt(reseveredETH*reseveredUSD).fdiv(totalSupply);

    uint priceofEth = reseveredUSD*(2**112)/reseveredETH;
    uint priceofUSD = 2**112;


    uint lptokenPrice = (2*sqrtK*HomoraMath.sqrt(priceofEth)/2**56*HomoraMath.sqrt(priceofUSD)/2**56);

    function getLPTOKEN() view public returns(uint, uint) {
        
        return (lptokenPrice*totalSupply/2**112, lptokenPrice*lpamout*reseveredETH/reseveredUSD/2**112);  //that give us USD in 10^^18
    }
    
}