import { Controller, Get } from '@nestjs/common';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
    constructor(private categoryService:CategoryService){}
    @Get()
    fildAll(): Promise<Category[]> {
        return this.categoryService.findAll();
    }
}
