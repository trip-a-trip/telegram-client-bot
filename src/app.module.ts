import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule } from './external/config.module';
import { typeOrmProvider } from './external/typeOrmProvider';

@Module({
  imports: [ConfigModule, TypeOrmModule.forRootAsync(typeOrmProvider)],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    // pass
  }
}
