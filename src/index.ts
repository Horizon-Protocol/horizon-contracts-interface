import {
	getSource,
	getTarget,
	getSynths,
	getUsers,
	toBytes32,
	getVersions,
	getSuspensionReasons,
	getStakingRewards,
	networks,
	networkToChainId,
	getNetworkFromId,
	getTokens,
	decode,
	defaults,
	getFeeds,
} from '@horizon-protocol/smart-contract';
import { ethers } from 'ethers';

import {
	Config,
	CurrencyKey,
	CurrencyCategory,
	Network,
	NetworkId,
	Target,
	TargetsRecord,
	ContractsMap,
	HorizonJS,
	Synth,
	Token,
} from './types';

import { Synths } from '../generated/mainnet';

import { ERRORS } from './constants';

const horizon = ({ networkId, network, signer, provider }: Config): HorizonJS => {
	const [currentNetwork, currentNetworkId, useOvm] = selectNetwork(networkId, network);
	return {
		network: {
			id: currentNetworkId,
			name: currentNetwork,
			useOvm,
		},
		networks,
		networkToChainId,
		decode,
		defaults,
		feeds: getFeeds({ network: currentNetwork, useOvm }),
		tokens: getTokens({ network: currentNetwork, useOvm }),
		sources: getSource({ network: currentNetwork, useOvm }),
		targets: getTarget({ network: currentNetwork, useOvm }),
		synths: getSynths({ network: currentNetwork, useOvm }),
		users: getUsers({ network: currentNetwork, useOvm }),
		versions: getVersions({ network: currentNetwork, useOvm }),
		stakingRewards: getStakingRewards({ network: currentNetwork, useOvm }),
		suspensionReasons: getSuspensionReasons(),
		toBytes32,
		utils: ethers.utils,
		contracts: getHorizonContracts(currentNetwork, signer, provider, useOvm),
	};
};

const selectNetwork = (networkId?: NetworkId, network?: Network): [Network, NetworkId, boolean] => {
	let currentNetwork: Network = Network.Mainnet;
	let currentNetworkId: NetworkId = NetworkId.Mainnet;
	let useOvm = false;
	if (
		(network && !networkToChainId[network]) ||
		(networkId && !getNetworkFromId({ id: networkId }))
	) {
		throw new Error(ERRORS.badNetworkArg);
	} else if (network && networkToChainId[network]) {
		const networkToId = Number(networkToChainId[network]);
		const networkFromId = getNetworkFromId({ id: networkToId });
		currentNetworkId = networkToId;
		currentNetwork = networkFromId.network;
		useOvm = networkFromId.useOvm;
	} else if (networkId) {
		const networkFromId = getNetworkFromId({ id: networkId });
		currentNetworkId = networkId;
		currentNetwork = networkFromId.network;
		useOvm = networkFromId.useOvm;
	}
	return [currentNetwork, currentNetworkId, useOvm];
};

const getHorizonContracts = (
	network: Network,
	signer?: ethers.Signer,
	provider?: ethers.providers.Provider,
	useOvm?: boolean
): ContractsMap => {
	const sources = getSource({ network, useOvm });
	const targets: TargetsRecord = getTarget({ network, useOvm });

	return Object.values(targets)
		.map((target: Target) => {
			if (target.name === 'Synthetix') {
				target.address = targets.ProxyERC20.address;
			} else if (target.name === 'ZassetzUSD') {
				target.address = targets.ProxyERC20zUSD.address;
			} else if (target.name === 'FeePool') {
				target.address = targets.ProxyFeePool.address;
			} else if (target.name.match(/Zasset(z|i)[a-zA-Z]+$/)) {
				const newTarget = target.name.replace('Zasset', 'Proxy');
				target.address = targets[newTarget].address;
			}
			return target;
		})
		.reduce((acc: ContractsMap, { name, source, address }: Target) => {
			acc[name] = new ethers.Contract(
				address,
				sources[source].abi,
				signer || provider || ethers.getDefaultProvider(network)
			);
			return acc;
		}, {});
};

export {
	horizon,
	Network,
	NetworkId,
	Synths,
	CurrencyCategory,
	networkToChainId,
	getNetworkFromId,
};
export type { Config, CurrencyKey, Target, TargetsRecord, ContractsMap, HorizonJS, Synth, Token };
export default horizon;
