import { Post } from 'src/post/entities/post.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column()
    password: string;

    @Column()
    email: string;

    @Column({nullable:true, default:null})
    refresh_token: string;

    @Column({nullable:true, default:null})
    avatar: string;

    @Column({ default: 1 })
    status: number;

    @Column({ default: 'User' })
    roles: string;

    @CreateDateColumn()
    created_at: Date;

    @CreateDateColumn()
    updated_at: Date;

    @OneToMany(() => Post, (post) => post.user)
    posts:Post[]
}
