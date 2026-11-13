import { prisma } from "./prisma";
import { SEED_USERS, SEED_ISSUES, SeedUser } from "./seed-data";
import { IssueCategory, IssueStatus, Role, Prisma } from "@prisma/client";

// In-Memory store for preview/demo when Neon PostgreSQL connection is not active yet
interface MemoryIssue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  status: IssueStatus;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  imageUrl?: string | null;
  resolutionNote?: string | null;
  resolvedAt?: Date | null;
  upvotes: number;
  citizenId: string;
  assignedWorkerId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

let inMemoryUsers: SeedUser[] = [...SEED_USERS];
let inMemoryIssues: MemoryIssue[] = SEED_ISSUES.map((issue) => {
  const citizen = SEED_USERS.find((u) => u.email === issue.citizenEmail) || SEED_USERS[2];
  const worker = issue.assignedWorkerEmail
    ? SEED_USERS.find((u) => u.email === issue.assignedWorkerEmail)
    : undefined;

  return {
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
    citizenId: citizen.id,
    assignedWorkerId: worker ? worker.id : null,
    createdAt: new Date(issue.createdAt),
    updatedAt: new Date(issue.createdAt),
  };
});

let isPrismaReachable: boolean | null = null;

async function checkPrisma(): Promise<boolean> {
  if (isPrismaReachable !== null) return isPrismaReachable;
  try {
    // Quick probe
    await prisma.$queryRaw`SELECT 1`;
    isPrismaReachable = true;
    return true;
  } catch (err) {
    console.warn("⚠️ Database unreachable, seamlessly operating with seeded in-memory state:", (err as Error).message);
    isPrismaReachable = false;
    return false;
  }
}

export async function findUserByEmail(email: string) {
  const normalizedEmail = email.toLowerCase().trim();
  const dbOk = await checkPrisma();
  if (dbOk) {
    try {
      return await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });
    } catch {
      // fallback
    }
  }

  const found = inMemoryUsers.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (!found) return null;
  return {
    id: found.id,
    name: found.name,
    email: found.email,
    passwordHash: found.passwordHash,
    role: found.role as Role,
    city: found.city,
    department: found.department ?? null,
    createdAt: new Date(),
  };
}

export async function createUser(data: {
  name: string;
  email: string;
  passwordHash: string;
  city: string;
  role?: Role;
  department?: string | null;
}) {
  const normalizedEmail = data.email.toLowerCase().trim();
  const dbOk = await checkPrisma();
  if (dbOk) {
    try {
      return await prisma.user.create({
        data: {
          name: data.name,
          email: normalizedEmail,
          passwordHash: data.passwordHash,
          city: data.city,
          role: data.role || "CITIZEN",
          department: data.department ?? null,
        },
      });
    } catch {
      // fallback
    }
  }

  const newUser: SeedUser = {
    id: `usr_${Date.now()}`,
    name: data.name,
    email: normalizedEmail,
    passwordHash: data.passwordHash,
    role: (data.role || "CITIZEN") as "CITIZEN" | "WORKER" | "ADMIN",
    city: data.city,
    department: data.department ?? undefined,
  };
  inMemoryUsers.push(newUser);
  return {
    ...newUser,
    department: newUser.department ?? null,
    createdAt: new Date(),
  };
}

export async function getWorkers() {
  const dbOk = await checkPrisma();
  if (dbOk) {
    try {
      return await prisma.user.findMany({
        where: { role: "WORKER" },
        select: {
          id: true,
          name: true,
          email: true,
          city: true,
          department: true,
        },
      });
    } catch {
      // fallback
    }
  }

  return inMemoryUsers
    .filter((u) => u.role === "WORKER")
    .map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      city: u.city,
      department: u.department ?? null,
    }));
}

export interface IssueFilterParams {
  status?: string;
  category?: string;
  city?: string;
  search?: string;
  citizenId?: string;
  assignedWorkerId?: string;
}

export async function getIssues(filters: IssueFilterParams = {}) {
  const dbOk = await checkPrisma();
  if (dbOk) {
    try {
      const where: Prisma.IssueWhereInput = {};
      if (filters.status && filters.status !== "ALL") {
        where.status = filters.status as IssueStatus;
      }
      if (filters.category && filters.category !== "ALL") {
        where.category = filters.category as IssueCategory;
      }
      if (filters.city && filters.city !== "ALL") {
        where.city = filters.city;
      }
      if (filters.citizenId) {
        where.citizenId = filters.citizenId;
      }
      if (filters.assignedWorkerId) {
        where.assignedWorkerId = filters.assignedWorkerId;
      }
      if (filters.search) {
        where.OR = [
          { title: { contains: filters.search, mode: "insensitive" } },
          { description: { contains: filters.search, mode: "insensitive" } },
          { address: { contains: filters.search, mode: "insensitive" } },
        ];
      }

      return await prisma.issue.findMany({
        where,
        include: {
          citizen: {
            select: { id: true, name: true, email: true, city: true },
          },
          assignedWorker: {
            select: { id: true, name: true, email: true, department: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    } catch {
      // fallback
    }
  }

  // Fallback in-memory filter
  let result = [...inMemoryIssues];

  if (filters.status && filters.status !== "ALL") {
    result = result.filter((i) => i.status === filters.status);
  }
  if (filters.category && filters.category !== "ALL") {
    result = result.filter((i) => i.category === filters.category);
  }
  if (filters.city && filters.city !== "ALL") {
    result = result.filter((i) => i.city.toLowerCase() === filters.city?.toLowerCase());
  }
  if (filters.citizenId) {
    result = result.filter((i) => i.citizenId === filters.citizenId);
  }
  if (filters.assignedWorkerId) {
    result = result.filter((i) => i.assignedWorkerId === filters.assignedWorkerId);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.address.toLowerCase().includes(q)
    );
  }

  result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return result.map((i) => {
    const citizen = inMemoryUsers.find((u) => u.id === i.citizenId) || SEED_USERS[2];
    const worker = i.assignedWorkerId
      ? inMemoryUsers.find((u) => u.id === i.assignedWorkerId)
      : null;

    return {
      ...i,
      citizen: {
        id: citizen.id,
        name: citizen.name,
        email: citizen.email,
        city: citizen.city,
      },
      assignedWorker: worker
        ? {
            id: worker.id,
            name: worker.name,
            email: worker.email,
            department: worker.department ?? null,
          }
        : null,
    };
  });
}

export async function getIssueById(id: string) {
  const dbOk = await checkPrisma();
  if (dbOk) {
    try {
      return await prisma.issue.findUnique({
        where: { id },
        include: {
          citizen: {
            select: { id: true, name: true, email: true, city: true },
          },
          assignedWorker: {
            select: { id: true, name: true, email: true, department: true },
          },
        },
      });
    } catch {
      // fallback
    }
  }

  const issue = inMemoryIssues.find((i) => i.id === id);
  if (!issue) return null;

  const citizen = inMemoryUsers.find((u) => u.id === issue.citizenId) || SEED_USERS[2];
  const worker = issue.assignedWorkerId
    ? inMemoryUsers.find((u) => u.id === issue.assignedWorkerId)
    : null;

  return {
    ...issue,
    citizen: {
      id: citizen.id,
      name: citizen.name,
      email: citizen.email,
      city: citizen.city,
    },
    assignedWorker: worker
      ? {
          id: worker.id,
          name: worker.name,
          email: worker.email,
          department: worker.department ?? null,
        }
      : null,
  };
}

export async function createIssue(data: {
  title: string;
  description: string;
  category: IssueCategory;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  imageUrl?: string | null;
  citizenId: string;
}) {
  const dbOk = await checkPrisma();
  if (dbOk) {
    try {
      return await prisma.issue.create({
        data: {
          title: data.title,
          description: data.description,
          category: data.category,
          status: "OPEN",
          latitude: data.latitude,
          longitude: data.longitude,
          address: data.address,
          city: data.city,
          imageUrl: data.imageUrl ?? null,
          citizenId: data.citizenId,
        },
        include: {
          citizen: {
            select: { id: true, name: true, email: true, city: true },
          },
          assignedWorker: true,
        },
      });
    } catch {
      // fallback
    }
  }

  const newIssue: MemoryIssue = {
    id: `iss_usr_${Date.now()}`,
    title: data.title,
    description: data.description,
    category: data.category,
    status: "OPEN",
    latitude: data.latitude,
    longitude: data.longitude,
    address: data.address,
    city: data.city,
    imageUrl: data.imageUrl ?? null,
    resolutionNote: null,
    resolvedAt: null,
    upvotes: 0,
    citizenId: data.citizenId,
    assignedWorkerId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  inMemoryIssues.unshift(newIssue);
  const citizen = inMemoryUsers.find((u) => u.id === data.citizenId) || SEED_USERS[2];

  return {
    ...newIssue,
    citizen: {
      id: citizen.id,
      name: citizen.name,
      email: citizen.email,
      city: citizen.city,
    },
    assignedWorker: null,
  };
}

export async function updateIssue(
  id: string,
  data: {
    status?: IssueStatus;
    resolutionNote?: string | null;
    resolvedAt?: Date | null;
    assignedWorkerId?: string | null;
  }
) {
  const dbOk = await checkPrisma();
  if (dbOk) {
    try {
      return await prisma.issue.update({
        where: { id },
        data,
        include: {
          citizen: {
            select: { id: true, name: true, email: true, city: true },
          },
          assignedWorker: {
            select: { id: true, name: true, email: true, department: true },
          },
        },
      });
    } catch {
      // fallback
    }
  }

  const index = inMemoryIssues.findIndex((i) => i.id === id);
  if (index === -1) throw new Error("Issue not found");

  const current = inMemoryIssues[index];
  const updated: MemoryIssue = {
    ...current,
    status: data.status !== undefined ? data.status : current.status,
    resolutionNote:
      data.resolutionNote !== undefined ? data.resolutionNote : current.resolutionNote,
    resolvedAt: data.resolvedAt !== undefined ? data.resolvedAt : current.resolvedAt,
    assignedWorkerId:
      data.assignedWorkerId !== undefined ? data.assignedWorkerId : current.assignedWorkerId,
    updatedAt: new Date(),
  };

  inMemoryIssues[index] = updated;

  const citizen = inMemoryUsers.find((u) => u.id === updated.citizenId) || SEED_USERS[2];
  const worker = updated.assignedWorkerId
    ? inMemoryUsers.find((u) => u.id === updated.assignedWorkerId)
    : null;

  return {
    ...updated,
    citizen: {
      id: citizen.id,
      name: citizen.name,
      email: citizen.email,
      city: citizen.city,
    },
    assignedWorker: worker
      ? {
          id: worker.id,
          name: worker.name,
          email: worker.email,
          department: worker.department ?? null,
        }
      : null,
  };
}

export async function upvoteIssue(id: string) {
  const dbOk = await checkPrisma();
  if (dbOk) {
    try {
      return await prisma.issue.update({
        where: { id },
        data: {
          upvotes: { increment: 1 },
        },
      });
    } catch {
      // fallback
    }
  }

  const issue = inMemoryIssues.find((i) => i.id === id);
  if (!issue) throw new Error("Issue not found");
  issue.upvotes += 1;
  return issue;
}

export async function getAnalytics() {
  const allIssues = await getIssues();

  const total = allIssues.length;
  const open = allIssues.filter((i) => i.status === "OPEN").length;
  const inProgress = allIssues.filter((i) => i.status === "IN_PROGRESS").length;
  const resolved = allIssues.filter((i) => i.status === "RESOLVED").length;

  const categoryBreakdown: Record<string, number> = {
    POTHOLE: 0,
    STREETLIGHT: 0,
    GARBAGE: 0,
    WATER_LEAK: 0,
    DRAINAGE: 0,
  };

  const cityBreakdown: Record<string, number> = {};

  for (const issue of allIssues) {
    if (categoryBreakdown[issue.category] !== undefined) {
      categoryBreakdown[issue.category]++;
    }
    const c = issue.city || "Unknown";
    cityBreakdown[c] = (cityBreakdown[c] || 0) + 1;
  }

  return {
    total,
    open,
    inProgress,
    resolved,
    categoryBreakdown,
    cityBreakdown,
  };
}
