import { Configuration } from '@solid-soda/config';
import { UserClient } from '@trip-a-trip/lib';

export const coreUserProvider = {
  provide: UserClient,
  useFactory: (config: Configuration) => {
    const serviceUrl = config.getStringOrThrow('CORE_USER_URL');

    return new UserClient(serviceUrl);
  },
  inject: [Configuration],
};
