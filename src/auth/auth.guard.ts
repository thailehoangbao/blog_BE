import { CanActivate, ExecutionContext, HttpException, Injectable, UnauthorizedException} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
        @InjectRepository(User) private userRepository: Repository<User>,
        private reflector: Reflector
    ) {}
    async canActivate(context: ExecutionContext ):Promise<boolean> {
        
        console.log("vao AuthGaurd =>set user vào request")
        const isPublic = this.reflector.getAllAndOverride<string[]>('isPublic',[
            context.getHandler(),
            context.getClass()
        ])

        console.log("isPublic",isPublic)
        if (isPublic) {
            return true
        }
        const request = context.switchToHttp().getRequest()
        const token = this.extractTokenFromHeader(request);

        if(!token) {
            throw new UnauthorizedException();
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get<string>('SECRET')
            })
            const user = await this.userRepository.findOneBy({
                id: payload.id
            })
            request['user'] = user
            request['user_data'] = payload;

        } catch (error) {
            throw new HttpException({
                status:419,
                message:'Token expired'
            },419);
        }

        return true;
    }

    private extractTokenFromHeader(request: Request):string | undefined {
        const[type,token] = request.headers.authorization ? request.headers.authorization.split(' ') : [];

        return type === "Bearer" ? token : undefined;
    }
}