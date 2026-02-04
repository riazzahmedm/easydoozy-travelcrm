import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../prisma/prisma.service";
import { LoginDto } from "./dto/login.dto";
import { UserRole } from "@prisma/client";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) { }

async login(dto: LoginDto) {
  const user = await this.prisma.user.findUnique({
    where: { email: dto.email },
    include: {
      tenant: {
        select: {
          status: true,
        },
      },
    },
  });

  if (!user || !user.isActive) {
    throw new UnauthorizedException("Invalid credentials");
  }

  if (
    user.role !== UserRole.SUPER_ADMIN &&
    user.tenant.status !== "ACTIVE"
  ) {
    throw new UnauthorizedException(
      "Tenant account is suspended"
    );
  }

  const isValid = await bcrypt.compare(dto.password, user.password);
  if (!isValid) {
    throw new UnauthorizedException("Invalid credentials");
  }

  return this.generateToken(user);
}


  async generateToken(user: any) {
    const payload = {
      sub: user.id,
      tenantId: user.tenantId,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
