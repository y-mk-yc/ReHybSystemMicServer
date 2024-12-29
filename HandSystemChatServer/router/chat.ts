import express from "express";
import Chat from "../models/chat";
import { json } from "stream/consumers";
const router = express.Router();
router.get('/', async (requestAnimationFrame, res) =>
{
    res.status(200).json('hello')
})
router.get('/:_id', async (req, res) =>
{
    const t1 = req.params._id
    const t2 = req.query.receiver
    console.log(t1, t2, req.params, req.query)
    var chat: any;
    try
    {
        chat = await Chat.findOne({
            $or: [
                { t1: t1, t2: t2 },
                { t1: t2, t2: t1 },
            ],
        });
        chat?.updateOne({
            $set: { read: 0 }
        })
        // console.log(req.query._id, req.body.receiver)
        if (!chat)
        {
            chat = new Chat({
                t1: t1,
                t2: t2,
                content: [], // Initialize with an empty content array
                read: 0, // You can modify this based on your requirements
            });

            // Save the new chat to the database
            await chat.save();
        }
        res.status(200).json(chat)
    } catch (error)
    {
        console.log(error)
        res.status(404).json(error)
    }

})



router.post('/chat/:_id', async (req, res) =>
{

})

export default router;