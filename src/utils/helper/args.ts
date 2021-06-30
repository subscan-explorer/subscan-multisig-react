import { ApiPromise } from '@polkadot/api';

export interface IExtrinsic {
  id: string;
  method: string;
  section: string;
  args: string;
  signerId: string;
  isSuccess: boolean;
}

interface Arg {
  name: string;
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
}

export function parseArgs(api: ApiPromise, data: IExtrinsic | undefined): Arg[] {
  let result: Arg[] = [];

  try {
    result = JSON.parse(data?.args ?? '[]');
  } catch (_) {
    if (data) {
      const { args, method, section } = data;
      const { meta } = api.tx[section][method];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const argsMeta = meta.toHuman() as any;
      const aryReg = /\[(.*)\]/;
      const hashReg = /0x\w+/;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const address = args.match(aryReg)![1];
      const addressJson = JSON.stringify(address.split(',').map((item) => item.trim()));
      let str = args.replace(aryReg, addressJson);

      const hashArg = args.match(hashReg);

      if (hashArg) {
        str = str.replace(hashReg, '"' + hashArg[0] + '"');
      }

      const argsJson = JSON.parse(`[${str}]`);

      result = argsMeta?.args.map((def: Record<string, unknown>, index: number) => {
        return { name: def.name, type: def.type, value: argsJson[index] };
      });
    }
  }

  return result;
}
/**
 * 2,
 * [2pr19FiRxWEcerFt4tS3ZnJjhBXak69KNoJuGkaEY8ngBXEd, 2rGH1BB1E6fvTqiVrHMwNw8r5VrFYznvafn2Uf7amvYdCZ9f],
 * {"height":267732,"index":3},
 * 0x0403004a140433fbaf17a607b57bb2e01ffdb68534cdf8e353ef50ebdf681950d7fc4007003ad0b814,
 * true,
 * 186075000
 */
