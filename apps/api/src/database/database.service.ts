import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { prisma, PrismaClient } from "@repo/db";

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  get prisma() : PrismaClient {
    return prisma;
  }

  async onModuleInit() {
    await prisma.$connect();
    console.log("🚀 Database connected");
  }

  async onModuleDestroy() {
    await prisma.$disconnect();
    console.log("🔌 Database disconnected");
  }
}
