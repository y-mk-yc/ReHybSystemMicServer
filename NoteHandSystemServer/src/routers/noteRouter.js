import express from "express";
import Note from '../models/note.js'
// import { sendMessage } from './rabbitmq/producer.js';
const router = express.Router();

// eslint-disable-next-line no-unused-vars

router.post("/:_id", async (req, res) =>
{
    try
    {
        const { note } = req.body;
        const newNote = await Note.create({
            userId: req.params._id,
            note: note
        })
        res.status(201).json(newNote);
    } catch (error)
    {
        console.error("Post Note error", error);
    }
})


router.get('/:userId', async (req, res) =>
{
    try
    {
        const notes = await Note.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.status(200).json(notes);
    } catch (error)
    {
        console.error("Get note error", error)
    }
})

router.put('/:_id', async (req, res) =>
{
    try
    {
        const { note } = req.body;
        const oldNote = await Note.findById(req.params._id);
        if (!oldNote) return res.status(404).json({ error: "Note not found" });
        oldNote.note = note
        await oldNote.save();
        res.status(201).json(oldNote);
    } catch (error)
    {
        console.error("Update note error", error)
    }
})

router.delete('/:_id', async (req, res) =>
{
    try
    {

        await Note.findByIdAndDelete(req.params._id);
        res.status(201).send();
    } catch (error)
    {
        console.error("Delete note error", error)
    }
})

export default router;