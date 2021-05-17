import { Config, Network, NetworkId, Target, TargetsRecord, ContractsMap, HorizonJS, Synth, Token } from "./types";
declare const horizon: ({ networkId, network, signer, provider, }: Config) => HorizonJS;
export { horizon, Network, NetworkId };
export type { Config, Target, TargetsRecord, ContractsMap, HorizonJS, Synth, Token, };
export default horizon;
