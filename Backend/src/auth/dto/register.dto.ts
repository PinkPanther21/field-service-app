import { IsString, IsEmail, MinLength, Matches, IsNotEmpty } from 'class-validator';

export class RegisterDto {
    @IsNotEmpty()
    @IsString()
    name!: string;

    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters' })
    @Matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, {
        message: 'Password must contain at least one uppercase letter, one number, and one special character'
    })
    password!: string;
}