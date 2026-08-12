import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { DataSource, Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TaskService {
  constructor(@InjectRepository(Task) private readonly taskRepo: Repository<Task>,
  private readonly dataSource: DataSource,
  private readonly userService: UserService
){}  
  async create(createTaskDto: CreateTaskDto) {
    const user = await this.userService.findById(createTaskDto.assignedTo)
    const createdByUser = await this.userService.findById(createTaskDto.createdBy)
    if(!user || user?.role !== 'worker'){
     throw new UnauthorizedException('Not authorized to access')
    }
    if (!createdByUser || createdByUser.role !== 'admin') {
  throw new UnauthorizedException('Only admin can create tasks');
}
    const newTask = this.taskRepo.create({
      title: createTaskDto.title,
      description: createTaskDto.description, 
      assignedTo: user,
      createdBy: createdByUser 
    }) 
    return await this.taskRepo.save(newTask)
  }

  async findAll() {
    return this.taskRepo.find({relations: {assignedTo: true,createdBy: true}});
  }

  findOne(id: string) {
    return `This action returns a #${id} task`;
  }

  update(id: string, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: string) {
    return `This action removes a #${id} task`;
  }
}
