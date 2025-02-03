import { Cart } from "@prisma/client";

interface ClientUser {
  id: string;
  email: string;
  userName: string;
  role: "CUSTOMER" | "VENDOR" | "ADMIN";
  cart: Cart | null;
}

declare global {
  namespace Express {
    export interface Request {
      user?: ClientUser | null;
    }
  }
}
