import type { Observable } from 'rxjs';
import type { ApiInterfaceRx, RxResult } from '@polkadot/api/types';
import type { AccountData, AccountId } from '@polkadot/types/interfaces';
import type { OverrideBundleDefinition } from '@polkadot/types/types';
export declare const u64FromCurrency: (currency: string) => number;
export declare const createCustomAccount: <A = string>(
  currency: string,
  currencyToAsset: (curr: string, api?: ApiInterfaceRx | undefined) => A,
  accountDataType?: string
) => (
  instanceId: string,
  api: ApiInterfaceRx
) => RxResult<(arg: string | Uint8Array | AccountId) => Observable<AccountData>>;
declare const definitions: OverrideBundleDefinition;
export default definitions;
