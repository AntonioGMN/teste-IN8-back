import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';
import { Token } from './token.entity';

@Injectable()
export class TokenService {
  constructor(
    @Inject('Token_REPOSITORY')
    private tokenRepository: Repository<Token>,
    private userService: UsersService,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  async save(token: string, userEmail: string) {
    try {
      const user = await this.userService.findOne(userEmail);

      const findedToken = await this.tokenRepository.findOne({
        relations: { user: true },
        where: { user },
      });

      if (findedToken) {
        this.tokenRepository.update(findedToken.id, { token: token });
      } else {
        this.tokenRepository.insert({ token: token, user });
      }
    } catch (err) {
      return err;
    }
  }

  async refreshToken(oldToken: string): Promise<string | null> {
    const findedToken = await this.tokenRepository.findOne({
      relations: { user: true },
      where: { token: oldToken },
    });

    if (findedToken) {
      const user = await this.userService.findOne(findedToken.user.email);
      return await this.authService.login(user);
    }
  }

  async delete(tokenId: number) {
    return this.tokenRepository.delete(tokenId);
  }
}
