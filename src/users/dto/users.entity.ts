import { Articles } from '../../articles/articles.entity';
import { Token } from '../../token/token.entity';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100 })
  email: string;

  @Column({ length: 100 })
  password: string;

  @OneToOne(() => Token, (token) => token.user, { onDelete: 'CASCADE' })
  token: Token;

  @OneToMany(() => Articles, (articles) => articles.user, {
    cascade: true,
  })
  articles: Articles[];
}
