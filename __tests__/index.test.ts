import { ethers } from "ethers";
import findIndex from "lodash/findIndex";

import synthetix, { HorizonJS } from "../src";
import { Network, NetworkId } from "../src/types";
import { ERRORS } from "../src/constants";

describe("@horizon-protocol/js tests", () => {
  let hznjs: HorizonJS;

  beforeAll(() => {
    hznjs = synthetix({ network: Network.Testnet });
  });

  test("should return contracts", () => {
    expect(Object.keys(hznjs.targets).length).toBeGreaterThan(0);
  });

  test("should have the right mapping with the contracts", () => {
    const synthetixContract = hznjs.contracts["Synthetix"];
    const sUSDContract = hznjs.contracts["SynthsUSD"];
    const sXAGContract = hznjs.contracts["SynthsXAG"];
    expect(synthetixContract.address).toEqual(hznjs.targets.ProxyERC20.address);
    expect(sUSDContract.address).toEqual(hznjs.targets.ProxyERC20sUSD.address);
    expect(sXAGContract.address).toEqual(hznjs.targets.ProxysXAG.address);
  });

  test("should return the ethers object", () => {
    expect(typeof hznjs.utils).toBe(typeof ethers.utils);
  });

  test("should include the supported networks", () => {
    expect(hznjs.networkToChainId[Network.Mainnet]).toBe(
      NetworkId.Mainnet.toString()
    );
    expect(hznjs.networkToChainId[Network.Testnet]).toBe(
      NetworkId.Testnet.toString()
    );
  });

  test("should include the current network", () => {
    expect(hznjs.network.name).toBe(Network.Testnet);
    expect(hznjs.network.id).toBe(NetworkId.Testnet);
  });

  test("should return users", () => {
    expect(hznjs.users.length).toBeGreaterThan(0);
  });

  test("should return valid contracts", () => {
    const validContract = hznjs.contracts["Synthetix"];
    expect(validContract).not.toBe(undefined);
  });

  test("should not return an invalid contract", () => {
    const invalidContract = hznjs.contracts["RandomContract1234"];
    expect(invalidContract).toBe(undefined);
  });

  test("should get the right sources data", () => {
    const validSource = hznjs.sources["Synthetix"];
    expect(validSource.bytecode).not.toBe(undefined);
    expect(validSource.abi).not.toBe(undefined);
  });

  test("should not include invalid sources data", () => {
    const invalidSource = hznjs.sources["RandomContract1234"];
    expect(invalidSource).toBe(undefined);
  });

  test("should get the right synths data", () => {
    const validSynthIndex = findIndex(
      hznjs.synths,
      ({ name }) => name === "sETH"
    );
    expect(validSynthIndex).not.toBe(-1);
  });

  test("should not include invalid synths data", () => {
    const invalidSynthIndex = findIndex(
      hznjs.synths,
      ({ name }) => name === "mETH1234"
    );
    expect(invalidSynthIndex).toBe(-1);
  });

  test("should have a list of staking rewards", () => {
    const mainnetSnxjs = synthetix({ network: Network.Mainnet });
    expect(mainnetSnxjs.stakingRewards[0].name).toBeTruthy();
  });

  test("should return several versions", () => {
    expect(Object.keys(hznjs.versions).length).toBeGreaterThan(0);
  });

  test("should return suspension reasons", () => {
    expect(Object.keys(hznjs.suspensionReasons).length).toBeGreaterThan(0);
  });

  test("toBytes32 is working properly", () => {
    expect(hznjs.toBytes32("SNX")).toBe(
      "0x534e580000000000000000000000000000000000000000000000000000000000"
    );
  });

  test("the right defaults are available", () => {
    expect(Number(hznjs.defaults.WAITING_PERIOD_SECS)).toBeGreaterThan(0);
    expect(hznjs.defaults.SOME_RANDOM_NAME).toBe(undefined);
  });

  test("the correct tokens are returned", () => {
    expect(Object.keys(hznjs.tokens).length).toBeGreaterThan(0);
  });

  test("the right feeds are returned", () => {
    expect(hznjs.feeds.SNX.asset).toBe("SNX");
    expect(hznjs.feeds.SOME_RANDOM_FEED).toBe(undefined);
  });

  test("the decode method is defined", () => {
    expect(hznjs.decode).toBeTruthy();
    expect(typeof hznjs.decode).toBe("function");
  });

  test("should throw error with wrong network", () => {
    try {
      // @ts-ignore
      synthetix({ network: "wrongnetwork" });
    } catch (e) {
      expect(e.message).toEqual(ERRORS.badNetworkArg);
    }
  });
});
