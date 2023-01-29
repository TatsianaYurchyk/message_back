import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import MailModel from "../models/mail";
import { assertIsDefined } from "../util/assertIsDefined";

export const getMails: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;
    // const authenticatedUserReceiver = req.session.receiver;

    try {
        // assertIsDefined(authenticatedUserReceiver);

        // const notes = await NoteModel.find({ userId: authenticatedUserId }).exec();
        const mails = await MailModel.find().exec();
        res.status(200).json(mails);
    } catch (error) {
        next(error);
    }
};

// export const getMail: RequestHandler = async (req, res, next) => {
//     const mailId = req.params.mailId;
//     const authenticatedUserId = req.session.userId;

//     try {
//         assertIsDefined(authenticatedUserId);

//         if (!mongoose.isValidObjectId(mailId)) {
//             throw createHttpError(400, "Invalid note id");
//         }

//         const mail = await MailModel.findById(mailId).exec();

//         if (!mail) {
//             throw createHttpError(404, "Mail not found");
//         }

//         if (!mail.userId.equals(authenticatedUserId)) {
//             throw createHttpError(401, "You cannot access this mail");
//         }

//         res.status(200).json(mail);
//     } catch (error) {
//         next(error);
//     }
// };

interface CreateMailBody {
    title?: string,
    receiver?: string,
    text?: string,
}

export const createMail: RequestHandler<unknown, unknown, CreateMailBody, unknown> = async (req, res, next) => {
    const receiver = req.body.receiver;
    const title = req.body.title;
    const text = req.body.text;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!title) {
            throw createHttpError(400, "Note must have a title");
        }

        const newMail = await MailModel.create({
            userId: authenticatedUserId,
            receiver:receiver,
            title: title,
            text: text,
        });

        res.status(201).json(newMail);
    } catch (error) {
        next(error);
    }
};

// interface UpdateNoteParams {
//     noteId: string,
// }

// interface UpdateNoteBody {
//     title?: string,
//     text?: string,
// }

// export const updateNote: RequestHandler<UpdateNoteParams, unknown, UpdateNoteBody, unknown> = async (req, res, next) => {
//     const noteId = req.params.noteId;
//     const newTitle = req.body.title;
//     const newText = req.body.text;
//     const authenticatedUserId = req.session.userId;

//     try {
//         assertIsDefined(authenticatedUserId);

//         if (!mongoose.isValidObjectId(noteId)) {
//             throw createHttpError(400, "Invalid note id");
//         }

//         if (!newTitle) {
//             throw createHttpError(400, "Note must have a title");
//         }

//         const note = await NoteModel.findById(noteId).exec();

//         if (!note) {
//             throw createHttpError(404, "Note not found");
//         }

//         if (!note.userId.equals(authenticatedUserId)) {
//             throw createHttpError(401, "You cannot access this note");
//         }

//         note.title = newTitle;
//         note.text = newText;

//         const updatedNote = await note.save();

//         res.status(200).json(updatedNote);
//     } catch (error) {
//         next(error);
//     }
// };

// export const deleteNote: RequestHandler = async (req, res, next) => {
//     const noteId = req.params.noteId;
//     const authenticatedUserId = req.session.userId;

//     try {
//         assertIsDefined(authenticatedUserId);

//         if (!mongoose.isValidObjectId(noteId)) {
//             throw createHttpError(400, "Invalid note id");
//         }

//         const note = await NoteModel.findById(noteId).exec();

//         if (!note) {
//             throw createHttpError(404, "Note not found");
//         }

//         if (!note.userId.equals(authenticatedUserId)) {
//             throw createHttpError(401, "You cannot access this note");
//         }

//         await note.remove();

//         res.sendStatus(204);
//     } catch (error) {
//         next(error);
//     }
// };