import { Buffer } from 'buffer';
import process from 'process';

// Vite does not inject the Node globals that webpack 4 provided. Ledger
// transport and a few Polkadot packages still call Buffer and process.
globalThis.Buffer = Buffer;
globalThis.process = process;
