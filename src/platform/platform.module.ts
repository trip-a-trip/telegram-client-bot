import { UserClient, EatClient, CollaborationClient } from '@trip-a-trip/lib';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { ConfigModule } from '&app/external/config.module';

import { coreCollaborationProvider } from './coreCollaborationProvider';
import { coreUserProvider } from './coreUserProvider';
import { coreEatProvider } from './coreEatProvider';

@Module({
  imports: [ConfigModule],
  providers: [coreUserProvider, coreEatProvider, coreCollaborationProvider],
  exports: [UserClient, EatClient, CollaborationClient],
})
export class PlatformModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    // pass
  }
}
