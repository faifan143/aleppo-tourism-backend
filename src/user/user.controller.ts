import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/user.guard';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        return this.userService.register(createUserDto);
    }

    @Post('login')
    async login(@Body() loginUserDto: LoginUserDto) {
        return this.userService.login(loginUserDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile/:id')
    async getUserProfile(@Param('id') id: string) {
        return this.userService.getUserProfile(parseInt(id));
    }

    @UseGuards(JwtAuthGuard)
    @Patch('update/:id')
    async updateUser(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        return this.userService.updateUser(parseInt(id), updateUserDto);
    }
} 