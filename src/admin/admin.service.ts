import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../auth/prisma.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async findAll() {
    return this.prisma.admin.findMany();
  }

  async findOne(id: string) {
    return this.prisma.admin.findUnique({ where: { id: parseInt(id) } });
  }

  async create(data: { name: string; email: string; password: string }) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.prisma.admin.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });
  }

  async update(
    id: string,
    data: { name?: string; email?: string; password?: string },
  ) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return this.prisma.admin.update({
      where: { id: parseInt(id) },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.admin.delete({ where: { id: parseInt(id) } });
  }
  async findByEmail(email: string) {
    return this.prisma.admin.findUnique({ where: { email } });
  }

  async validateLogin(email: string, password: string): Promise<string> {
    const admin = await this.findByEmail(email);
    if (!admin) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const payload = { id: admin.id, email: admin.email };
    return this.jwtService.sign(payload);
  }
}
