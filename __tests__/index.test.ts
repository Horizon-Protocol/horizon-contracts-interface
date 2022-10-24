import { ethers } from 'ethers';
import findIndex from 'lodash/findIndex';

import horizon, { HorizonJS } from '../src';
import { NetworkNameById, NetworkIdByName } from '../src/types';
import { ERRORS } from '../src/constants';

describe('@synthetixio/js tests', () => {
  let hznjs: HorizonJS;

  beforeAll(() => {
    hznjs = horizon({ network: NetworkNameById[97] });
  });

  test('should return contracts', () => {
    expect(Object.keys(hznjs.targets).length).toBeGreaterThan(0);
  });

  test('should have the right mapping with the contracts', () => {
    const synthetixContract = hznjs.contracts['Synthetix'];
    const zUSDContract = hznjs.contracts['ZassetzUSD'];
    const zBNBContract = hznjs.contracts['ZassetzBNB'];
    expect(synthetixContract.address).toEqual(hznjs.targets.ProxyERC20.address);
    expect(zUSDContract.address).toEqual(hznjs.targets.ProxyERC20zUSD.address);
    expect(zBNBContract.address).toEqual(hznjs.targets.ProxyzBNB.address);
  });

  test('should return the ethers object', () => {
    expect(typeof hznjs.utils).toBe(typeof ethers.utils);
  });

  test('should include the supported networks', () => {
    expect(hznjs.networkToChainId[NetworkNameById[56]]).toBe(NetworkIdByName.mainnet.toString());
    expect(hznjs.networkToChainId[NetworkNameById[97]]).toBe(NetworkIdByName.testnet.toString());
  });

  test('should include the current network', () => {
    expect(hznjs.network.name).toBe(NetworkNameById[97]);
    expect(hznjs.network.id).toBe(NetworkIdByName.testnet.toString());
  });

  test('should return users', () => {
    expect(hznjs.users.length).toBeGreaterThan(0);
  });

  test('should return valid contracts', () => {
    const validContract = hznjs.contracts['Synthetix'];
    expect(validContract).not.toBe(undefined);
  });

  test('should not return an invalid contract', () => {
    const invalidContract = hznjs.contracts['RandomContract1234'];
    expect(invalidContract).toBe(undefined);
  });

  test('should get the right sources data', () => {
    const validSource = hznjs.sources['Synthetix'];
    expect(validSource.bytecode).not.toBe(undefined);
    expect(validSource.abi).not.toBe(undefined);
  });

  test('should not include invalid sources data', () => {
    const invalidSource = hznjs.sources['RandomContract1234'];
    expect(invalidSource).toBe(undefined);
  });

  test('should get the right synths data', () => {
    const validSynthIndex1 = findIndex(hznjs.synths, ({ name }) => name === 'zBNB');
    expect(validSynthIndex1).not.toBe(-1);
    const validSynthIndex2 = findIndex(hznjs.synths, ({ name }) => name === 'zXVS');
    expect(validSynthIndex2).not.toBe(-1);
  });

  test('should not include invalid synths data', () => {
    const invalidSynthIndex = findIndex(
      hznjs.synths,
      ({ name }) => (name as unknown) === 'mETH1234'
    );
    expect(invalidSynthIndex).toBe(-1);
  });

  // TODO: not available for now.
  // test('should have a list of staking rewards', () => {
  // 	const mainnetHznjs = horizon({ network: Network.Mainnet });
  // 	expect(mainnetHznjs.stakingRewards[0].name).toBeTruthy();
  // });

  test('should return several versions', () => {
    expect(Object.keys(hznjs.versions).length).toBeGreaterThan(0);
  });

  test('should return suspension reasons', () => {
    expect(Object.keys(hznjs.suspensionReasons).length).toBeGreaterThan(0);
  });

  test('toBytes32 is working properly', () => {
    expect(hznjs.toBytes32('HZN')).toBe(
      '0x485a4e0000000000000000000000000000000000000000000000000000000000'
    );
  });

  test('the right defaults are available', () => {
    expect(Number(hznjs.defaults.WAITING_PERIOD_SECS)).toBeGreaterThan(0);
    expect(hznjs.defaults.SOME_RANDOM_NAME).toBe(undefined);
  });

  test('the correct tokens are returned', () => {
    expect(Object.keys(hznjs.tokens).length).toBeGreaterThan(0);
  });

  test('the right feeds are returned', () => {
    expect(hznjs.feeds.HZN.asset).toBe('HZN');
    expect(hznjs.feeds.SOME_RANDOM_FEED).toBe(undefined);
  });

  test('the decode method is defined', () => {
    expect(hznjs.decode).toBeTruthy();
    expect(typeof hznjs.decode).toBe('function');
  });

  test('should throw error with wrong network', () => {
    try {
      // @ts-ignore
      horizon({ network: 'wrongnetwork' });
    } catch (e) {
      expect((e as unknown as any).message).toEqual(ERRORS.badNetworkArg);
    }
  });
});
