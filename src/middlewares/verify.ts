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
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      message: "Access token required. Please login.",
    });
    return;
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({
      message: "Access token required. Please login.",
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(403).json({ message: "Token expired. Please login again." });
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(403).json({ message: "Invalid token. Please login again." });
    } else {
      res.status(403).json({ message: "Authentication failed. Please login." });
    }
    console.error("JWT verification error:", error);
    return;
  }
};
