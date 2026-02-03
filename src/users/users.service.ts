import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../prisma/prisma.service";
import { CreateAgentDto } from "./dto/create-agent.dto";
import { UserRole } from "@prisma/client";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createAgent(dto: CreateAgentDto, tenantId: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException("Email already in use");
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        role: UserRole.AGENT,
        tenantId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  async listAgents(tenantId: string) {
    return this.prisma.user.findMany({
      where: {
        tenantId,
        role: UserRole.AGENT,
      },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async updateAgentStatus(
    agentId: string,
    isActive: boolean,
    tenantId: string
  ) {
    const agent = await this.prisma.user.findFirst({
      where: {
        id: agentId,
        tenantId,
        role: UserRole.AGENT,
      },
    });

    if (!agent) {
      throw new NotFoundException("Agent not found");
    }

    return this.prisma.user.update({
      where: { id: agent.id },
      data: { isActive },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
      },
    });
  }
}
