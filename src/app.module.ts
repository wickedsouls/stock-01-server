import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { DatabaseProduction } from './db/DatabaseProduction';
import { DatabaseTest } from './db/DatabaseTest';
import { isTestEnv } from './utils/environment';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    UsersModule,
    isTestEnv ? DatabaseTest : DatabaseProduction,
    AuthModule,
  ],
})
export class AppModule {}
