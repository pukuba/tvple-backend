import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import * as argon2 from 'argon2';

@Entity('user')
export class UserEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    phoneNumber: string;

    @Column()
    password: string;

    @BeforeInsert()
    async hashPassword() {
        this.password = await argon2.hash(this.password)
    }
}