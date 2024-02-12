import express  from "express";
import noteController from "../controllers/noteController"

const router = express.Router();

router.route('/')
    .get(noteController.getAllNotes)
    .post(noteController.createNewNote)
    .patch(noteController.updateNote)

router.route('/:id')
    .delete(noteController.deleteNoteById)
export default router;