import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/auth/prisma.service';
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) { }

    async register(createUserDto: CreateUserDto) {
        const { name, email, password } = createUserDto;

        // Check if user with this email already exists
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new HttpException(
                'User with this email already exists',
                HttpStatus.CONFLICT,
            );
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = await this.prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        // Generate JWT token
        const token = this.jwtService.sign({ userId: user.id, email: user.email });

        // Return user data (excluding password) and token
        const { password: _, ...result } = user;
        return {
            ...result,
            token,
        };
    }

    async login(loginUserDto: LoginUserDto) {
        const { email, password } = loginUserDto;

        // Find user by email
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new HttpException(
                'Invalid email or password',
                HttpStatus.UNAUTHORIZED,
            );
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new HttpException(
                'Invalid email or password',
                HttpStatus.UNAUTHORIZED,
            );
        }

        // Generate JWT token
        const token = this.jwtService.sign({ userId: user.id, email: user.email });

        // Return user data (excluding password) and token
        const { password: _, ...result } = user;
        return {
            ...result,
            token,
        };
    }

    async getUserProfile(userId: number) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                reviews: true,
            },
        });

        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        // Exclude password from response
        const { password, ...result } = user;
        return result;
    }

    async updateUser(userId: number, updateUserDto: UpdateUserDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        // Hash password if it's being updated
        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }

        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: updateUserDto,
        });

        // Exclude password from response
        const { password, ...result } = updatedUser;
        return result;
    }
} 