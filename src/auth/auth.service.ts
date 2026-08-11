import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
    constructor(private userService: UserService, private jwtService: JwtService){}

    async register(name: string, email: string, password: string, role?:string){
        const existingUser = await this.userService.findByEmail(email)
        if(existingUser){
            throw new ConflictException('Email already registered')
        }
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(password,saltRounds)
        const user = await this.userService.createUser(name, email, hashedPassword,role)
        const { password: _, ...result} = user
        return result
    }
    async login(email: string, password: string){
        const user = await this.userService.findByEmail(email)
        if(!user){
            throw new UnauthorizedException('Invalid Credentails')
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
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
