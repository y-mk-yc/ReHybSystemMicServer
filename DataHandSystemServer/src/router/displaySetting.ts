import express from "express";
import ModelSetting from "../models/ModelSetting";
import { Contrast } from "../config/constant";

const router = express();

/**
 * Update settings
 */
router.put('/:UserID', async (req, res) =>
{
    const updates = req.body;
    const userID = req.params.UserID;

    try
    {
        const result = await ModelSetting.updateOne(
            { UserID: userID },
            { $set: updates } // Use $set to apply the updates
        );

        // Check if a document was actually updated
        if (result.modifiedCount === 0)
        {
            res.status(404).send();
        }

        res.status(200).send();
    } catch (error)
    {
        console.log('Update model setting error:', error);
        res.status(500).json({ message: `Update model setting error: ${error}` });
    }
});


router.get('/:userID', async (req, res) =>
{
    try
    {
        const userID = req.params.userID
        console.log({ userID })
        var setting
        setting = await ModelSetting.findOne({
            UserID: userID
        })
        if (!setting)
        {
            setting = new ModelSetting({
                UserID: userID
            });
            await setting.save()
        }

        res.status(200).json(setting)

    } catch (error)
    {
        console.log("Get setting error: ", error)
        res.status(404).send()
    }
}

)

export default router;