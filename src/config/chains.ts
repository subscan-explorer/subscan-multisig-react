import { NetConfigV2, NetworkConfigV2 } from 'src/model';

const configs = import.meta.glob<{ default: NetConfigV2 }>('./chains/*.json', { eager: true });

const update: NetworkConfigV2 = {};
Object.values(configs).forEach((mod) => {
  const config = mod.default;
  update[config.name] = config;
});

export const chains = update;
