import { UseGuards, Controller, Post, Req, Body, UseInterceptors , UploadedFile, BadRequestException, Get, Query, Param, Put, Delete, UsePipes, ValidationPipe} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePostDto } from './dto/create-post.dto';
import { storageConfig } from 'helper/config';
import { AuthGuard } from 'src/auth/auth.guard';
import { extname } from 'path';
import { PostService } from './post.service';
import { FilterPostDto } from './dto/filter-post.dto';
import { Post as PostEntitty } from './entities/post.entity';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostController {
    constructor(private postService: PostService) {}

    @UseGuards(AuthGuard)
    @UsePipes(ValidationPipe)
    @Post()
    @UseInterceptors(FileInterceptor('thumbnail', {
        storage: storageConfig('post'),
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
    create(@Req() req:any, @Body() createPostDto:CreatePostDto, @UploadedFile() file:Express.Multer.File) {
        if (req.fileValidationError) {
            throw new BadRequestException(req.fileValidationError)
        }

        if (!file) {
            throw new BadRequestException('File không tồn tại')
        }

        return this.postService.create(req['user_data'].id, {...createPostDto,thumbnail: file.destination + '/' + file.filename})
    }

    @UseGuards(AuthGuard)
    @Get()
    findAll(@Query() query:FilterPostDto): Promise<any> {
        return this.postService.findAll(query)
    }

    @UseGuards(AuthGuard)
    @Get(':id')
    findDetail(@Param('id') id:string): Promise<PostEntitty> {
        return this.postService.findDetail(Number(id))
    }

    @UseGuards(AuthGuard)
    @Put(':id')
    @UseInterceptors(FileInterceptor('thumbnail', {
        storage: storageConfig('post'),
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
    update(@Param('id') id:string, @Req() req:any, @Body() updatePostDto:UpdatePostDto, @UploadedFile() file:Express.Multer.File) {
        if(req.fileValidationError) {
            throw new BadRequestException(req.fileValitionError)
        }
        
        if (file) {
            updatePostDto.thumbnail = file.destination + '/' + file.filename;
        }

        return this.postService.update(Number(id),updatePostDto)
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.postService.delete(Number(id))
    }

    @Post('cke-upload')
    @UseInterceptors(FileInterceptor('upload', {
        storage: storageConfig('ckeditor'),
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
    ckeUpload(@Body() data :any, @UploadedFile() file:Express.Multer.File) {
        console.log("data->",data)
        console.log(file)

        return {
            'url': `ckeditor/${file.filename}`
        }
    }
}
