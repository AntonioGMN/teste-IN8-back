import { Injectable, Inject } from '@nestjs/common';
import { ResponseDto } from '../dto/response.dto';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/users.create.dto';
import { Users } from './dto/users.entity';
import * as bcrypt from 'bcrypt';
import { Token } from '../token/token.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject('Users_REPOSITORY')
    private usersRepository: Repository<Users>,
  ) {}

  async findAll(): Promise<Users[]> {
    return this.usersRepository.find();
  }

  async create(data: CreateUserDto): Promise<ResponseDto> {
    const hashPassword = await bcrypt.hashSync(data.password, 8);
    const user = new Users();

    user.email = data.email;
    user.name = data.name;
    user.password = hashPassword;

    return this.usersRepository
      .save(user)
      .then((resul) => {
        return <ResponseDto>{
          status: true,
          mensage: 'create',
        };
      })
      .catch((error) => {
        return <ResponseDto>{
          status: false,
          mensage: 'deu errror',
        };
      });
  }

  async findOne(email: string): Promise<Users | undefined> {
    return this.usersRepository.findOne({
      relations: { token: true },
      where: { email: email },
    });
  }

  async findTokenByUserId(userId: number): Promise<Token | undefined> {
    const { token } = await this.usersRepository.findOne({
      relations: { token: true },
      where: { id: userId },
    });

    return token;
  }

  async delete(userId: number) {
    return await this.usersRepository.delete(userId);
  }
}
