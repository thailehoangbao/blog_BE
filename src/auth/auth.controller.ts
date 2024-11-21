import { Controller,Post,Body, ValidationPipe , UsePipes, SetMetadata } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthService } from './auth.service';
import { User } from 'src/user/entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService){}

    @Post('register')
    @SetMetadata('isPublic', true)
    register(@Body() registerUserDto:RegisterUserDto):Promise<User> {
        return this.authService.register(registerUserDto)
    }
    
    @Post('login')
    @SetMetadata('isPublic', true)
    @ApiResponse({status:201,description:'Login successfully'})
    @ApiResponse({status:401, description:'Login fail'})
    @UsePipes(ValidationPipe)
    login(@Body() loginUserDto:LoginUserDto):Promise<any> {
        return this.authService.login(loginUserDto)
    }

    @Post('refresh-token')
    @SetMetadata('isPublic', true)
    refreshToken(@Body() {refresh_token}):Promise<any> {
        console.log("refesh token")
        return this.authService.refreshToken(refresh_token)
    }
}
