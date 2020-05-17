import { Configuration } from '@solid-soda/config';
import { EatClient } from '@trip-a-trip/lib';

export const coreEatProvider = {
  provide: EatClient,
  useFactory: (config: Configuration) => {
    const serviceUrl = config.getStringOrThrow('CORE_EAT_URL');

    return new EatClient(serviceUrl);
  },
  inject: [Configuration],
};
