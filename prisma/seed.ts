import { PrismaClient, UserRole } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const email = "sadmin@easydoozy.com";
  const password = "Admin@123";

  // Platform tenant
  let tenant = await prisma.tenant.findUnique({
    where: { slug: "platform" },
  });

  if (!tenant) {
    tenant = await prisma.tenant.create({
      data: {
        name: "Platform",
        slug: "platform",
        status: "ACTIVE",
      },
    });
  }

  const existingAdmin = await prisma.user.findFirst({
    where: { role: UserRole.SUPER_ADMIN },
  });

  if (existingAdmin) {
    console.log("SUPER_ADMIN already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      name: "Platform Admin",
      email,
      password: hashedPassword,
      role: UserRole.SUPER_ADMIN,
      tenantId: tenant.id,
    },
  });

  console.log("✅ SUPER_ADMIN created:", email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
