import { CartProduct } from "@prisma/client";
import { compare, genSalt, hash } from "bcrypt";
import { Request, RequestHandler, Response } from "express";
import z from "zod";
import prisma from "../db";
import { signToken } from "../lib/auth";
import { signUpSchema } from "../lib/zod";

export const signUp = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const { email, password, userName, companyName } = signUpSchema.parse(body);

    // Check for missing fields
    if (!email || !password || !userName) {
      res.status(400).json({ message: "Invalid Request" });
      return;
    }

    const userEmail = await prisma.user.findUnique({ where: { email } });
    if (userEmail) {
      res.status(400).json({ message: "Email Already Exists" });
      return;
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
          vendor: {
            create: {
              companyName
            }
          },
          role: "VENDOR"
        },
      });
    }

    if (!user) {
      res.status(500).json({ message: "Error Creating your Account" });
      return;
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

    res.status(201).json({ message: "Welcome to Shophub", role: user.role });
    return;

  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
      return;
    }

    console.error(error);
    res.status(500).json({ message: "Something went wrong, Please try again" });
    return;
  }
};


export const signIn = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const { email, password } = signUpSchema.parse(body);

    if (!email || !password) {
      res.status(400).json({ message: "Invalid Request" });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(404).json({ message: "User Not Found" });
      return;
    }

    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      res.status(400).json({ message: "Incorrect Password" })
      return;
    }

    const userData = {
      id: user.id,
      email: user.email,
      userName: user.userName,
    }

    const token = signToken(userData);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.status(201).json({ message: "Welcome to Shophub", role: user.role });
    return;
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

    res.status(500).json({ message: "Something went wrong, Please try again" });
    return;
  }
}

export const signOut = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Sign Out Successful" });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong, Please try again" });
    return;
  }
}

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(404).json({ message: "User Not Found" });
      return;
    }

    res.status(200).json({ user });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong, Please try again" });
    return;
  }
}

export const getProducts: RequestHandler = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany();
    if (!products) {
      res.status(404).json({ message: "Products Not Found" });
      return;
    }

    res.status(200).json({ products });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong, Please try again" });
    return;
  }
}

export const addToCart = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(404).json({ message: "User Not Found" });
      return;
    }

    const { productId } = req.body;
    if (!productId || typeof productId !== "string") {
      res.status(400).json({ message: "Invalid Request" });
      return;
    }

    const product = await prisma.product.findFirst({ where: { id: productId } });
    if (!product) {
      res.status(404).json({ message: "Product Not Found" });
      return;
    }
    let price = product.price;
    price = price * (1 - product.discount / 100);

    let cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: { cartProducts: true }
    });
    let updatedCart;

    if (cart) {
      const existingCartProduct = cart.cartProducts.find(cp => cp.productId === product.id);
      price = existingCartProduct ? existingCartProduct.quantity * price : price;

      if (existingCartProduct) {
        await prisma.$transaction([
          prisma.cartProduct.update({
            where: { id: existingCartProduct.id },
            data: { quantity: { increment: 1 }, price }
          }),
          prisma.cart.update({
            where: { id: cart.id },
            data: { totalPrice: { increment: price } }
          })
        ]);
      } else {
        await prisma.$transaction([
          prisma.cartProduct.create({
            data: {
              cartId: cart.id,
              productId: product.id,
              quantity: 1,
              price
            }
          }),
          prisma.cart.update({
            where: { id: cart.id },
            data: { totalPrice: { increment: price } }
          })
        ]);
      }

      updatedCart = await prisma.cart.findUnique({
        where: { id: cart.id },
        include: { cartProducts: true }
      });
    } else {
      updatedCart = await prisma.$transaction(async (tx) => {
        const newCart = await tx.cart.create({
          data: {
            userId: user.id,
            totalPrice: price,
            cartProducts: {
              create: {
                productId: product.id,
                quantity: 1,
                price: price
              }
            },
            user: {
              connect: {
                id: user.id
              }
            }
          },
          include: { cartProducts: true }
        });
        return newCart;
      });
    }

    res.status(200).json({ cart: updatedCart, message: "Added To Cart" });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong, Please try again" });
    return;
  }
}

export const getCart = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(404).json({ message: "User Not Found" });
      return;
    }

    res.status(200).json({ cart: user.cart });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong, Please try again" });
    return;
  }
}

export const updateCart = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(404).json({ message: "User Not Found" });
      return;
    }

    const { productId, quantity } = req.body;

    if (!productId || typeof productId !== "string" || !quantity || typeof quantity !== "string") {
      res.status(400).json({ message: "Invalid Request" });
      return;
    }

    const product = await prisma.product.findFirst({ where: { id: productId } });
    if (!product) {
      res.status(404).json({ message: "Product Not Found" });
      return;
    }

    let price = product.price;
    price = price * (1 - product.discount / 100);

    let cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: {
        cartProducts: {
          include: {
            product: true
          }
        }
      }
    });
    if (!cart) {
      res.status(404).json({ message: "Cart Not Found" });
      return;
    }

    const existingCartProduct = cart.cartProducts.find(cp => cp.productId === product.id);
    if (!existingCartProduct) {
      res.status(404).json({ message: "Product Not Found In Cart" });
      return;
    }

    let updatedCartProduct: CartProduct;
    let newTotalPrice = cart.totalPrice;

    if (parseInt(quantity) === 0) {
      await prisma.cartProduct.delete({ where: { id: existingCartProduct.id } });
      newTotalPrice -= existingCartProduct.quantity * price;
    } else {
      updatedCartProduct = await prisma.cartProduct.update({
        where: { id: existingCartProduct.id },
        data: { quantity: parseInt(quantity) }
      });

      newTotalPrice = 0;
      cart.cartProducts.forEach((cp) => {
        price = cp.product.price * (1 - cp.product.discount / 100);
        if (cp.id === updatedCartProduct.id) {
          newTotalPrice += updatedCartProduct.quantity * price;
        } else {
          newTotalPrice += cp.quantity * price;
        }
      })
    }


    const updatedCart = await prisma.cart.update({
      where: { id: cart.id },
      include: {
        cartProducts: {
          include: {
            product: true
          }
        }
      },
      data: {
        totalPrice: newTotalPrice
      }
    });

    res.status(200).json({ cart: updatedCart, message: "Cart Updated" });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong, Please try again" });
    return;
  }
}

export const registerBusiness = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(404).json({ message: "User Not Found" });
      return;
    }

  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong, Please try again" });
    return;
  }
}