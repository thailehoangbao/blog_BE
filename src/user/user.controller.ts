import {
  Controller,
  Get,
  UseGuards,
  Param,
  Post,
  Body,
  Put,
  Delete,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  ParseArrayPipe,
  SetMetadata
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'helper/config';
import { extname } from 'path';
import { Roles } from 'src/auth/decorator/role.decorator'; 

@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  // @SetMetadata('roles',['Admin'])
  @Roles('Admin')
  @ApiQuery({name: 'page'})
  @ApiQuery({name: 'items_per_page'})
  @ApiQuery({name: 'search'})
  @Get('get-all-user')
  findAll(@Query() query: FilterUserDto): Promise<User[]> {
    return this.userService.findAll(query);
  }

  @SetMetadata('roles',['Admin'])
  @Get('profile')
  profile(@Req() req:any) :Promise<User> {
    return this.userService.findOne(Number(req.user_data.id))
  }

  @Get(':id')
  findOne(@Param('id') id: string): any {
    return this.userService.findOne(Number(id));
  }

  @SetMetadata('roles',['Admin'])
  @Post('create')
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @SetMetadata('roles',['Admin'])
  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(Number(id), updateUserDto);
  }

  @SetMetadata('roles',['Admin'])
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.userService.delete(Number(id));
  }

  @SetMetadata('roles',['Admin'])
  @Delete('multiple')
  multipleDelete(@Query('ids', new ParseArrayPipe({items:String,separator:','})) ids: string[]) {
    return this.userService.multipleDelete(ids) 
  }

  @Post('upload-avatar')
  @UseInterceptors(FileInterceptor('avatar', { 
    storage: storageConfig('avatar'),
    fileFilter: (req,file,callback) => {
      const ext = extname(file.originalname);
      const allowedExtArr = ['.jpg','.png','.jpeg']
        if (!allowedExtArr.includes(ext)) {
          req.fileValidationError = `Sai định dạng. Chấp nhận : jpg, jpeg, png`
          callback(null,false)
        } else {
          const fileSize = parseInt(req.headers['content-length'])
          if (fileSize > 1024 * 1024 *5) {
            req.fileValidationError = 'File dung lượng lớn. Chấp nhận < 5Mb'
            callback(null,false)
          } else {
            callback(null, true)
          }
        }
    }
  }))
  uploadAvatar(@Req() req:any, @UploadedFile() file: Express.Multer.File) {
    if (req.fileValidationError) {
      throw new BadRequestException(req.fileValidationError)
    }

    if (!file) {
      throw new BadRequestException('File không tồn tại')
    }
    return this.userService.updateAvatar(req.user_data.id, file.destination + '/' + file.filename)
  }

}
