import { Get, Post, Body, Put, Delete, Param, Controller, UsePipes } from '@nestjs/common';
import { CreateUserDto } from './dto';
@Controller('user')
export class UserController { }
