import { NetworkConfigV2 } from 'src/model';

const configs = require.context('./chains', false, /\.json$/);

const update: NetworkConfigV2 = {};
configs.keys().forEach((k) => {
  const c = configs(k);
  update[c.name] = c;
});

export const chains = update;
