import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import {stakingContractABI, stakingContractAddress, tokenContractAddress, bondContractABI, bondContractAddress, KSPAddress } from "../constant/Constant";

export const Context = React.createContext();

const { ethereum } = window;

const createStakeContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(stakingContractAddress, stakingContractABI, signer);

    return contract;
  };
  
export const Provider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState("")
    const [newNet, setnewNet] = useState(false);
    
    const convertfinal = (target, decimal, tofix) => {
        const token = ethers.utils.formatUnits(target, decimal)
        const string = (+token).toFixed(tofix)
        return string;
     }

    const getUserStableLPvalue = async (decimals, address, setBalanceInfo) => {
        try {
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const bondContract = new ethers.Contract(bondContractAddress, bondContractABI, signer);
                const a = await bondContract.getUserStableLPvalue(address);
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
                const bondContract = new ethers.Contract(bondContractAddress, bondContractABI, provider);
              console.log(decimals)
                const parsedLPAmount = ethers.utils.parseUnits(lpAmount.toString(), decimals);
                const parsedCBRUSD = ethers.utils.parseUnits(CBRUSD.toString(), 4);
                const a = await bondContract.getInputLPValueTokenAmount(address, parsedLPAmount, parsedCBRUSD);
                console.log(a);
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
                const bondContract = new ethers.Contract(bondContractAddress, bondContractABI, provider);
                const a = await bondContract.getRatioWithToken(KSPAddress);
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
    const stake = async (amount, setLoading, setToastType) => {
        try {
            if (ethereum) {
              const stakeContract = createStakeContract();
              const parsedAmount = ethers.utils.parseUnits(amount.toString(), 9);
              const stake = await stakeContract.stake(parsedAmount, {
                gasPrice: 750000000000,
                gasLimit: 482500
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
                gasPrice: 750000000000,
                gasLimit: 482500
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



     function secondsToHms(d) {
        d = Number(d);
        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);

    
        var hDisplay = h > 0 ? h + (h === 1 ? " hour, " : " hours, ") : "";
        var mDisplay = m > 0 ? m + (m === 1 ? " minute " : " minutes ") : "1 minute ";

        return hDisplay + mDisplay; 
    }
    const convert = (target) => {
        const token = ethers.utils.formatUnits(target, 9)
        const string = (+token).toFixed(4)
        return string;
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
            const genInfo = {round : ethers.utils.formatUnits(_round, 0), totalSupply : convert(_totalSupply), index : convert(_index), secondToHM : secondsToHms(_secondLeft), secondLeftPercent : parseFloat((100 - (_secondLeft.toNumber()/7200*100)).toFixed(1)), secondLeftPercent0 : parseFloat((100 - (_secondLeft.toNumber()/7200*100)).toFixed(0)), rate : (_rate.toNumber() - 10000)/100, roi : ((Math.pow((_rate.toNumber()/10000), 5 * 3) - 1) * 100).toFixed(4), apy : ((Math.pow((_rate.toNumber()/10000), 365 * 3) - 1) * 100).toFixed(1)}
            setGenInfo(genInfo)
            const [_indRound, _sCBRBalance, _CBRBalance] = await stakeContract.getFrontIndInfo();
            const indInfo = {indRound : ethers.utils.formatUnits(_indRound, 0), sCBRBalance : convert(_sCBRBalance), CBRBalance : convert(_CBRBalance), rCBRBalance : (+ethers.utils.formatUnits(_CBRBalance, 9)), rsCBRBalance :(+ethers.utils.formatUnits(_sCBRBalance, 9)) }
            setIndInfo(indInfo)
          } else {
            console.log("Ethereum is not present");
          }
        } catch (error) {
          console.log(error);
        }
      };  


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
          }}
        >
          {children}
        </Context.Provider>
      );
};