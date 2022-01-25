/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');

try {
	fs.mkdirSync(__dirname + '/generated/');
} catch {}

for (const network of ['mainnet', 'testnet']) {
	const synths = require(`@horizon-protocol/smart-contract/publish/deployed/${network}/synths.json`);

	const genTs = ['export enum Synths {'];

	for (const synth of synths) {
		if (!synth.name) continue;

		// ingore inverse currency
		if (synth.name[0] === 'i') continue;

		genTs.push(`  ${synth.name} = '${synth.name}',`);
	}

	genTs.push('}');

	fs.writeFileSync(__dirname + `/generated/${network}.ts`, genTs.join('\n'));
}
