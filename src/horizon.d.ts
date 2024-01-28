declare module '@horizon-protocol/smart-contract' {
  import { NetworkName, NetworkId } from '.';
  import ethers from 'ethers';

  type SourceData = {
    bytecode: string;
    abi: ethers.ContractInterface;
  };
  type SourceRecord = Record<string, SourceData>;
  type Target = {
    name: string;
    source: string;
    address: string;
    link: string;
    timestamp: string;
    txn: string;
    network: NetworkName;
  };

  export type TargetsRecord = Record<string, Target>;
  type Feed = {
    asset: string;
    category: string;
    description?: string;
    exchange?: string;
    feed?: string;
    sign: string;
  };
  export type FeedRecord = Record<string, Feed>;

  export type Token = {
    address: string;
    asset?: string;
    decimals: number;
    feed?: string;
    index?: Array<{
      asset: string;
      category: string;
      description: string;
      sign: string;
      units: number;
      weight: number;
    }>;
    inverted?: {
      entryPoint: number;
      lowerLimit: number;
      upperLimit: number;
    };
    name: string;
    symbol: string;
  };
  export type User = {
    name: string;
    address: string;
  };
  type ContractInfo = {
    address: string;
    replaced_in: string;
    status: string;
  };
  export type Version = {
    commit: string;
    contracts: { [name: string]: ContractInfo };
    date: string;
    fulltag: string;
    network: string;
    release: string;
    tag: string;
  };
  type VersionRecord = Record<string, Version>;

  type StakingReward = {
    name: string;
    rewardsToken: string;
    stakingToken: string;
  };

  type Future = {
    marketKey: string;
    asset: string;
    takerFee: string;
    makerFee: string;
    takerFeeNextPrice: string;
    makerFeeNextPrice: string;
    nextPriceConfirmWindow: string;
    maxLeverage: string;
    maxMarketValueUSD: string;
    maxFundingRate: string;
    1;
    skewScaleUSD: string;
  };

  type PerpsV2 = {
    marketKey: string;
    asset: string;
    makerFee: string;
    takerFee: string;
    overrideCommitFe: string;
    takerFeeDelayedOrder: string;
    makerFeeDelayedOrder: string;
    takerFeeOffchainDelayedOrder: string;
    makerFeeOffchainDelayedOrder: string;
    nextPriceConfirmWindow: string;
    delayedOrderConfirmWindow: string;
    minDelayTimeDelta: string;
    maxDelayTimeDelta: string;
    offchainDelayedOrderMinAge: string;
    offchainDelayedOrderMaxAge: string;
    maxLeverage: string;
    maxMarketValue: string;
    maxFundingVelocity: string;
    skewScale: string;
    offchainPriceDivergence: string;
    liquidationPremiumMultiplier: string;
    offchainMarketKey: string;
    paused: string;
    offchainPaused: string;
  };

  type PerpsV2ProxiedMarkets = {
    abi: ethers.ContractInterface;
    address: string;
  };

  export function getNetworkFromId(arg: { id: NetworkId | number }): {
    useOvm?: boolean;
    network: NetworkName;
  };
  export function getSource<
    T extends { network: NetworkName; useOvm?: boolean; contract?: string }
  >(
    arg: T
  ): T extends { network: NetworkName; useOvm?: boolean; contract: string } // If contract is provided we return Source data. If not we return the contracts map
    ? SourceData
    : SourceRecord;
  export function getTarget<
    T extends { network: NetworkName; useOvm?: boolean; contract?: string }
  >(
    arg: T
  ): T extends { network: NetworkName; useOvm?: boolean; contract: string } // If contract is provided we return Source data. If not we return the contracts map
    ? Target
    : TargetsRecord;

  export const chainIdMapping = {
    56: {
      useOvm: false,
      fork: false,
      network: 'mainnet',
    },
    97: {
      useOvm: false,
      fork: false,
      network: 'testnet',
    },
  } as const;
  export const networkToChainId = {
    mainnet: 56,
    testnet: 97,
  } as const;
  // eslint-disable-next-line
  export function getSynths(arg: { network: NetworkName; useOvm?: boolean }): any; // Note contract interface will generate enums for this and return the correct type to consumers
  export function getFeeds(arg: { network: NetworkName; useOvm?: boolean }): FeedRecord;
  export function getTokens(arg: { network: NetworkName; useOvm?: boolean }): Token[];
  export function getUsers(arg: { network: NetworkName; useOvm?: boolean }): User[];
  export function getVersions(arg: { network: NetworkName; useOvm?: boolean }): VersionRecord;
  export function toBytes32(key: string): string;
  export function getSuspensionReasons(): { [code: number]: string };
  export function getStakingRewards(arg: {
    network: NetworkName;
    useOvm?: boolean;
  }): StakingReward[];
  export function getFuturesMarkets(arg: { network: NetworkName; useOvm?: boolean }): Future[];
  export function getPerpsMarkets(arg: { network: NetworkName; useOvm?: boolean }): PerpsV2[];
  export function getPerpsV2ProxiedMarkets(arg: {
    network: NetworkName;
    useOvm?: boolean;
  }): PerpsV2ProxiedMarkets[];

  export const network: {
    id: NetworkId;
    name: NetworkName;
    useOvm: boolean;
  };
  export const networks: NetworkName[];
  export const networkToChainId: Record<NetworkName, NetworkId>;
  export const decode: (config: { network: NetworkName; data: string; target: Target }) => {
    // eslint-disable-next-line
    method: { name: string; params: Array<any> };
    contract: string;
  };
  // eslint-disable-next-line
  export const defaults: { [key: string]: any };
}
