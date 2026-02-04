import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../prisma/prisma.service";
import { LoginDto } from "./dto/login.dto";
import { UserRole } from "@prisma/client";
import * as crypto from "crypto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";

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

  async forgotPassword(dto: ForgotPasswordDto, tenantId: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: dto.email,
        tenantId,
        isActive: true,
      },
    });

    // 🔐 Do NOT leak user existence
    if (!user) {
      return { message: "If the account exists, a reset link has been sent" };
    }

    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = await bcrypt.hash(token, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetTokenHash: tokenHash,
        resetTokenExp: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    // 🔗 Example reset link
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    // TODO: send email
    console.log("Reset link:", resetLink);

    return { message: "If the account exists, a reset link has been sent" };
  }

  async resetPassword(dto: ResetPasswordDto, tenantId: string) {
    const users = await this.prisma.user.findMany({
      where: {
        tenantId,
        resetTokenExp: {
          gt: new Date(),
        },
      },
    });

    const user = await Promise.all(
      users.map(async (u) => {
        if (!u.resetTokenHash) return null;
        const isMatch = await bcrypt.compare(dto.token, u.resetTokenHash);
        return isMatch ? u : null;
      })
    ).then((res) => res.find(Boolean));

    if (!user) {
      throw new BadRequestException("Invalid or expired token");
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetTokenHash: null,
        resetTokenExp: null,
      },
    });

    return { message: "Password reset successful" };
  }

}
