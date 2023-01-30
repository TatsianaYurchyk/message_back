import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import MailModel from "../models/mail";
import UserModel from "../models/user";
// import { assertIsDefined } from "../util/assertIsDefined";

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.session.userId).exec();
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

export const getMails: RequestHandler = async (req, res, next) => {


    try {
        const mails = await MailModel.find().exec();
        res.status(200).json(mails);
    } catch (error) {
        next(error);
    }
};

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
        // assertIsDefined(authenticatedUserId);

        if (!title) {
            throw createHttpError(400, "Message must have a title");
        }
        if (!receiver) {
            throw createHttpError(400, "Message must have a receiver");
        }
        if (!title && !receiver) {
            throw createHttpError(400, "Message must have a title and a receiver");
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

