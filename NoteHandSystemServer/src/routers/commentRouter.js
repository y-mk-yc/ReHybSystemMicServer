/* eslint-disable no-unused-vars */
import express from "express";
import Comment from '../models/comment.js'
import { dbSys } from "../../db_connections.mjs";
// import { sendMessage } from './rabbitmq/producer.js';
import { ObjectId } from "mongodb";
const router = express.Router();


router.post("/:senderId", async (req, res) =>
{
    try
    {
        const { comment, receiver } = req.body;
        const newComment = await Comment.create({
            // userId: req.params.senderId,
            comment: comment,
            receiver: receiver,
            sender: req.params.senderId
        })
        res.status(201).json(newComment);
    } catch (error)
    {
        console.error("Post Comment error", error);
    }
})


router.get('/getCommentOfSender/:senderId', async (req, res) =>
{
    try
    {
        const comments = await Comment.find({ sender: req.params.senderId });
        res.status(201).json(comments);
    } catch (error)
    {
        console.error("Get comment error", error)
    }
})

router.get('/getCommentOfReceiver/:receiverId', async (req, res) =>
{
    try
    {
        const patientProfileCollection = dbSys.collection("patient_profiles");

        const patient = await patientProfileCollection.find({
            patientID: req.params.receiverId
        })
        const comments = await Comment.find({ receiver: patient._id });
        res.status(201).json(comments);
    } catch (error)
    {
        console.error("Get comment error", error)
    }
})

router.get('/getCommentOfSenderOfToday/:senderId', async (req, res) =>
{
    try
    {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0); // Set time to 00:00:00

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999); // Set time to 23:59:59

        const comments = await Comment.find({
            sender: req.params.senderId,
            createdAt: { $gte: startOfDay, $lte: endOfDay },
        },

        );
        res.status(201).json(comments);
    } catch (error)
    {
        console.error("Get comment error", error)
    }
})

router.get('/getCommentOfReceiverOfToday/:receiverId', async (req, res) =>
{
    try
    {
        var comments;
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0); // Set time to 00:00:00

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999); // Set time to 23:59:59

        if (!req.params.receiverId.includes("PAT"))
        {
            const patientProfileCollection = dbSys.collection("patient_profiles");

            const patient = await patientProfileCollection.findOne({
                _id: new ObjectId(req.params.receiverId),
            });
            comments = await Comment.find({
                receiver: patient.PatientID,
                createdAt: { $gte: startOfDay, $lte: endOfDay },
            }).sort({ createdAt: -1 });
        }
        else
        {
            comments = Comment.find({ receiver: req.params.receiverId }).sort({ createdAt: -1 });
        }
        // const comments = Comment.find({ receiver: req.params.receiverId })
        res.status(201).json(comments);
    } catch (error)
    {
        console.error("Get comment error", error)
    }
})



router.put('/:_id', async (req, res) =>
{
    try
    {
        const { comment } = req.body;
        const oldComment = await Comment.findById(req.params._id);
        if (!oldComment) return res.status(404).json({ error: "Comment not found" });
        oldComment.comment = comment
        await oldComment.save();
        res.status(201).json(oldComment);
    } catch (error)
    {
        console.error("Update comment error", error)
    }
})

router.delete('/:_id', async (req, res) =>
{
    try
    {

        await Comment.findByIdAndDelete(req.params._id);
        res.status(201).send();
    } catch (error)
    {
        console.error("Delete note error", error)
    }
})

export default router;