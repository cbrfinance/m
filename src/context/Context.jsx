import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import {stakingContractABI, stakingContractAddress, tokenContractABI, tokenContractAddress } from "../constant/Constant";

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
    const [genInfo, setGenInfo] = useState({})
    const [indInfo, setIndInfo] = useState({})
    const [myBalance, setMyBalance] = useState()
    const [stakeAmount, setStakeAmount] = useState()
    const [myRealBalance, setMyRealBalance] = useState()
    const [newNet, setnewNet] = useState(false);
    
    
    
   
    const setCBRs = async () => {
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
    const stake = async (amount, setLoading) => {
        try {
            if (ethereum) {
              const stakeContract = createStakeContract();
              const parsedAmount = ethers.utils.parseUnits(amount.toString(), 9);
              const stake = await stakeContract.stake(parsedAmount, {
                gasPrice: 750000000000,
                gasLimit: 482500
            });
            setLoading(true);
            const receipt = await stake.wait()
            console.log(receipt)
            setLoading(false);
             {/* setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        console.log(`Success - ${transactionHash.hash}`);
             setIsLoading(false);*/}

            }else {
                console.log("Ethereum is not present");
              }
          } catch (error) {
            console.log("something went wrong!")
            setLoading(false);
            console.log(error);
          }
    }
    const unstake = async (amount, setLoading) => {
        try {
            if (ethereum) {
              const stakeContract = createStakeContract();
              const parsedAmount = ethers.utils.parseUnits(amount.toString(), 9);
              const stake = await stakeContract.unstake(parsedAmount, {
                gasPrice: 750000000000,
                gasLimit: 482500
            });
            setLoading(true);
            await stake.wait()
            setLoading(false);
             {/* setIsLoading(true);
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait();
        console.log(`Success - ${transactionHash.hash}`);
             setIsLoading(false);*/}

            }else {
                console.log("Ethereum is not present");
              }
          } catch (error) {
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

     const convert = (target) => {
        const token = ethers.utils.formatUnits(target, 9)
        const string = (+token).toFixed(4)
        return string;
     }



      const getStakeInfo = async (setGenInfo, setIndInfo) => {
        try {
          if (ethereum) {
            const stakeContract = createStakeContract();
    
            const [_round, _totalSupply, _index, _rate] = await stakeContract.getFrontGenInfo();
            const genInfo = {round : ethers.utils.formatUnits(_round, 0), totalSupply : convert(_totalSupply), index : convert(_index), rate : (_rate.toNumber() - 10000)/100, roi : ((Math.pow((_rate.toNumber()/10000), 5 * 3) - 1) * 100).toFixed(4), apy : ((Math.pow((_rate.toNumber()/10000), 365 * 3) - 1) * 100).toFixed(1)}
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
           setCBRs,
           stake,
           unstake,
           newNet,
          }}
        >
          {children}
        </Context.Provider>
      );
};