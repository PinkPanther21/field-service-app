import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";


export class CreateTaskDto {
    @IsNotEmpty()
    @IsString()
    title!:string

    @IsOptional()
    @IsString()
    description!:string   
  

    @IsString()
    assignedTo!: string
    
    @IsString()
    createdBy!: string
}
