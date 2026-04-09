import { Injectable, OnModuleInit } from '@nestjs/common';
import { Role } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.seedAdmin();
    await this.seedUser();
  }

  private async seedAdmin() {
    const adminEmail = this.configService.get<string>('SEED_ADMIN_EMAIL')!;
    const existingAdmin = await this.usersService.findByEmail(adminEmail);
    if (existingAdmin) {
      return;
    }

    await this.usersService.createSeedUser({
      email: adminEmail,
      password: await bcrypt.hash(
        this.configService.get<string>('SEED_ADMIN_PASSWORD')!,
        10,
      ),
      name: 'System Admin',
      role: Role.ADMIN,
    });
  }

  private async seedUser() {
    const userEmail = this.configService.get<string>('SEED_USER_EMAIL')!;
    const existingUser = await this.usersService.findByEmail(userEmail);
    if (existingUser) {
      return;
    }

    await this.usersService.createSeedUser({
      email: userEmail,
      password: await bcrypt.hash(
        this.configService.get<string>('SEED_USER_PASSWORD')!,
        10,
      ),
      name: 'Normal User',
      role: Role.USER,
    });
  }
}
