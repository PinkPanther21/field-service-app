import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('user')
export class UserController {
    constructor(private readonly userService:UserService){}

    @UseGuards(AuthGuard,RolesGuard)
    @Roles('admin')
    @Get('worker')
    getWorkers(){
        return this.userService.findAllWorkers()
    }
}
