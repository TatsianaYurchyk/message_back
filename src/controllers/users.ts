import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/user";

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.session.userId).select("+email").exec();
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

interface SignUpBody {
    username?: string,

}

export const signUp: RequestHandler<unknown, unknown, SignUpBody, unknown> = async (req, res, next) => {
    const username = req.body.username;

    try {
        
        const existingUsername = await UserModel.findOne({ username: username }).exec();

        if (existingUsername) {
            throw createHttpError(409, "Username already taken. Please choose a different one or log in instead.");
        }

        const newUser = await UserModel.create({
            username: username,
        });

        req.session.userId = newUser._id;

        res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
};

interface LoginBody {
    username?:string,
}

export const logIn: RequestHandler<unknown,unknown,LoginBody,unknown> = async (req, res, next) => {
    const username = req.body.username;

    try {
        const existingUsername = await UserModel.findOne({ username: username }).exec();
 
        if (!existingUsername){
            
            const newUser = await UserModel.create({
                username: username,

            });
            req.session.userId = newUser._id;

        res.status(201).json(newUser);
        }
        if (existingUsername){
        req.session.userId = existingUsername._id;
        res.status(201).json(existingUsername);}
    } catch (error) {
        next(error);
    }
};

export const logOut: RequestHandler = (req, res, next) => {
    req.session.destroy(error => {
        if (error) {
            next(error);
        } else {
            res.sendStatus(200);
        }
    });
};

export const getUsers: RequestHandler = async (req, res, next) => {
	try {
		const users = await UserModel.find().exec();
		res.status(200).json(users);
	} catch (error) {
		next(error);
	}
};

