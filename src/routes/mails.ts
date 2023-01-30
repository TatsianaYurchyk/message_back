import express from "express";
import * as MailsController from "../controllers/mails";

const router = express.Router();

router.get("/", MailsController.getMails);

router.post("/create", MailsController.createMail);


export default router;