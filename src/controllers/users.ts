import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import client from "../Config/prismaClient";
import jwt from "jsonwebtoken";
import fs from "fs";
import imagekit from "../Config/imageKit";

interface UsersRequest extends Request {
  userId?: string;
  file?: Express.Multer.File;
}

export const createUser = async (req: Request, res: Response) => {
  try {
    const { firstname, lastname, username, email, password } = req.body;
    if (
      !firstname?.trim() ||
      !lastname?.trim() ||
      !username?.trim() ||
      !email?.trim() ||
      !password?.trim()
    ) {
      res.status(400).json({
        message: "All fields must be filled correctly",
      });
      return;
    }
    const existingUser = await client.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      res.status(409).json({
        message: "user already exists, Please login",
      });
      return;
    }

    const hashpassword = await bcrypt.hash(password, 10);
    await client.user.create({
      data: { firstname, lastname, username, email, password: hashpassword },
    });
    res.status(201).json({
      message: "User created successfully",
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const user = await client.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });
    if (!user) {
      res.status(200).json({
        message: "Invalid login details",
      });
      return;
    }
    const correctPassword = await bcrypt.compare(password, user?.password);

    if (!correctPassword) {
      res.status(400).json({
        message: "Incorrect password",
      });
      return;
    }
    const {
      userId,
      password: _,
      dateJoined,
      isDeleted,
      lastUpdated,
      ...rest
    } = user;
    const token = jwt.sign(
      { userId: user.userId, firstname: user.firstname },
      process.env.JWT_SECRET!,
      {
        expiresIn: "48h",
      }
    );
    res.status(200).json({ message: "Login Successfully", token, user: rest });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
    return;
  }
};
export const getUserDetails = async (req: UsersRequest, res: Response) => {
  try {
    const id = req.userId;
    const user = await client.user.findFirst({
      where: { userId: id },
    });
    res.status(200).json({
      message: "Details gotten successfully",
      data: user,
    });
    return;
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    return;
  }
};
export const EditPrimaryDetails = async (req: UsersRequest, res: Response) => {
  try {
    const id = req.userId;
    if (!id) {
      res.status(401).json({
        message: "Cant edit details,please login",
      });
      return;
    }
    const { firstname, lastname, email, username } = req.body;

    const imageFile = req.file;
    let imageURL: string | undefined;

    if (imageFile) {
      const fileBuffer = fs.readFileSync(imageFile.path);
      const response = await imagekit.upload({
        file: fileBuffer,
        fileName: `tasha/${Date.now()}`,
        folder: "/blogs",
      });

      fs.unlinkSync(imageFile.path);

      imageURL = imagekit.url({
        path: response.filePath,
        transformation: [
          { width: "1280" },
          { quality: "auto" },
          { format: "webp" },
        ],
      });
    }

    const details = await client.user.update({
      where: { userId: id },
      data: {
        firstname,
        lastname,
        email,
        username,
        ...(imageURL && { avatar: imageURL }),
      },
    });
    res.status(200).json({
      message: "Details edited successfully",
      data: details,
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
    return;
  }
};
export const EditPassword = async (req: UsersRequest, res: Response) => {
  try {
    const creatorId = req.userId;
    const { oldPassword, newPassword } = req.body;
    if (oldPassword === newPassword) {
      res.status(401).json({
        message: "Please enter a new password to edit password",
      });
      return;
    }
    if (!creatorId) {
      res.status(200).json({
        message: "please login",
      });
      return;
    }
    const user = await client.user.findFirst({
      where: { userId: creatorId },
    });
    if (!user) {
      res.status(404).json({
        message: "user not found",
      });
      return;
    }

    const passwordsMatch = await bcrypt.compare(oldPassword, user?.password);
    if (!passwordsMatch) {
      res.status(400).json({
        message: "Your old passwords dont match",
      });
      return;
    }
    const hashpassword = await bcrypt.hash(newPassword, 10);

    await client.user.update({
      where: { userId: creatorId },
      data: {
        password: hashpassword,
      },
    });
    res.status(200).json({
      message: "Password updated successfully",
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
    return;
  }
};

// export const EditProfileImage = async (req: UsersRequest, res: Response) => {
//   try {
//     const creatorId = req.userId;

//     await client.user.update({
//       where: { userId: creatorId },
//       data: {
//         avatar: imageURL,
//       },
//     });
//     res.status(200).json({
//       message: "Profile image added successfully",
//     });
//     return;
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "something went wrong" });
//     return;
//   }
// };
