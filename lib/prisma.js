// import { PrismaClient } from "@prisma/client";

// const globalForPrisma = globalThis;

// export const prisma =
//  globalForPrisma.prisma ||
//  new PrismaClient();

//  if (process.env.NODE_ENV !== "production"){
//     globalForPrisma.prisma =prisma;
//  }

//  export default prisma;


import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { withAccelerate } from "@prisma/extension-accelerate";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development'? ['query', 'error','warn'] :['error'],
  }).$extends(withAccelerate());

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
