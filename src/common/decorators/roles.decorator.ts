import { SetMetadata } from "@nestjs/common";
import { UserRole } from "@prisma/client";

export const ROLES_KEY = "roles";

/**
 * Usage:
 * @Roles(UserRole.SUPER_ADMIN)
 * @Roles(UserRole.TENANT_ADMIN, UserRole.AGENT)
 */
export const Roles = (...roles: UserRole[]) =>
  SetMetadata(ROLES_KEY, roles);
