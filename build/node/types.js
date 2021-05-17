"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkId = exports.Network = void 0;
var Network;
(function (Network) {
    Network["Mainnet"] = "mainnet";
    Network["Testnet"] = "testnet";
})(Network = exports.Network || (exports.Network = {}));
var NetworkId;
(function (NetworkId) {
    NetworkId[NetworkId["Mainnet"] = 56] = "Mainnet";
    NetworkId[NetworkId["Testnet"] = 97] = "Testnet";
})(NetworkId = exports.NetworkId || (exports.NetworkId = {}));
