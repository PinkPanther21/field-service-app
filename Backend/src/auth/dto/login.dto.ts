import { IsString, IsEmail, MinLength, Matches, IsNotEmpty } from 'class-validator';

export class loginDto {
    @IsEmail()
    email!: string;

    @IsString()
    password!: string;
}