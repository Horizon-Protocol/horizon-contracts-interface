"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkId = exports.Network = exports.horizon = void 0;
const smart_contract_1 = require("@horizon-protocol/smart-contract");
const ethers_1 = require("ethers");
const types_1 = require("./types");
Object.defineProperty(exports, "Network", { enumerable: true, get: function () { return types_1.Network; } });
Object.defineProperty(exports, "NetworkId", { enumerable: true, get: function () { return types_1.NetworkId; } });
const constants_1 = require("./constants");
const horizon = ({ networkId, network, signer, provider, }) => {
    const [currentNetwork, currentNetworkId, useOvm] = selectNetwork(networkId, network);
    return {
        network: {
            id: currentNetworkId,
            name: currentNetwork,
            useOvm,
        },
        networks: smart_contract_1.networks,
        networkToChainId: smart_contract_1.networkToChainId,
        decode: smart_contract_1.decode,
        defaults: smart_contract_1.defaults,
        feeds: smart_contract_1.getFeeds({ network: currentNetwork, useOvm }),
        tokens: smart_contract_1.getTokens({ network: currentNetwork, useOvm }),
        sources: smart_contract_1.getSource({ network: currentNetwork, useOvm }),
        targets: smart_contract_1.getTarget({ network: currentNetwork, useOvm }),
        synths: smart_contract_1.getSynths({ network: currentNetwork, useOvm }),
        users: smart_contract_1.getUsers({ network: currentNetwork, useOvm }),
        versions: smart_contract_1.getVersions({ network: currentNetwork, useOvm }),
        stakingRewards: smart_contract_1.getStakingRewards({ network: currentNetwork, useOvm }),
        suspensionReasons: smart_contract_1.getSuspensionReasons(),
        toBytes32: smart_contract_1.toBytes32,
        utils: ethers_1.ethers.utils,
        contracts: getHorizonContracts(currentNetwork, signer, provider, useOvm),
    };
};
exports.horizon = horizon;
const selectNetwork = (networkId, network) => {
    let currentNetwork = types_1.Network.Mainnet;
    let currentNetworkId = types_1.NetworkId.Mainnet;
    let useOvm = false;
    if ((network && !smart_contract_1.networkToChainId[network]) ||
        (networkId && !smart_contract_1.getNetworkFromId({ id: networkId }))) {
        throw new Error(constants_1.ERRORS.badNetworkArg);
    }
    else if (network && smart_contract_1.networkToChainId[network]) {
        const networkToId = Number(smart_contract_1.networkToChainId[network]);
        const networkFromId = smart_contract_1.getNetworkFromId({ id: networkToId });
        currentNetworkId = networkToId;
        currentNetwork = networkFromId.network;
        useOvm = networkFromId.useOvm;
    }
    else if (networkId) {
        const networkFromId = smart_contract_1.getNetworkFromId({ id: networkId });
        currentNetworkId = networkId;
        currentNetwork = networkFromId.network;
        useOvm = networkFromId.useOvm;
    }
    return [currentNetwork, currentNetworkId, useOvm];
};
const getHorizonContracts = (network, signer, provider, useOvm) => {
    const sources = smart_contract_1.getSource({ network, useOvm });
    const targets = smart_contract_1.getTarget({ network, useOvm });
    return Object.values(targets)
        .map((target) => {
        if (target.name === "Synthetix") {
            target.address = targets.ProxyERC20.address;
        }
        else if (target.name === "SynthsUSD") {
            target.address = targets.ProxyERC20sUSD.address;
        }
        else if (target.name === "FeePool") {
            target.address = targets.ProxyFeePool.address;
        }
        else if (target.name.match(/Synth(s|i)[a-zA-Z]+$/)) {
            const newTarget = target.name.replace("Synth", "Proxy");
            target.address = targets[newTarget].address;
        }
        return target;
    })
        .reduce((acc, { name, source, address }) => {
        acc[name] = new ethers_1.ethers.Contract(address, sources[source].abi, signer || provider || ethers_1.ethers.getDefaultProvider(network));
        return acc;
    }, {});
};
exports.default = horizon;
