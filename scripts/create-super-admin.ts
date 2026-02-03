import { PrismaClient, UserRole } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const email = "sadmin@easydoozy.com";
  const password = "Admin@123";

  // 1. Ensure platform tenant exists
  let tenant = await prisma.tenant.findUnique({
    where: { slug: "platform" },
  });

  if (!tenant) {
    tenant = await prisma.tenant.create({
      data: {
        name: "Platform",
        slug: "platform",
      },
    });
  }

  // 2. Prevent duplicate SUPER_ADMIN
  const existingAdmin = await prisma.user.findFirst({
    where: {
      role: UserRole.SUPER_ADMIN,
    },
  });

  if (existingAdmin) {
    console.log("SUPER_ADMIN already exists. Aborting.");
    return;
  }

  // 3. Create SUPER_ADMIN
  const hashedPassword = await bcrypt.hash(password, 12);

  const admin = await prisma.user.create({
    data: {
      name: "Platform Admin",
      email,
      password: hashedPassword,
      role: UserRole.SUPER_ADMIN,
      tenantId: tenant.id,
    },
  });

  console.log("SUPER_ADMIN created:", admin.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
