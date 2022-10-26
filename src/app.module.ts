import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { DatabaseProduction } from './db/DatabaseProduction';
import { DatabaseTest } from './db/DatabaseTest';
import { isTestEnv } from './utils/environment';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    UsersModule,
    isTestEnv ? DatabaseTest : DatabaseProduction,
    ProductsModule,
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
