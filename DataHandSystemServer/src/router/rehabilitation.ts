import express from "express";
// import { caculateRotation, getInitialPosition } from "../utils/calMaxMin";
const router = express();
import fs from 'fs';
import JointExerciseState from "../models/JointExerciseState";
import moment from 'moment-timezone';
import UserState from "../models/UserState";

/**
 * @todo: One file can be write many tims. This need to be solved
 */
router.post('/session/:PatientID', async (req, res) =>
{
  const filePath = './files/Grasping_pinching.json'; // Provide the path to your BVH file

  const data = fs.readFileSync(filePath, 'utf-8');
  const ROM = JSON.parse(data);
  var side = ''
  var ROMSchema: any = { Right: {}, Left: {} }

  for (const name in ROM)
  {
    if (name.includes('RightFinger') || name.includes('LeftFinger'))
    {
      if (name.includes('Right'))
        side = 'Right'
      else side = 'Left'

      ROMSchema[side][name] = {
        Yrotation: ROM[name]['Yrotation'],
        Xrotation: ROM[name]['Xrotation'],
        Zrotation: ROM[name]['Zrotation'],
        ROM: ROM[name]['ROM'],
      }
      console.log(ROM[name]['ROM'])
    }
  }

  console.log({ ROMSchema })
  const hands = new JointExerciseState({
    PatientID: req.params.PatientID,
    Right: ROMSchema.Right,
    Left: ROMSchema.Left,
    duration: ROM.duration
  })
  hands.save()

  res.status(200).json(hands)
})

router.post('/handSate/:PatientID', async (req, res) =>
{
  try
  {
    const defaultROM = {
      Yrotation: { Min: 0, Max: 0 },
      Xrotation: { Min: 0, Max: 0 },
      Zrotation: { Min: 0, Max: 0 },
    }

    let {
      affected,
      affectedTime,
    } = req.body
    const defaultUserState = {
      PatientID: req.params.PatientID, // Replace with a real 
      AffectedHand: affected, // Assuming both hands are affected
      AffectedTime: affectedTime,
      Milestone: {
        Right: {
          RightFinger1Metacarpal: defaultROM,
          RightFinger1Proximal: defaultROM,
          RightFinger1Distal: defaultROM,
          RightFinger2Metacarpal: defaultROM,
          RightFinger2Proximal: defaultROM,
          RightFinger2Medial: defaultROM,
          RightFinger2Distal: defaultROM,
          RightFinger3Metacarpal: defaultROM,
          RightFinger3Proximal: defaultROM,
          RightFinger3Medial: defaultROM,
          RightFinger3Distal: defaultROM,
          RightFinger4Metacarpal: defaultROM,
          RightFinger4Proximal: defaultROM,
          RightFinger4Medial: defaultROM,
          RightFinger4Distal: defaultROM,
          RightFinger5Metacarpal: defaultROM,
          RightFinger5Proximal: defaultROM,
          RightFinger5Medial: defaultROM,
          RightFinger5Distal: defaultROM,
        },
        Left: {
          LeftFinger1Metacarpal: defaultROM,
          LeftFinger1Proximal: defaultROM,
          LeftFinger1Distal: defaultROM,
          LeftFinger2Metacarpal: defaultROM,
          LeftFinger2Proximal: defaultROM,
          LeftFinger2Medial: defaultROM,
          LeftFinger2Distal: defaultROM,
          LeftFinger3Metacarpal: defaultROM,
          LeftFinger3Proximal: defaultROM,
          LeftFinger3Medial: defaultROM,
          LeftFinger3Distal: defaultROM,
          LeftFinger4Metacarpal: defaultROM,
          LeftFinger4Proximal: defaultROM,
          LeftFinger4Medial: defaultROM,
          LeftFinger4Distal: defaultROM,
          LeftFinger5Metacarpal: defaultROM,
          LeftFinger5Proximal: defaultROM,
          LeftFinger5Medial: defaultROM,
          LeftFinger5Distal: defaultROM,
        },
      },
    };
    const userState = new UserState(defaultUserState);
    await userState.save();
    res.status(200).send()
  } catch (error)
  {
    res.status(500).send()
  }
})

router.put('/updateHandState/:PatientID', async (req, res) =>
{
  try
  {
    let {
      affected,
      affectedTime,
    } = req.body
    const updatedState = await UserState.updateOne({
      PatientID: req.params.PatientID
    }, {
      $set: { ...req.body, AffectedTime: affectedTime }
    })
    res.status(200).send()
  } catch (error)
  {
    console.log(`Update user ${req.params.PatientID} error: `, error)
    res.status(500).json(error)
  }
})

router.get('/totalCompleteMinutes/:PatientID', async (req, res) =>
{
  try
  {
    console.log(req.params.PatientID)
    const result = await JointExerciseState.aggregate([
      { $match: { PatientID: req.params.PatientID } },  // Filter by PatientID
      {
        $addFields: {
          Duration: { $toDouble: "$Duration" }  // Convert duration to number
        }
      },
      {
        $group: {
          _id: "$PatientID",   // Group by PatientID
          totalDuration: { $sum: "$Duration" }  // Sum the durations
        }
      }
    ]);
    console.log({ result })
    if (result.length !== 0)
      res.status(200).json(result[0]);
    else

      res.status(404).send()
  } catch (error)
  {
    console.error(error);
    res.status(404).send()
  }
})

router.get('/userState/:PatientID', async (req, res) =>
{
  try
  {
    const rt = await UserState.findOne({
      PatientID: req.params.PatientID
    });
    res.status(200).json(rt);

  } catch (error)
  {
    console.log(`Get userState data of ${req.params.PatientID} error: `, error)
    res.status(404).send()
  }


})

// Get the 
router.get('/jointExecise/date/:PatientID/:date', async (req, res) =>
{
  try
  {
    const date = new Date(req.params.date);
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0); // Midnight in UTC

    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999); // End of the day in UTC

    console.log("Start of day:", startOfDay);
    console.log("End of day:", endOfDay);

    // Find the data for the given PatientID and date range
    const result = await JointExerciseState.findOne({
      PatientID: req.params.PatientID,
      createdAt: {
        $gte: startOfDay, // Start of the day
        $lte: endOfDay   // End of the day
      }
    });
    if (result)
    {
      res.status(200).json(result);
    } else
    {
      res.status(404).json({ message: `No data found for patient ${req.params.PatientID} on  ${req.params.date}.` });
    }
  } catch (error)
  {
    console.log(`Get exercise data of ${req.params.PatientID} on date ${req.params.date} error: `, error)
    res.status(404).json(error)
  }
})

router.get('/jointExecise/latest/:PatientID', async (req, res) =>
{
  try
  {
    // Find the latest data for the given PatientID
    const result = await JointExerciseState.findOne({
      PatientID: req.params.PatientID,
    })

    if (result)
    {
      res.status(200).json(result);
    } else
    {
      res.status(404).json({ message: `No data found for patient ${req.params.PatientID}.` });
    }
  } catch (error)
  {
    console.log(`Error getting exercise data for patient ${req.params.PatientID}: `, error);
    res.status(500).json({ error: 'An error occurred while fetching data.' });
  }
});

/**
 * @param period:'Week' | 'Month' | 'AllTime'
 */
router.get('/stateOfAJoint/:PatientID/:joint/:period', async (req, res) =>
{
  var joint = req.params.joint
  var period = req.params.period // week, month, all time
  const number = joint.match(/\d+/)![0]
  joint = joint.split(number)[1].split('_')[0]

  let dateFilter: any = {};
  const now = new Date();

  if (period === "Week")
  {
    const startOfWeek = new Date();
    startOfWeek.setDate(now.getDate() - now.getDay()); // Set to the start of the week (Sunday)
    startOfWeek.setHours(0, 0, 0, 0);
    dateFilter = { createdAt: { $gte: startOfWeek } };
  } else if (period === "Month")
  {
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1); // Start of the current month
    dateFilter = { createdAt: { $gte: startOfMonth } };
  } else 
  {
    // No date filter for "all time"
    dateFilter = {};
  }
  try
  {
    const Right = await JointExerciseState.find(
      {
        PatientID: req.params.PatientID,
        ...dateFilter
      },
      {
        [`Right.RightFinger${number}${joint}.ROM`]: 1,
        createdAt: 1,
        _id: 0
      }
    ).sort({ createdAt: 1 });
    console.log({ Right })

    let Yrotation: any[] = [];
    let Xrotation: any[] = [];
    let Zrotation: any[] = [];
    Right.forEach((doc: any) =>
    {
      const localTime = moment(doc.createdAt).tz("Europe/Copenhagen").format("YYYY-MM-DD HH:mm:ss");
      console.log(`Local Time: ${localTime}`);
      Yrotation.push({ ...doc[`Right`][`RightFinger${number}${joint}`]['ROM']['Yrotation'], Date: localTime });
      Xrotation.push({ ...doc[`Right`][`RightFinger${number}${joint}`]['ROM']['Xrotation'], Date: localTime });
      Zrotation.push({ ...doc[`Right`][`RightFinger${number}${joint}`]['ROM']['Zrotation'], Date: localTime });
    });


    if (!Right) res.status(404).send()
    else
      res.status(200).json({ Yrotation: Yrotation, Xrotation: Xrotation, Zrotation: Zrotation })
  } catch (error)
  {
    console.log("@Get daa of period error:", error)
    res.status(404).send()
  }


})

router.get('/stateOfAFinger/:PatientID/:finger', async (req, res) =>
{

})


router.get('/sessionStatusStatistic/:PatientID', async (req, res) =>
{

})

router.get('/Accuracy/:PatientID', async (req, res) =>
{

})



export default router;