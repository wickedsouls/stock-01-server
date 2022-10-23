import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuthDto } from './dtos/auth.dto';
import { ErrorMessages } from '../constants/errorMessages';
import { UserRole } from '../constants/users';
import { PasswordEncryptionService } from './password-encryption.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly passwordEncryptionService: PasswordEncryptionService,
  ) {}

  async validateUser(authDto: AuthDto) {
    const { name, password } = authDto;
    const user = await this.userService.findUserByName(name);
    await this.passwordEncryptionService.verifyPassword(
      password,
      user.password,
    );
    return user;
  }

  async login(authDto: AuthDto) {
    const { name, password } = await this.validateUser(authDto);
    return {
      access_token: this.jwtService.sign({ name, password }),
    };
  }

  async register(authDto: AuthDto) {
    const hashedPassword = await this.passwordEncryptionService.hashPassword(
      authDto.password,
    );
    const user = await this.userService.createUser({
      ...authDto,
      password: hashedPassword,
      role: UserRole.CUSTOMER,
    });
    return {
      ...user,
      access_token: this.jwtService.sign(user),
    };
  }
}
