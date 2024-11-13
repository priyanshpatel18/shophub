import { User } from "@prisma/client"; // Import User type from Prisma

declare global {
  namespace Express {
    export interface Request {
      user?: User & { cart?: { id: string; userId: string } | null };
    }
  }
}
