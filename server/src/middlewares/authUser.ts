import { NextFunction, Request, Response } from "express";
import { JwtUser } from "../contollers/controller";
import prisma from "../db";
import { verifyToken } from "../lib/auth";

export async function authUser(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.token

  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return
  }

  const decodedToken = verifyToken(token) as JwtUser | null;

  if (!decodedToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: decodedToken.email
      },
      include: {
        cart: true
      }
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