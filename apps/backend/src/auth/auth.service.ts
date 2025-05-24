import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly user = {
    id: '1',
    email: 'user@example.com',
    password: 'password',
  };

  constructor(private jwtService: JwtService) { }

  validateUser(email: string | undefined, pass: string | undefined) {
    if (email === this.user.email && pass === this.user.password) {
      const { password: _password, ...result } = this.user;
      return result;
    }
    return null;
  }

  login(dto: LoginDto | undefined) {
    const user = this.validateUser(dto?.email, dto?.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: user.id, email: user.email };
    return { token: this.jwtService.sign(payload) };
  }
}
