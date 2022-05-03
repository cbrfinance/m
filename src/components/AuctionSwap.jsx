import React from 'react'

const AuctionSwap = () => {
    return (
        <div className="p-1">
            <div className="rounded-lg max-w-3xl m-auto md:flex">
                <div className="flex-1 rounded-lg rounded-b-none md:rounded-r-none md:rounded-lg bg-gray-100 p-3">
                    <div className="p-3">
                        <p className="text-sm font-semibold text-stone-500 mb-4">From</p>
                        <div className="flex items-center">
                            <input 
                                className="outline-none text-3xl text-gray-600 placeholder-slate-400 bg-gray-100 placeholder-font-light w-1 flex-grow"
                                type="number"
                                placeholder="0"
                                step="0.0001"/>
                            <img className="w-9" alt="" src="img/klaytnlogo.svg"/>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-500 my-4">Balance 56912</p>
                            <p className="text-sm font-semibold">KLAY</p>
                        </div>
                        
                    </div>
                    <div className="border-solid border-1 border-t border-gray-300"></div>
                    <div className="p-3">
                        <p className="text-sm mt-1 font-semibold text-stone-500 mb-4">To</p>
                        <div className="flex items-center">
                            <input 
                                className="outline-none text-3xl text-gray-600 placeholder-slate-400 bg-gray-100 placeholder-font-light w-1 flex-grow"
                                type="number"
                                placeholder="0"/>
                            <img className="w-8" alt="" src="https://cryptologos.cc/logos/convex-finance-cvx-logo.svg"/>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-500 my-4">Balance</p>
                            <p className="text-sm font-semibold ml-2">CBR</p>
                        </div>
                    </div>
                </div>
                <div className="rounded-lg rounded-t-none md:rounded-l-none md:rounded-lg text-2xl cursor-pointer hover:bg-stone-500 font-medium text-gray-100 flex justify-center items-center p-3 bg-stone-400">
                    <p>SWAP</p>
                </div>
            </div>



            <div className="rounded-lg max-w-3xl m-auto md:flex mt-5">
                <div className="bg-gray-100 rounded-lg p-10 text-slate-800 flex-1 rounded-lg rounded-b-none md:rounded-r-none md:rounded-lg bg-gray-100"> 
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
                <div className="rounded-lg rounded-t-none md:rounded-l-none md:rounded-lg text-2xl cursor-pointer hover:bg-neutral-500 font-medium text-gray-100 flex justify-center items-center p-3 bg-neutral-400">
                    <p>CLAIM</p>
                </div>
            </div>
                
            
        </div>
    )
}

export default AuctionSwap
