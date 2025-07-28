import { Request, Response } from "express";
import client from "../Config/prismaClient";
import { Notes } from "@prisma/client";

interface UserRequest extends Request {
  userId?: string;
}
export const createANote = async (req: UserRequest, res: Response) => {
  try {
    const creatorId = req.userId;
    const { title, synopsis, content, isPrivate }: Notes = req.body;

    if (!creatorId) {
      res.status(400).json({
        message: "Cant create note, please login first",
      });
      return;
    }
    const note = await client.notes.create({
      data: { title, synopsis, content, userId: creatorId, isPrivate },
    });
    res.status(200).json({
      message: "Note added successfully",
      data: note,
    });
    return;
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
    console.log(error);
    return;
  }
};
export const getAllNotes = async (req: UserRequest, res: Response) => {
  try {
    const creatorId = req.userId;
    if (!creatorId) {
      res.status(400).json({
        message: "Can't get notes,please login",
      });
      return;
    }
    const notes = await client.notes.findMany({
      orderBy: { dateCreated: "desc" },
      where: {
        isDeleted: false,
        isPrivate: false,
      },
    });
    res.status(200).json({
      message: "Notes gotten successfully",
      data: notes,
    });
    return;
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
    console.log(error);
    return;
  }
};
export const getIndividualUsersNotes = async (
  req: UserRequest,
  res: Response
) => {
  try {
    const createrId = req.userId;
    if (!createrId) {
      res.status(401).json({ message: `Can't get posts.Please login!` });
      return;
    }
    const notes = await client.notes.findMany({
      where: {
        userId: createrId,
        isDeleted: false,
      },
      orderBy: { dateCreated: "desc" },
    });
    res.status(201).json({
      message: "All your notes gotten successfully",
      data: notes,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
    console.log(error);
    return;
  }
};
export const editNote = async (req: UserRequest, res: Response) => {
  try {
    const creatorId = req.userId;
    if (!creatorId) {
      res.status(400).json({
        message: "Can't edit note,please login",
      });
      console.log(creatorId);
      return;
    }
    const { title, synopsis, content } = req.body;
    const { id } = req.params;

    const note = await client.notes.findUnique({
      where: { id },
    });
    if (note?.userId !== creatorId) {
      res.status(300).json({
        message: `You cannot edit another author's post`,
      });
    }

    const editNote = await client.notes.update({
      where: { id },
      data: { title, synopsis, content },
    });
    res.status(200).json({
      message: "Post has been updated successfully",
      data: editNote,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
    console.log(error);
    return;
  }
};
export const getASpecificNote = async (req: UserRequest, res: Response) => {
  try {
    const creatorId = req.userId;
    const { id } = req.params;

    if (!creatorId) {
      res.status(200).json({
        message: "Can't get note,please login",
      });
      return;
    }

    const note = await client.notes.findFirst({
      where: { id },
      include: {
        user: {
          select: {
            avatar: true,
            firstname: true,
            lastname: true,
          },
        },
      },
    });
    if (note) {
      res.status(200).json({
        message: "Note gotten successfully",
        data: note,
      });
      return;
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
    console.log(error);
    return;
  }
};
export const deleteNote = async (req: UserRequest, res: Response) => {
  try {
    const creatorId = req.userId;
    const { id } = req.params;

    if (!creatorId) {
      res.status(400).json({
        message: "Cant delete note, please login",
      });
      return;
    }
    const note = await client.notes.findUnique({
      where: { id },
    });
    if (note?.userId !== creatorId) {
      res.status(400).json({
        message: "Cant edit another authors posts",
      });
      return;
    }
    await client.notes.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });
    res.status(200).json({
      message: "Note deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
    console.log(error);
    return;
  }
};
export const getDeletedAllNotes = async (req: UserRequest, res: Response) => {
  try {
    const creatorId = req.userId;
    if (!creatorId) {
      res.status(200).json({
        message: "Cant get deleted notes,please login",
      });
      return;
    }
    const note = await client.notes.findMany({
      where: { isDeleted: true, userId: creatorId },
      orderBy: { dateCreated: "desc" },
    });
    res.status(200).json({
      message: "Deleted notes retrieved successfully",
      data: note,
    });
    return;
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
    console.log(error);
    return;
  }
};
export const restoreDeletedNotes = async (req: UserRequest, res: Response) => {
  try {
    const creatorId = req.userId;
    const { id } = req.params;

    if (!creatorId) {
      res.status(400).json({
        message: "Cant restore note,please login",
      });
      return;
    }
    await client.notes.updateMany({
      where: { id },
      data: {
        isDeleted: false,
      },
    });
    res.status(200).json({
      message: "Note restored successfully",
    });
    return;
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
    console.log(error);
    return;
  }
};
export const makeNotePrivate = async (req: UserRequest, res: Response) => {
  try {
    const creatorId = req.userId;
    const { id } = req.params;

    if (!creatorId) {
      res.status(400).json({
        message: "Cant make note private, please login",
      });
      return;
    }
    const note = await client.notes.findUnique({
      where: { id },
    });
    if (note?.userId !== creatorId) {
      res.status(400).json({
        message: "Cant set another authors posts to private",
      });
      return;
    }
    await client.notes.update({
      where: { id },
      data: {
        isPrivate: !note.isPrivate,
      },
    });
    res.status(200).json({
      message: !note.isPrivate ? "Set to Private" : "Set to Public",
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
    console.log(error);
    return;
  }
};
export const getPrivateNotes = async (req: UserRequest, res: Response) => {
  try {
    const creatorId = req.userId;
    if (!creatorId) {
      res.status(200).json({
        message: "Cant get Private notes,please login",
      });
      return;
    }
    const note = await client.notes.findMany({
      where: {
        isPrivate: true,
        isDeleted: false,
        userId: creatorId,
      },
      orderBy: { dateCreated: "desc" },
    });
    res.status(200).json({
      message: "Private notes retrieved successfully",
      data: note,
    });
    return;
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
    console.log(error);
    return;
  }
};
export const PinNotes = async (req: UserRequest, res: Response) => {
  try {
    const creatorId = req.userId;
    const { id } = req.params;

    if (!creatorId) {
      res.status(400).json({
        message: "Cant Pin note, please login",
      });
      return;
    }
    const note = await client.notes.findUnique({
      where: { id },
    });
    if (note?.userId !== creatorId) {
      res.status(400).json({
        message: "Cant Pin another authors posts",
      });
      return;
    }
    await client.notes.update({
      where: { id },
      data: {
        isPinned: !note.isPinned,
      },
    });
    res.status(200).json({
      message: !note.isPinned ? "Note pinned" : "Note Unpinned",
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
    console.log(error);
    return;
  }
};
export const getPinnedNotes = async (req: UserRequest, res: Response) => {
  try {
    const creatorId = req.userId;
    if (!creatorId) {
      res.status(200).json({
        message: "Cant get Pinned notes,please login",
      });
      return;
    }
    const note = await client.notes.findMany({
      where: { isPinned: true, isDeleted: false, userId: creatorId },
      orderBy: { dateCreated: "desc" },
    });
    res.status(200).json({
      message: "Pinned notes retrieved successfully",
      data: note,
    });
    return;
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
    console.log(error);
    return;
  }
};
export const getPublicNotes = async (req: UserRequest, res: Response) => {
  try {
    const creatorId = req.userId;
    if (!creatorId) {
      res.status(200).json({
        message: "Cant get Public notes,please login",
      });
      return;
    }
    const note = await client.notes.findMany({
      where: {
        isPrivate: false,
        isDeleted: false,
        userId: creatorId,
      },
      orderBy: { dateCreated: "desc" },
    });
    res.status(200).json({
      message: "Public notes retrieved successfully",
      data: note,
    });
    return;
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
    console.log(error);
    return;
  }
};
