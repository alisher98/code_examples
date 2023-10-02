import { Injectable } from '@nestjs/common';
import { AdminService } from '../admin/admin.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AdminDto } from '../storage/dto/admin.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const admin: AdminDto = await this.adminService.findOne(username);
    if (!admin) return null;
    if (admin && (await bcrypt.compare(pass, admin.password))) {
      const { password, ...result } = admin;
      return result;
    }
    return null;
  }

  async login(admin: AdminDto) {
    const payload = { id: admin.id, username: admin.username };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async changePassword(id, password) {
    password = await bcrypt.hash(password, 10);
    return this.adminService.changePassword(id, password);
  }
}
