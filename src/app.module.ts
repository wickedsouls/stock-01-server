import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { DatabaseProduction } from './db/DatabaseProduction';
import { DatabaseTest } from './db/DatabaseTest';
import { isTestEnv } from './utils/environment';

@Module({
  imports: [UsersModule, isTestEnv ? DatabaseTest : DatabaseProduction],
})
export class AppModule {}
