import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { PasswordEncryptionService } from './password-encryption.service';
import { jwtConfig } from '../../config/jwt.config';

@Module({
  controllers: [AuthController],
  imports: [PassportModule, UsersModule, JwtModule.registerAsync(jwtConfig)],
  providers: [AuthService, JwtStrategy, PasswordEncryptionService],
})
export class AuthModule {}
