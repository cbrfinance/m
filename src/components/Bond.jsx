import React, { useEffect, useState } from 'react';
import BondList from './BondList';
import pairs from './pairs';
function Bond() {
	const [first, setFirst] = useState(false);

	useEffect(() => {
		setFirst(true);
	}, []);

	return (
		<div className="p-1">
      
			<div className="flex flex-col space-y-4 md:flex-row md:space-y-0 m-auto md:space-x-4 max-w-3xl">
				<div
					className={`flex p-4 w-full bg-gray-100 flex-col items-center md:flex-1 rounded-lg ${
						first ? 'scale-100' : 'scale-0'
					} transition-all duration-700`}
				>
					<p className="font-normal text-xl text-gray-500">Treasury Balance</p>
					<p className="font-bold text-lg">$30,291,330</p>
				</div>

				<div
					className={`flex p-4 w-full bg-gray-100 flex-col items-center md:flex-1 rounded-lg ${
						first ? 'scale-100' : 'scale-0'
					} transition-all duration-700`}
				>
					<p className="font-normal text-xl text-gray-500">CBR Price</p>
					<p className="font-bold text-lg">$57.36</p>
				</div>
			</div>

			<div
				className={`bg-gray-100 rounded-lg mt-6 w-full max-w-3xl m-auto p-4 `} 
			>
				<h2 className="mb-4 font-extrabold text-lg">Bond (4,4)</h2>
				<div className="hidden md:flex text-center w-full max-w-2xl mb-7 m-auto">
					<h1 className="text-sm text-gray-400 flex-[2_2_0%]">Bond</h1>
					<h1 className="text-sm text-gray-400 flex-1">Price</h1>
					<h1 className="text-sm text-gray-400 flex-1">Discount</h1>
					<h1 className="text-sm text-gray-400 flex-1">Duration</h1>
					<div className="flex-1" />
				</div>

				{pairs.map(pair => (
					<BondList
            key={pair.token1+pair.token2}
						token1={pair.token1}
						token2={pair.token2}
						token1img={pair.token1img}
						token2img={pair.token2img}
					/>
				))}

       
			</div>
       
		</div>
	);
}
export default Bond;
