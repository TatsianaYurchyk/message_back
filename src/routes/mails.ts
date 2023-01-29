import express from "express";
import * as MailsController from "../controllers/mails";

const router = express.Router();

router.get("/", MailsController.getMails);

// router.get("/:noteId", MailsController.getMail);

router.post("/", MailsController.createMail);

// router.patch("/:noteId", NotesController.updateNote);

// router.delete("/:noteId", NotesController.deleteNote);

export default router;