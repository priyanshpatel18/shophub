import { NextFunction, Request, Response } from "express";
import prisma from "../db";
import { verifyToken } from "../lib/auth";

interface JwtUser {
  payload: {
    id: string;
    email: string;
    userName: string;
  }
}

export async function authUser(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.token

  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return
  }

  const decodedToken = verifyToken(token) as JwtUser;
  if (!decodedToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: decodedToken.payload.id
      },
      include: {
        cart: {
          include: {
            cartProducts: {
              include: {
                product: true
              }
            }
          }
        },
        customer: true,
        vendor: {
          include: {
            products: true
          }
        }
      },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
    return
  }
}