import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserClient, EatClient } from '@trip-a-trip/lib';

import { ConfigModule } from '&app/external/config.module';

import { coreUserProvider } from './coreUserProvider';
import { coreEatProvider } from './coreEatProvider';

@Module({
  imports: [ConfigModule],
  providers: [coreUserProvider, coreEatProvider],
  exports: [UserClient, EatClient],
})
export class PlatformModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    // pass
  }
}
