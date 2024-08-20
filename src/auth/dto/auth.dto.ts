import { IsEmail, IsNotEmpty, IsString } from "class-validator"
export class AuthDto{
    @IsEmail()
    @IsNotEmpty()
    email:string

    @IsNotEmpty()
    @IsString()
    password:string
    @IsNotEmpty()  // Сделаем поле обязательным
    @IsString()
    action:string
    firstName?:string
}