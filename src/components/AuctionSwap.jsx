import React from 'react'

const AuctionSwap = () => {
    return (
        <div className="p-1">
            <div className="flex h-80 rounded-lg max-w-3xl m-auto">
                <div className="flex-1 bg-gray-100 rounded-l-lg p-3">
                    <div className="p-3">
                        <p className="text-sm font-semibold text-stone-500 mb-4">From</p>
                        <div className="flex">
                            <input 
                                className="outline-none text-2xl text-gray-600 placeholder-slate-400 bg-gray-100 placeholder-font-light w-1 flex-grow"
                                type="number"
                                placeholder="0"
                                step="0.0001"/>
                            <p>여기토큰</p>
                        </div>
                        <div className="flex justify-between">
                            <p className="text-sm text-gray-500 my-4">Balance</p>
                            <p>여기토큰</p>
                        </div>
                    </div>
                    <div className="border-solid border-1 border-t border-gray-300"></div>
                    <div className="p-3">
                        <p className="text-sm mt-1 font-semibold text-stone-500 mb-4">To</p>
                        <div className="flex">
                            <input 
                                className="outline-none text-2xl text-gray-600 placeholder-slate-400 bg-gray-100 placeholder-font-light w-1 flex-grow"
                                type="number"
                                placeholder="0"
                                step="0.0001"/>
                            <p>여기토큰</p>
                        </div>
                        <div className="flex justify-between">
                            <p className="text-sm text-gray-500 my-4">Balance</p>
                            <p>여기토큰</p>
                        </div>
                    </div>
                </div>
                <div className="h-full text-3xl cursor-pointer hover:bg-stone-500 font-medium text-gray-100 flex justify-center items-center p-10 bg-stone-400 w-40 rounded-r-lg">
                    <p>Swap</p>
                </div>

            </div>

        </div>
    )
}

export default AuctionSwap
