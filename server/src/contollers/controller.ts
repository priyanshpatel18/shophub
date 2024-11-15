import { compare, genSalt, hash } from "bcrypt";
import { Request, RequestHandler, Response } from "express";
import z from "zod";
import prisma from "../db";
import { signToken } from "../lib/auth";
import { signUpSchema } from "../lib/zod";

export interface JwtUser {
  _id: string;
  email: string;
  userName: string;
}

export const signUp = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const { email, password, userName, companyName } = signUpSchema.parse(body);

    // Check for missing fields
    if (!email || !password || !userName) {
      return res.status(400).json({ message: "Invalid Request" });
    }

    const userEmail = await prisma.user.findUnique({ where: { email } });
    if (userEmail) {
      return res.status(400).json({ message: "Email Already Exists" });
    }

    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    let user;
    if (!companyName) {
      user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          userName,
          cart: {
            create: {}
          },
          customer: {
            create: {}
          }
        },
      });
    } else {
      user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          userName,
          cart: {
            create: {}
          },
          vendor: {
            create: {
              companyName,
            }
          }
        },
      });
    }

    if (!user) {
      return res.status(500).json({ message: "Error Creating your Account" });
    }

    const token = signToken({
      id: user.id,
      email: user.email,
      userName: user.userName
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    return res.status(201).json({ message: "Welcome to Shophub" });

  } catch (error) {
    console.error(error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
    }

    return res.status(500).json({ message: "Something went wrong, Please try again" });
  }
};


export const signIn: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body;
    const { email, password } = signUpSchema.parse(body);
    console.log(email, password);

    if (!email || !password) {
      res.json({ message: "Invalid Request" }).status(400);
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.json({ message: "User Not Found" }).status(404);
      return;
    }

    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      res.json({ message: "Incorrect Password" }).status(401);
      return;
    }

    const userData = {
      _id: user.id,
      email: user.email,
      userName: user.userName,
    }

    const token = signToken(userData);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.json({ message: "Welcome to Shophub" }).status(201);
  }
  catch (error) {
    console.error(error);

    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Invalid Password",
        errors: error.errors,
      });
      return;
    }

    res.json({ message: "Something went wrong, Please try again" }).status(500);
  }
}

export const getUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.json({ message: "User Not Found" }).status(404);
      return
    }

    const responseData = {
      _id: user.id,
      email: user.email,
      userName: user.userName,
      cart: user.cart
    }
    res.json({ user: responseData }).status(200);
  } catch (error) {
    console.error(error);
    res.json({ message: "Something went wrong, Please try again" }).status(500);
  }
}

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany();
    if (!products) {
      return res.json({ message: "Products Not Found" }).status(404);
    }

    return res.json({ products }).status(200);
  } catch (error) {
    console.error(error);
    return res.json({ message: "Something went wrong, Please try again" }).status(500);
  }
}

export const getCart: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.json({ message: "User Not Found" }).status(404);
      return
    }

    res.json({ cart: user.cart }).status(200);
  } catch (error) {
    console.error(error);
    res.json({ message: "Something went wrong, Please try again" }).status(500);
  }
}

export const updateCart: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.json({ message: "User Not Found" }).status(404);
      return
    }

    const { productId, updateFlag } = req.body;

    if (updateFlag === undefined || !productId || !user.cart) {
      res.json({ message: "Invalid Request" }).status(400);
      return
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      res.json({ message: "Product Not Found" }).status(404);
      return;
    }

    if (!updateFlag) {
      const updatedCart = await prisma.cart.update({
        where: {
          id: user.cart.id
        },
        data: {
          products: {
            disconnect: {
              id: product.id
            }
          }
        },
        include: {
          products: true
        }
      });

      if (!updatedCart) {
        res.json({ message: "Error Updating Cart" }).status(500);
        return;
      }

      res.json({ cart: updatedCart, message: "Product Removed From Cart" }).status(200);
      return;
    }
    const updatedCart = await prisma.cart.update({
      where: {
        id: user.cart.id
      },
      data: {
        products: {
          connect: {
            id: product.id
          }
        }
      },
      include: {
        products: true
      }
    });

    if (!updatedCart) {
      res.json({ message: "Error Updating Cart" }).status(500);
      return;
    }

    res.json({ cart: updatedCart, message: "Product Added To Cart" }).status(200);
  } catch (error) {
    console.error(error);
    res.json({ message: "Something went wrong, Please try again" }).status(500);
  }
}