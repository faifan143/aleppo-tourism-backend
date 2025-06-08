import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService,
  ) { }

  @Get()
  async findAll() {
    return this.adminService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.adminService.findOne(id);
  }

  @Post()
  async create(
    @Body() createAdminDto: { name: string; email: string; password: string },
  ) {
    return this.adminService.create(createAdminDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body()
    updateAdminDto: { name?: string; email?: string; password?: string },
  ) {
    return this.adminService.update(id, updateAdminDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.adminService.delete(id);
  }
  @Post('login')
  async login(
    @Body() { email, password }: { email: string; password: string },
    @Res() res: Response,
  ) {
    try {
      const accessToken = await this.adminService.validateLogin(
        email,
        password,
      );

      // Set a cookie for server-side authentication
      res.cookie('access_token', accessToken, {
        httpOnly: true, // Makes the cookie inaccessible via JavaScript
        secure: false, // Set to true in production to ensure HTTPS
        // maxAge: 3600000, // 1 hour
      });

      // Also return the token in the response for client-side storage
      return res.status(HttpStatus.OK).json({
        message: 'Login successful',
        token: accessToken
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }
}
