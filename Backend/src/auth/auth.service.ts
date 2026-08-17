import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt'
import { RegisterDto } from './dto/register.dto';
import { loginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(private userService: UserService, private jwtService: JwtService){}

    async register(registerDto: RegisterDto){
        const normalizedEmail = registerDto.email.toLowerCase().trim();
        const existingUser = await this.userService.findByEmail(normalizedEmail)
        if(existingUser){
            throw new ConflictException('Email already registered')
        }
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(registerDto.password,saltRounds)
        const user = await this.userService.createUser(registerDto.name, normalizedEmail, hashedPassword)
        const { password: _, ...result} = user
        return result
    }
    async login(loginDto: loginDto){
        const normalizedEmail = loginDto.email.toLowerCase().trim();
        const user = await this.userService.findByEmailWithPassword(normalizedEmail)
        if(!user){
            throw new UnauthorizedException('Invalid credentials')
        }

        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password)
        if(!isPasswordValid){
            throw new UnauthorizedException('Invalid credentials')
        }
        const payload = {sub: user.id,name: user.name, email: user.email, role: user.role}
        const token = this.jwtService.sign(payload)

        return {
            access_token: token,
            user: {id: user.id, name: user.name, email: user.email, role: user.role}
        }
    }
}
