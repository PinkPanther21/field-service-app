import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
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

  async findOne(id: string) {
    const task = await this.taskRepo.findOne({
      where: {id},
      relations: {
        assignedTo: true,
        createdBy: true
      }
    });
    if(!task){
      throw new NotFoundException("Task Not Found")
    }
    return task
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    const task = await this.taskRepo.update({id}, updateTaskDto)
    if(task.affected === 0){
      throw new NotFoundException(`Task wth ${id} not found`)
    }
    return this.findOne(id)
  }

  async remove(id: string) {
    const task = await this.taskRepo.delete({
      id
    })
    if(task.affected === 0){
      throw new NotFoundException()
    }
   return task
  }
}
