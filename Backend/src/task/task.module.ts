import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { GuardsModule } from 'src/auth/guards/guards.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), UserModule,GuardsModule],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
