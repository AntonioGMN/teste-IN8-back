import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UsersModule } from '../users/users.module';
import { ArticlesController } from './articles.controller';
import { articlesProviders } from './articles.providers';
import { ArticlesService } from './articles.service';

@Module({
  imports: [DatabaseModule, UsersModule],
  controllers: [ArticlesController],
  providers: [...articlesProviders, ArticlesService],
})
export class ArticlesModule {}
