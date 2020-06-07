import { Configuration } from '@solid-soda/config';
import { CollaborationClient } from '@trip-a-trip/lib';

export const coreCollaborationProvider = {
  provide: CollaborationClient,
  useFactory: (config: Configuration) => {
    const serviceUrl = config.getStringOrThrow('CORE_COLLABORATION_URL');

    return new CollaborationClient(serviceUrl);
  },
  inject: [Configuration],
};
