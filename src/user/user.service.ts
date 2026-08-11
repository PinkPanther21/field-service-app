import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
     constructor(@InjectRepository(User)
     private userRepository: Repository<User>,
    ){}

    async findByEmail(email: string): Promise<User | null>{
        return this.userRepository.findOne({where: {email}})        
    }

    async createUser(name: string, email: string, hashedPassword:string, role?:string): Promise<User> {
      const user = this.userRepository.create({
        name,
        email,
        password: hashedPassword,
        role: role as any,
      })
      return this.userRepository.save(user)
    }
    
    async findById(id: string):Promise<User | null>{
        return this.userRepository.findOne({where: {id}})
    }
}
