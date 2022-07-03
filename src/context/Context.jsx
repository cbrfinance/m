import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import {stakingContractABI, stakingContractAddress, tokenContractAddress, tokenContractABI, bondHelpContractAddress, bondHelpContractABI, bondContractABI, bondContractAddress, auctionSwapContractAddress, auctionSwapContractABI, KSPAddress } from "../constant/Constant";

export const Context = React.createContext();

const { ethereum } = window;
const gasPrice_ = 250000000000;




const createStakeContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(stakingContractAddress, stakingContractABI, signer);

    return contract;
  };
  
export const Provider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState("")
    const [newNet, setnewNet] = useState(false);







    /*****************************LIB FUNCTION*******************************/
    const convertfinal = (target, decimal, tofix) => {
        const token = ethers.utils.formatUnits(target, decimal)
        const string = (+token).toFixed(tofix)
        return string;
     }
    const convert = (target) => {
        const token = ethers.utils.formatUnits(target, 9)
        const string = (+token).toFixed(4)
        return string;
    }
    
    function secondsToHms(d) {
        d = Number(d);
        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);

    
        var hDisplay = h > 0 ? h + (h === 1 ? " hour, " : " hours, ") : "";
        var mDisplay = m > 0 ? m + (m === 1 ? " minute " : " minutes ") : "1 minute ";

        return hDisplay + mDisplay; 
    }
    /*****************************LIB FUNCTION END*******************************/

    /*****************************BASIC SETTING*******************************/
    const checkIfWalletIsConnect = async () => {
        try {
          if (!ethereum) return alert("Please install MetaMask.");
    
          const accounts = await ethereum.request({ method: "eth_accounts" });
    
          if (accounts.length) {
            setCurrentAccount(accounts[0]);
    
          } else {
            console.log("No accounts found");
          }
        } catch (error) {
          console.log(error);
        }
      };

    const connectWallet = async () => {
        try {
          if (!ethereum) return alert("Please install MetaMask.");
    
          const accounts = await ethereum.request({ method: "eth_requestAccounts", });
    
          setCurrentAccount(accounts[0]);
          window.location.reload();
        } catch (error) {
          console.log(error);
    
          throw new Error("No ethereum object");
        }
      };
      const setCBR = async () => {
        await window.ethereum.request({
            method: 'wallet_watchAsset',
            params: {
              type: 'ERC20', // Initially only supports ERC20, but eventually more!
              options: {
                address: tokenContractAddress, // The address that the token is at.
                symbol: "CBR", // A ticker symbol or shorthand, up to 5 chars.
                decimals: 9, // The number of decimals in the token
                image: "https://cryptologos.cc/logos/polkadot-new-dot-logo.png", // A string url of the token logo
              },
            },
          });
    }
    
    const setsCBR = async () => {
        await window.ethereum.request({
            method: 'wallet_watchAsset',
            params: {
              type: 'ERC20', // Initially only supports ERC20, but eventually more!
              options: {
                address: stakingContractAddress, // The address that the token is at.
                symbol: "sCBR", // A ticker symbol or shorthand, up to 5 chars.
                decimals: 9, // The number of decimals in the token
                image: "https://cryptologos.cc/logos/nkn-nkn-logo.svg", // A string url of the token logo
              },
            },
          });
    }
    
    const setNetwork = async () => {
        await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                  chainId: '0x3E9',
                  chainName: 'Klaytn Baobob',
                  rpcUrls: ["https://api.baobab.klaytn.net:8651"],
                  nativeCurrency: {
                      name: 'KLAY',
                      symbol: 'KLAY',
                      decimals: 18
                  },
                  blockExplorerUrls: ['https://baobab.scope.klaytn.com/']
              }
          ],
          });
          console.log("hi")
          setnewNet(true)
    }
    /*****************************BASIC SETTING END*******************************/









    /*****************************STAKE FUNCTION*******************************/
    const stake = async (amount, type, setLoading, setToastType) => {
        try {
            if (ethereum) {
                const accounts = await ethereum.request({ method: "eth_accounts" });
                const stakeContract = createStakeContract();
                const parsedAmount = ethers.utils.parseUnits(amount.toString(), 9);
                console.log(parsedAmount)
                const stake = await stakeContract.stake(parsedAmount, type, accounts[0], {
                gasPrice: gasPrice_
            });
            setLoading(true);
            setToastType("submit")
            await stake.wait()
            setLoading(false);
            setToastType("success")



            }else {
                console.log("Ethereum is not present");
              }
          } catch (error) {
            console.log("something went wrong!")
            setLoading(false);
            setToastType("fail")
            console.log(error);
          }
    }
    const unstake = async (amount, setLoading, setToastType) => {
        try {
            if (ethereum) {
              const stakeContract = createStakeContract();
              const parsedAmount = ethers.utils.parseUnits(amount.toString(), 9);
              const unstake = await stakeContract.unstake(parsedAmount, {
                gasPrice: gasPrice_
            });
            setLoading(true);
            setToastType("submit")
            await unstake.wait()
            setLoading(false);
            setToastType("success")

          

            }else {
                console.log("Ethereum is not present");
              }
          } catch (error) {
            setLoading(false);
            setToastType("fail")
            console.log(error);
          }
    }
    const getStakeInfo = async (setGenInfo, setIndInfo) => {
        try {
          if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const stakeGenContract = new ethers.Contract(stakingContractAddress, stakingContractABI, provider);
            const stakeContract = createStakeContract();
            const a = await stakeGenContract.getFrontGenInfo();
            console.log(a);
            const [_round, _totalSupply, _index, _secondLeft, _rate] = await stakeGenContract.getFrontGenInfo();
            const genInfo = {round : ethers.utils.formatUnits(_round, 0), totalSupply : convert(_totalSupply), index : convert(_index), secondToHM : secondsToHms(_secondLeft), secondLeftPercent : parseFloat((100 - (_secondLeft.toNumber()/28800*100)).toFixed(1)), secondLeftPercent0 : parseFloat((100 - (_secondLeft.toNumber()/28800*100)).toFixed(0)), rate : (_rate.toNumber() - 10000)/100, roi : ((Math.pow((_rate.toNumber()/10000), 5 * 3) - 1) * 100).toFixed(4), apy : ((Math.pow((_rate.toNumber()/10000), 365 * 3) - 1) * 100).toFixed(1)}
            setGenInfo(genInfo)
            
            const indInfo = await stakeContract.getFrontInd();

            
            const indInfoObject = {
                claimableAmount : convertfinal(indInfo[0], 9, 4), 
                claimableExactAmount : convertfinal(indInfo[0], 9, 9),
                lockedAmount : convertfinal(indInfo[1], 9, 4), 
                lockedAmountArray : [convertfinal(indInfo[2][0], 9, 4), convertfinal(indInfo[2][1], 9, 4), convertfinal(indInfo[2][2], 9, 4)],
                roundArray : [convertfinal(indInfo[3][0], 0, 0), convertfinal(indInfo[3][1], 0, 0), convertfinal(indInfo[3][2], 0, 0)],
                cbrAmount : convertfinal(indInfo[4], 9, 4),
                cbrExactAmount : convertfinal(indInfo[4], 9, 9),
                scbrAmount : convertfinal(indInfo[5], 9, 4),
                scbrExactAmount : convertfinal(indInfo[5], 9, 9),
            }
            setIndInfo(indInfoObject)
            console.log(indInfoObject)
            //const indInfo = {indRound : ethers.utils.formatUnits(_indRound, 0), sCBRBalance : convert(_sCBRBalance), CBRBalance : convert(_CBRBalance), rCBRBalance : (+ethers.utils.formatUnits(_CBRBalance, 9)), rsCBRBalance :(+ethers.utils.formatUnits(_sCBRBalance, 9)) }

          } else {
            console.log("Ethereum is not present");
          }
        } catch (error) {
          console.log(error);
        }
      };  
    /*****************************STAKE FUNCTION END*******************************/

    /*****************************BOND FUNCTION*******************************/

    const bond = async(address, amount, decimal) => {
        try {
            if (ethereum) {

                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const bondContract = new ethers.Contract(bondContractAddress, bondContractABI, signer);
                
                const parsedAmount = ethers.utils.parseUnits(amount.toString(), decimal);
                console.log(amount)
                console.log(parsedAmount)
                console.log(decimal)
            
                await bondContract.swapExactLPtoToken(address, parsedAmount, {
                    gasPrice: gasPrice_
                });
            
                
            }
            else {
                console.log("Ethereum is not present");
              }
          } catch (error) {
            console.log("something went wrong!")

            console.log(error);
          }
    }
    const approve = async (address) => {
        try {
            if (ethereum) {

                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const tokenContract = new ethers.Contract(address, tokenContractABI, signer);
                const inputString = "115792089237316195423570985008687907853269984665640564039457584007913129639935";
                const parsedAmount = ethers.utils.parseUnits(inputString, 0)


                await tokenContract.approve(bondContractAddress, parsedAmount, {
                    gasPrice: gasPrice_
                }); 
            
                
            }
            else {
                console.log("Ethereum is not present");
              }
          } catch (error) {
            console.log("something went wrong!")

            console.log(error);
          }
    }
    const getAllowance = async(address, setAllowance) => {
        const accounts = await ethereum.request({ method: "eth_accounts" });
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const tokenContract = new ethers.Contract(address, tokenContractABI, signer);
        const allowance = await tokenContract.allowance(accounts[0], bondContractAddress);
        const bignum = "15792089237316195423570985008687907853269984665640564039457584007913129639935"
        const parsedAmount = ethers.utils.parseUnits(bignum, 0)
        console.log(allowance)
        console.log(parsedAmount)
        setAllowance(allowance.gt(parsedAmount))

    }
    const getRealTimeDiscountRatePrice = async(address, setBondPriceInfo) => {
        try {
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum)
                const bondContract = new ethers.Contract(bondContractAddress, bondContractABI, provider);
                const _discountRate = await bondContract.realTimeDiscountRate(address);
                const _discountedPrice = await bondContract.discountedPrice(address);

                const discountRatePrice = { rate : convertfinal(_discountRate, 4, 2), price : convertfinal(_discountedPrice, 4, 4)}
                setBondPriceInfo(discountRatePrice)
            }
            else {
                console.log("Ethereum is not present");
              }
          } catch (error) {
            console.log("something went wrong!")

            console.log(error);
          }
    }
    
    const getUserStableLPvalue = async (decimals, address, setBalanceInfo) => {
        try {
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const bondHelpContract = new ethers.Contract(bondHelpContractAddress, bondHelpContractABI, signer);
                const a = await bondHelpContract.getUserStableLPvalue(address);
                const balanceInfo = {lpBalance : convertfinal(a[0], decimals, 6), lpBalanceFull : convertfinal(a[0], decimals, decimals), userlpinUSD : convertfinal(a[1], 18, 2)}
                console.log(balanceInfo);
                setBalanceInfo(balanceInfo);

            }
            else {
                console.log("Ethereum is not present");
              }
          } catch (error) {
            console.log("something went wrong!")

            console.log(error);
          }
    }
    
    const getLPValueCBRAmount = async (decimals, address, lpAmount, CBRUSD, setCBRAmount, setLPinUSD) => {
        try {
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const bondHelpContract = new ethers.Contract(bondHelpContractAddress, bondHelpContractABI, provider);

                const parsedLPAmount = ethers.utils.parseUnits(lpAmount.toString(), decimals);
                const parsedCBRUSD = ethers.utils.parseUnits(CBRUSD.toString(), 4);
                const a = await bondHelpContract.getInputLPValueTokenAmount(address, parsedLPAmount, parsedCBRUSD);
                const lpinUSD = convertfinal(a[0], 18, 2)
                const cbrAmount = convertfinal(a[3], 9, 4)
                setLPinUSD(lpinUSD)
                setCBRAmount(cbrAmount)
                
            }
            else {
                console.log("Ethereum is not present");
              }
          } catch (error) {
            console.log("something went wrong!")

            console.log(error);
          }
    }

    const getKSPValue = async (setKSPPrice) => {
        try {
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const bondHelpContract = new ethers.Contract(bondHelpContractAddress, bondHelpContractABI, provider);
                const a = await bondHelpContract.getRatioWithToken(KSPAddress);
                const b = convertfinal(a[0], 18, 4)
                setKSPPrice(b)
            }
            else {
                console.log("Ethereum is not present");
              }
          } catch (error) {
            console.log("something went wrong!")

            console.log(error);
          }
    }

    /*****************************BOND FUNCTION END*******************************/



    /*****************************AS FUNCTION*******************************/
    const auctionSwap = async (klayAmount, setLoading, setToastType) => {
        try {
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const ASContract = new ethers.Contract(auctionSwapContractAddress, auctionSwapContractABI, signer);
                const parsedAmount = ethers.utils.parseUnits(klayAmount.toString(), 18);
             
                const swap = await ASContract.pledge(parsedAmount, { value: parsedAmount, gasPrice : gasPrice_}, );
                setLoading(true);
                setToastType("submit")
                await swap.wait()
                setLoading(false);
                setToastType("success")
    
    
    
                }else {
                    console.log("Ethereum is not present");
                  }
              } catch (error) {
                console.log("something went wrong!")
                setLoading(false);
                setToastType("fail")
                console.log(error);
              }
    }
   
    const getAuctionSwapInfo = async (setGenInfo, setIndInfo) => {
        try {
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const ASContract = new ethers.Contract(auctionSwapContractAddress, auctionSwapContractABI, provider);
                const ASgenInfo = await ASContract.getFrontGenInfo();
                
                const ASgenInfoObj = {
                    totalFund : convertfinal(ASgenInfo[0], 18, 0), 
                    goal : convertfinal(ASgenInfo[1], 18, 0), 
                    percent : convertfinal(ASgenInfo[2], 16, 0),
                    klayLeft : +convertfinal(ASgenInfo[1], 18, 0) - +convertfinal(ASgenInfo[0], 18, 0)
                }
                console.log(ASgenInfoObj)
                
                setGenInfo(ASgenInfoObj)
                const ASContractForInd = new ethers.Contract(auctionSwapContractAddress, auctionSwapContractABI, signer);
                const ASIndInfo = await ASContractForInd.getFrontInfo();
                
                const ASIndInfoObj = {
                    klayBalance : convertfinal(ASIndInfo[0], 18, 4),
                    VTRBalance : convertfinal(ASIndInfo[1], 9, 4)
                }
                setIndInfo(ASIndInfoObj)
                console.log(ASIndInfoObj)
            }else {
                console.log("Ethereum is not present");
              }
          } catch (error) {
            console.log("something went wrong!")
            console.log(error);
          }
    }

    const getKlayToVTR = async (setVTRAmount, klayAmount) => {
        try {
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const ASContract = new ethers.Contract(auctionSwapContractAddress, auctionSwapContractABI, provider);
                const parsedAmount = ethers.utils.parseUnits(klayAmount.toString(), 18);
                const VTRAmount = await ASContract.getVTRAmountforExactKlay(parsedAmount);
                setVTRAmount(convertfinal(VTRAmount, 9, 0))

               
            }else {
                console.log("Ethereum is not present");
              }
          } catch (error) {
            console.log("something went wrong!")
            console.log(error);
          }
    }

















    


      


    useEffect(() => {
        checkIfWalletIsConnect();
        setNetwork();
      }, []);

      return (
        <Context.Provider
          value={{
           connectWallet,
           currentAccount,
           getStakeInfo,
           setNetwork,
           setCBR,
           setsCBR,
           stake,
           unstake,
           newNet,
           getKSPValue,
           getLPValueCBRAmount,
           getUserStableLPvalue,
           getAuctionSwapInfo, 
           getKlayToVTR,
           auctionSwap,
           getRealTimeDiscountRatePrice,
           bond, 
           approve, 
           getAllowance, 
          }}
        >
          {children}
        </Context.Provider>
      );
};