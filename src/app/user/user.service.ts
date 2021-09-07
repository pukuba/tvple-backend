import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { getRepository, Repository } from 'typeorm';
import env from "../../config/env"
import * as jwt from 'jsonwebtoken';
import { CreateUserDto } from './dto';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { validate } from 'class-validator';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) { }

    async create(dto: CreateUserDto) {
        const { username, phoneNumber, password, id } = dto;

        const qb = getRepository(UserEntity)
            .createQueryBuilder('user')
            .where('user.username = :username', { username })
            .orWhere('user.phoneNumber = :phoneNumber', { phoneNumber })
            .orWhere('user.id = :id', { id });

        const user = await qb.getOne();

        if (user) {
            const errors = { message: 'username과 phone Number, id는 유니크 해야 합니다.' };
            throw new HttpException({ message: 'Input data validation failed', errors }, HttpStatus.BAD_REQUEST);
        }

        const newUser = new UserEntity();
        newUser.username = username;
        newUser.phoneNumber = phoneNumber;
        newUser.password = password;
        newUser.id = id;

        const error = await validate(newUser);
        if (error.length > 0) {
            const _errors = { message: 'Userinput is not valid.' };
            throw new HttpException({ message: 'Input data validation failed', _errors }, HttpStatus.BAD_REQUEST);
        } else {
            const savedUser = await this.userRepository.save(newUser);
            return this.buildUserRO(savedUser);
        }
    }

    public generateUserJWT(user) {
        const today = new Date();
        const exp = new Date(today);
        exp.setDate(today.getDate() + 60);
        return jwt.sign({
            id: user.id,
            exp: exp.getTime() / 1000
        }, env.JWT_TOKEN);
    }

    private buildUserRO(user: UserEntity) {
        const { password, ...other } = user;
        const userRO = {
            ...other,
            token: this.generateUserJWT(user)
        };
        return { user: userRO };
    }
}
