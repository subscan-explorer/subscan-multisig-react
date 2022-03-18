import type { Observable } from 'rxjs';
import type { ApiInterfaceRx } from '@polkadot/api/types';
import type { OverrideBundleDefinition } from '@polkadot/types/types';
import { DeriveBalancesAll } from '@polkadot/api-derive/types';
export declare function getBalance(instanceId: string, api: ApiInterfaceRx): () => Observable<DeriveBalancesAll>;
declare const definitions: OverrideBundleDefinition;
export default definitions;
