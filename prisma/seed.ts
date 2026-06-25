import { PrismaClient, Role, PropertyType, ClientIntent } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 12);
  const agentPassword = await bcrypt.hash("agent123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@remax.com" },
    update: {},
    create: {
      name: "Agency Admin",
      email: "admin@remax.com",
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  const agent = await prisma.user.upsert({
    where: { email: "agent@remax.com" },
    update: {},
    create: {
      name: "Jane Agent",
      email: "agent@remax.com",
      password: agentPassword,
      role: Role.AGENT,
    },
  });

  await prisma.client.deleteMany({
    where: { agentId: { in: [admin.id, agent.id] } },
  });

  await prisma.client.createMany({
    data: [
      {
        agentId: agent.id,
        name: "Maria Silva",
        phone: "+351 912 345 678",
        address: "Rua das Flores 12, Lisboa",
        propertyType: PropertyType.APARTMENT,
        bedrooms: 3,
        bathrooms: 2,
        sizeSqm: 95,
        price: 350000,
        intent: ClientIntent.SELL,
        notes: "Recently renovated kitchen. Flexible on closing date.",
      },
      {
        agentId: agent.id,
        name: "João Santos",
        phone: "+351 923 456 789",
        address: "Av. da Liberdade 45, Porto",
        propertyType: PropertyType.HOUSE,
        bedrooms: 4,
        bathrooms: 3,
        sizeSqm: 180,
        price: 1200,
        intent: ClientIntent.RENT,
        notes: "Looking for long-term tenants. Pets allowed.",
      },
    ],
  });

  console.log("Seed complete:");
  console.log("  Admin: admin@remax.com / admin123");
  console.log("  Agent: agent@remax.com / agent123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
