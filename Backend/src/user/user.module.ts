import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserController } from './user.controller';
import { AuthModule } from 'src/auth/auth.module';
import { GuardsModule } from 'src/auth/guards/guards.module';

@Module({
  imports:[TypeOrmModule.forFeature([User]), GuardsModule],
  providers: [UserService],
  exports:[UserService],
  controllers: [UserController]
})
export class UserModule {}
