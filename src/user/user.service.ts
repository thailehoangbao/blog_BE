import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DeleteResult, In, Like, Repository, UpdateResult } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async findAll(query :FilterUserDto): Promise<any> {
    const items_per_page = Number(query.items_per_page) || 10;
    const page = Number(query.page) || 1;
    const skip = (page - 1)*items_per_page;
    const keyword = query.search || '';
    const [res, total] = await this.userRepository.findAndCount({
      order: {created_at: "DESC"},
      take:  items_per_page,
      skip: skip,
      where:[
        {first_name: Like("%" +keyword+ "%")},
        {last_name: Like("%" +keyword+ "%")},
        {email: Like("%" +keyword+ "%")}
      ],
      select: [
        'id',
        'first_name',
        'last_name',
        'email',
        'status',
        'created_at',
        'updated_at',
      ],
    });

    const lastPage = Math.ceil(total/items_per_page);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const prevPage = page - 1 < 1 ? null : page - 1;

    return {
      data:res,
      total,
      currentPage:page,
      nextPage,
      lastPage,
      prevPage
    }
  }

  async findOne(id: number): Promise<User> {
    return await this.userRepository.findOneBy({ id });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashPassword = await bcrypt.hash(createUserDto.password, 10);
    return await this.userRepository.save({
      ...createUserDto,
      password: hashPassword,
    });
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    return await this.userRepository.update(id, updateUserDto);
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.userRepository.delete(id);
  }

  async updateAvatar(id: number, avatar:string): Promise<UpdateResult> {
    return this.userRepository.update(id, {avatar})
  }

  async multipleDelete(ids:string[]):Promise<DeleteResult > {
    return await this.userRepository.delete({id:In(ids)})
  }
}
