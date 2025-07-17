import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface UsersRequest extends Request {
  userId?: string;
}

export const verify = (
  req: UsersRequest,
  res: Response,
  next: NextFunction
) => {
  const useHeaders = req.headers.authorization;

  if (!useHeaders || !useHeaders.startsWith("Bearer ")) {
    res.status(401).json({
      message: "Please login",
    });
    return;
  }
  const token = useHeaders.split(" ")[1];
  const verifyTheToken = (token: string): { userId: string } => {
    return jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
  };

  try {
    const getDetails = verifyTheToken(token);
    req.userId = getDetails.userId;
    next();
  } catch (error) {
    res.status(403).json({ message: "Please login first" });
    console.log(error);
    return;
  }
};
