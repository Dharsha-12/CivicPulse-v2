import { PrismaClient, Role, IssueCategory, IssueStatus } from "@prisma/client";
import { SEED_USERS, SEED_ISSUES } from "../src/lib/seed-data";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting CivicPulse v2 Idempotent Database Seed...");

  // 1. Upsert Demo Accounts
  const userMap = new Map<string, string>();

  for (const user of SEED_USERS) {
    const upsertedUser = await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        passwordHash: user.passwordHash,
        role: user.role as Role,
        city: user.city,
        department: user.department ?? null,
      },
      create: {
        id: user.id,
        name: user.name,
        email: user.email,
        passwordHash: user.passwordHash,
        role: user.role as Role,
        city: user.city,
        department: user.department ?? null,
      },
    });
    userMap.set(upsertedUser.email, upsertedUser.id);
    console.log(`✅ Upserted user: ${upsertedUser.email} (${upsertedUser.role})`);
  }

  // 2. Upsert Pre-Existing Tamil Nadu Civic Issues
  for (const issue of SEED_ISSUES) {
    const citizenId = userMap.get(issue.citizenEmail) || userMap.get("citizen@civicpulse.in");
    if (!citizenId) {
      throw new Error(`Citizen not found for issue ${issue.id}`);
    }

    const assignedWorkerId = issue.assignedWorkerEmail
      ? userMap.get(issue.assignedWorkerEmail) ?? null
      : null;

    const upsertedIssue = await prisma.issue.upsert({
      where: { id: issue.id },
      update: {
        title: issue.title,
        description: issue.description,
        category: issue.category as IssueCategory,
        status: issue.status as IssueStatus,
        latitude: issue.latitude,
        longitude: issue.longitude,
        address: issue.address,
        city: issue.city,
        imageUrl: issue.imageUrl ?? null,
        resolutionNote: issue.resolutionNote ?? null,
        resolvedAt: issue.resolvedAt ? new Date(issue.resolvedAt) : null,
        upvotes: issue.upvotes,
        citizenId,
        assignedWorkerId,
      },
      create: {
        id: issue.id,
        title: issue.title,
        description: issue.description,
        category: issue.category as IssueCategory,
        status: issue.status as IssueStatus,
        latitude: issue.latitude,
        longitude: issue.longitude,
        address: issue.address,
        city: issue.city,
        imageUrl: issue.imageUrl ?? null,
        resolutionNote: issue.resolutionNote ?? null,
        resolvedAt: issue.resolvedAt ? new Date(issue.resolvedAt) : null,
        upvotes: issue.upvotes,
        citizenId,
        assignedWorkerId,
        createdAt: new Date(issue.createdAt),
      },
    });

    console.log(`📍 Upserted issue: [${upsertedIssue.status}] ${upsertedIssue.title} (${upsertedIssue.city})`);
  }

  console.log("✨ CivicPulse v2 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error running seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
