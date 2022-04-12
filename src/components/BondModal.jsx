import React, { useEffect, useState } from 'react';

function BondModal(pair) {
	const [first, setFirst] = useState(false);

	useEffect(() => {
		setFirst(true);
	}, []);
	return (
		<div
			onClick={e => {
				pair.setActive(!pair.active);
				e.stopPropagation();
			}}
			className="fixed inset-0 z-50 h-full w-screen bg-black/60 backdrop-blur"
		>
			<div
				onClick={e => {
					e.stopPropagation();
				}}
				className={`relative shadow-lg shadow-black p-3 top-1/2 -translate-y-1/2 inset-0 w-11/12 m-auto bg-gray-100 rounded-xl max-w-2xl ${
					first ? 'scale-100' : 'scale-0'
				} transition-all duration-500`}
			>
				<div className="mb-4 flex justify-between">
					<div
						className="cursor-pointer"
						onClick={() => {
							pair.setActive(!pair.active);
						}}
					>
						X
					</div>
					<div>
						<div className="flex items-center">
							<img className="w-9 h-9" src={pair.token1img} />
							<img
								className="relative transform -translate-x-3 w-9 h-9"
								src={pair.token2img}
							/>
							<p className="text-lg font-semibold -translate-x-2">
								DAI-KLAY LP
							</p>
						</div>
					</div>
					<div />
				</div>
				<div className="flex flex-col items-center">
					<p className="text-sm">Fixed Term</p>
					<p className="-m-1 text-sm">2 days</p>
					<div className="w-full flex justify-around">
						<div>
							<p className="text-lg text-gray-500">Bond Price</p>
							<p className="text-center text-2xl font-bold">$36.80</p>
						</div>
						<div>
							<div>
								<p className="text-lg text-gray-500">Market Price</p>
								<p className="text-center text-2xl font-bold">$35.81</p>
							</div>
						</div>
					</div>
					<div className="bg-slate-400 py-3 px-12 text-white text-lg font-normal m-4 rounded-lg ">
						Connect Wallet
					</div>
					<div className="flex flex-col space-y-2 w-full p-4 text-sm">
						<div className="flex justify-between">
							<p>Your Balance</p>
							<p>
								3.245 {pair.token1}-{pair.token2} LP
							</p>
						</div>
						<div className="flex justify-between">
							<p>You Will Get</p>
							<p>0.0000 sOHM</p>
						</div>
						<div className="flex justify-between">
							<p>Discount</p>
							<p>2.4%</p>
						</div>
						<div className="flex justify-between">
							<p>Duration</p>
							<p>2 days</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
export default BondModal;
