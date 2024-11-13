import { sign, verify } from "jsonwebtoken";

export const signToken = (payload: any) => {
  return sign({ payload }, process.env.JWT_SECRET as string);
};

export const verifyToken = (token: string) => {
  return verify(token, process.env.JWT_SECRET as string);
};