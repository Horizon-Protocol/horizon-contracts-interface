import { ethers } from 'ethers';
import {
  FeedRecord,
  SourceRecord,
  StakingReward,
  Future,
  PerpsV2,
  PerpsV2ProxiedMarkets,
  Target,
  TargetsRecord,
  Token,
  User,
  Version,
  networkToChainId,
} from '@horizon-protocol/smart-contract';

import { Synths as MainnetSynths } from '../generated/mainnet';
import { Synths as TestnetSynths } from '../generated/testnet';

export const NetworkIdByName = {
  mainnet: 56,
  testnet: 97,
} as const;

export const NetworkNameById = {
  56: 'mainnet',
  97: 'testnet',
} as const;

export type NetworkIdByNameType = typeof NetworkIdByName;
export type NetworkName = keyof typeof NetworkIdByName;
export type NetworkId = typeof NetworkIdByName[keyof typeof NetworkIdByName];

export type HorizonJS = {
  networks: Array<NetworkName>;
  networkToChainId: typeof networkToChainId;
  decode: (config: { network: NetworkName; data: string; target: Target }) => {
    method: { name: string; params: Array<any> };
    contract: string;
  };
  defaults: { [key: string]: any };
  feeds: FeedRecord;
  tokens: Array<Token>;
  network: {
    id: NetworkId;
    name: NetworkName;
    useOvm: boolean;
  };
  sources: SourceRecord;
  targets: TargetsRecord;
  synths: Synth[];
  versions: { [version: string]: Version };
  stakingRewards: Array<StakingReward>;
  suspensionReasons: { [code: number]: string };
  futuresMarkets: Array<Future>;
  perpsMarkets: Array<PerpsV2>;
  perpsV2ProxideMarkets: Array<PerpsV2ProxiedMarkets>;
  users: User[];
  toBytes32: (key: string) => string;
  utils: typeof ethers.utils;
  contracts: ContractsMap;
};

export type ContractsMap = {
  [name: string]: ethers.Contract;
};

export type Config = {
  networkId?: NetworkId;
  network?: NetworkName;
  signer?: ethers.Signer;
  provider?: ethers.providers.Provider;
  useOvm?: boolean;
};

export type CurrencyKey = keyof typeof MainnetSynths | keyof typeof TestnetSynths;

export enum CurrencyCategory {
  'crypto' = 'Crypto',
  'forex' = 'Forex',
  'equity' = 'Equity',
  'commodity' = 'Commodity',
}

export type Synth = {
  name: CurrencyKey;
  asset: string;
  category: CurrencyCategory;
  sign: string;
  description: string;
  aggregator?: string;
  subclass?: string;
};
