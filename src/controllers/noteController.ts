import User from '../models/User';
import Note from '../models/Note';

export const getAllNotes = async (req: any, res: any) => {
    const notes = await Note.find().lean();
    if (!notes?.length) {
        return res.status(404).json({message: "No note found"})
    }

    const notesWithUser = await Promise.all(notes.map(async (note: any) => {
        const user = await User.findById(note.user).lean().exec();
        return {...note, username: user?.username}
    }));

    res.json(notesWithUser);
}

export const createNewNote = async (req: any, res: any) => {
    const {user, title, text} = req.body;

    if (!user || !title || !text) {
        return res.status(400).json({message: 'All fields are required'})
    }
    // Check for duplicate title
    const duplicate = await Note.findOne({title}).collation({locale: 'en', strength: 2}).lean().exec();

    if (duplicate) {
        return res.status(409).json({message: 'Note already exist'});
    }

    const newNote = await Note.create({user, title, text});

    if (newNote) {
        return res.status(201).json({message: `Note ${title}  created successfully`});
    } else {
        return res.status(500).json({message: 'Note not created'});
    }
}

export const updateNote = async (req: any, res: any) => {
    const {id, user, title, text, completed} = req.body;

    if (!id || !user || !title || !text || typeof completed !== 'boolean') {
        return res.status(400).json({message: 'All fields are required'})
    }
    const note: any = await Note.findById(id).exec();
    if (!note) {
        return res.status(400).json({message: 'Note not found'});
    }
    // Check for duplicate title
    const duplicate = await Note.findOne({title}).collation({locale: 'en', strength: 2}).lean().exec()

    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({message: 'Note already exist'});
    }
    note.user = user;
    note.title = title;
    note.text = text;
    note.completed = completed;

    const updatedNote = await note.save();
    res.status(200).json({message: 'Note updated successfully', updatedNote});
}

export const deleteNoteById = async (req: any, res: any) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({message: "Note id is required"})
    }
    const note:any = await Note.findById(id).exec();

    if (!note) {
        return res.status(400).json({message: "Note not found"});
    }
    const result = await note.deleteOne()

    const reply = `Note '${result.title}' with ID ${result._id} deleted`
    res.json({message: reply})
}

export default {
    getAllNotes ,
    createNewNote,
    updateNote,
    deleteNoteById}
