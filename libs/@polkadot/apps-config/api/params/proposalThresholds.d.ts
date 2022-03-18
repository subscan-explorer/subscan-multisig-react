import type { ApiPromise } from '@polkadot/api';
export declare function getFastTrackThreshold(api: ApiPromise, isDefault: boolean): number;
export declare function getProposalThreshold(api: ApiPromise): number;
export declare function getSlashProposalThreshold(api: ApiPromise): number;
export declare function getTreasuryProposalThreshold(api: ApiPromise): number;
