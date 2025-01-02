import express from "express";
import { caculateRotation, getInitialPosition } from "../utils/calMaxMin";
const router = express();
import fs from 'fs';
import JointExerciseState from "../models/JointExerciseState";

/**
 * @todo: One file can be write many tims. This need to be solved
 */
router.post('/:PatientID', async (req, res) =>
{
  const filePath = './files/Grasping_pinching.json'; // Provide the path to your BVH file

  const data = fs.readFileSync(filePath, 'utf-8');
  const ROM = JSON.parse(data);
  var side = ''
  var ROMSchema: any = { right: {}, left: {} }

  for (const name in ROM)
  {
    if (name.includes('RightFinger') || name.includes('LeftFinger'))
    {
      if (name.includes('Right'))
        side = 'right'
      else side = 'left'

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
    right: ROMSchema.right,
    left: ROMSchema.left,
    duration: ROM.duration
  })
  hands.save()

  res.status(200).json(hands)
})

router.get('/totalCompleteMinutes/:PatientID', async (req, res) =>
{
  try
  {
    const result = await JointExerciseState.aggregate([
      { $match: { PatientID: req.params.PatientID } },  // Filter by PatientID
      {
        $addFields: {
          duration: { $toDouble: "$duration" }  // Convert duration to number
        }
      },
      {
        $group: {
          _id: "$PatientID",   // Group by PatientID
          totalDuration: { $sum: "$duration" }  // Sum the durations
        }
      }
    ]);
    res.status(200).json(result[0]);
  } catch (error)
  {
    console.error(error);
    res.status(404).send()
  }
})

router.get('/sessionStatusStatistic/:PatientID', async (req, res) =>
{

})

router.get('/Accuracy/:PatientID', async (req, res) =>
{

})


export default router;