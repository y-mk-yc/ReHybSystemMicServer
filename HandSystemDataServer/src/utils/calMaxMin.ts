import fs from 'fs';

type Joint = {
    name: string;
    parent: string | null;
    children: string[];
};

var framesNum = 0;
var frameTime = 0;
var duration = 0;
// Function to parse the hierarchy from a BVH file
export function parseHierarchy(filepath: string): Record<string, Joint>
{
    const fileContent = fs.readFileSync(filepath, "utf-8");
    const lines = fileContent.split("\n").map((line) => line.trim()); // Clean up each line

    const stack: string[] = []; // Keeps track of the current hierarchy (parent joints)
    const joints: Record<string, Joint> = {}; // Stores all joints

    for (const line of lines)
    {
        if (line.startsWith("ROOT") || line.startsWith("JOINT"))
        {
            // Extract joint name (ROOT or JOINT)
            const name = line.split(/\s+/)[1];

            // Determine the parent joint (from the top of the stack)
            const parent = stack.length > 0 ? stack[stack.length - 1] : null;

            // Create the joint entry
            joints[name] = {
                name,
                parent,
                children: [],
            };

            // If there's a parent, add this joint to its parent's children
            if (parent)
            {
                joints[parent].children.push(name);
            }
            stack.push(name);
        } else if (line === "End Site")
        {
        } else if (line === "}")
        {
            stack.pop();
        }
    }

    return joints;
}
// Function to parse the .bvh file and extract the joint information
export function getInitialPosition(filePath: string)
{
    const hierarchy: any = parseHierarchy(filePath);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const lines = fileContent.split('\n');
    // var initialPosition: { right: any; left: any } = { right: null, left: null };
    var initialPosition: any = {}
    var parent = '';
    var current = '';
    var offset: any = [];
    var channels: any = [];
    var end = 0;
    // current = 'HIPS'
    for (var i = 0; i < lines.length; i++)
    {
        var line = lines[i]

        line = line.trim();

        if (line.includes('JOINT') || line.includes('ROOT'))
        {
            current = line.split(' ')[1]
            initialPosition[current] = {}
            initialPosition[current]['ROM'] = []

        }
        else if (line.includes('OFFSET'))
        {
            offset = line.split(' ').slice(1)

        } else if (line.includes('CHANNELS'))
        {
            channels = line.split(' ').slice(1)
            // console.log(initialPosition)
            initialPosition[current]['start'] = end;

            initialPosition[current]['end'] = end + Number(channels[0]) - 1;

            if (channels[0] > offset.length)
            {
                offset = offset.concat(new Array(channels[0] - offset.length).fill(0))
            }

            end = end + Number(channels[0]);

            for (let i = 0; i < channels[0]; i++)
            {
                if (hierarchy[current][parent] == null)
                {
                    initialPosition[current][channels[i + 1]] = 0 + Number(offset[i])
                } else
                    initialPosition[current][channels[i + 1]] = initialPosition[parent][channels[i + 1]] + Number(offset[i])
            }

        } else if (line.includes('Frames'))
        {
            framesNum = Number(line.split(' ')[1]);
        }
        else if (line.includes('Frame Time'))
        {
            frameTime = Number(line.split(' ')[2]);
            break
        }
    }
    console.log({ framesNum, frameTime }, frameTime * framesNum)
    duration = frameTime * framesNum
    console.log({ duration })
    initialPosition['duration'] = duration
    return initialPosition
}


// Function to calculate ROM for each finger joint

export function caculateRotation(filePath: string, initialPosition: any)
{
    console.log('Loading...')
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const lines = fileContent.split('\n');

    var start = false
    for (var i = 0; i < lines.length; i++)
    {
        var line = lines[i]
        line = line.trim();
        if (line.includes('Frame Time'))
        {
            start = true
            continue
        }
        if (start)
        {
            for (const name in initialPosition)
            {
                var ROM;
                if (name == 'duration')
                    continue
                if (initialPosition[name]['ROM'].length === 0)
                {
                    initialPosition[name]['ROM'] = { Yrotation: { max: initialPosition[name]['Yrotation'], min: -initialPosition[name]['Yrotation'] }, Xrotation: { max: initialPosition[name]['Xrotation'], min: -initialPosition[name]['Xrotation'] }, Zrotation: { max: initialPosition[name]['Zrotation'], min: -initialPosition[name]['Zrotation'] } }
                }
                const motions = line.split(' ').map(Number);
                if (name.includes('Right') || name.includes('Left'))
                {
                    // console.log({name},":",initialPosition[name]['ROM']['Yrotation']['max'])
                    ROM = initialPosition[name]['ROM']
                    // if (motions[initialPosition[name]['start']] + initialPosition[name]['ROM']['Yrotation']['max'] > initialPosition[name]['ROM']['Yrotation']['max'])                
                    //    initialPosition[name]['ROM']['Yrotation']['max'] = motions[initialPosition[name]['start']] + initialPosition[name]['ROM']['Yrotation']['max']
                    //   else if (motions[initialPosition[name]['start']] + initialPosition[name]['ROM']['Yrotation']['min'] < initialPosition[name]['ROM']['Yrotation']['min'])
                    //     initialPosition[name]['ROM']['Yrotation']['min'] = motions[initialPosition[name]['start']] + initialPosition[name]['ROM']['Yrotation']['min']

                    // if (motions[initialPosition[name]['start'] + 1] + initialPosition[name]['ROM']['Yrotation']['max'] > initialPosition[name]['ROM']['Yrotation']['max'])
                    //     initialPosition[name]['ROM']['Yrotation']['max'] = motions[initialPosition[name]['start'] + 1] + initialPosition[name]['ROM']['Yrotation']['max']
                    // else if (motions[initialPosition[name]['start'] + 1] + initialPosition[name]['ROM']['Yrotation']['min'] < initialPosition[name]['ROM']['Yrotation']['min'])
                    //     initialPosition[name]['ROM']['Yrotation']['min'] = motions[initialPosition[name]['start'] + 1] + initialPosition[name]['ROM']['Yrotation']['min']

                    // if (motions[initialPosition[name]['start'] + 2] + initialPosition[name]['ROM']['Yrotation']['max'] > initialPosition[name]['ROM']['Yrotation']['max'])
                    //     initialPosition[name]['ROM']['Yrotation']['max'] = motions[initialPosition[name]['start'] + 2] + initialPosition[name]['ROM']['Yrotation']['max']
                    // else if (motions[initialPosition[name]['start'] + 2] + initialPosition[name]['ROM']['Yrotation']['min'] < initialPosition[name]['ROM']['Yrotation']['min'])
                    //     initialPosition[name]['ROM']['Yrotation']['min'] = motions[initialPosition[name]['start'] + 2] + initialPosition[name]['ROM']['Yrotation']['min']
                    if (motions[initialPosition[name]['start']] > initialPosition[name]['ROM']['Yrotation']['max'])
                        initialPosition[name]['ROM']['Yrotation']['max'] = motions[initialPosition[name]['start']]
                    else if (motions[initialPosition[name]['start']] < initialPosition[name]['ROM']['Yrotation']['min'])
                        initialPosition[name]['ROM']['Yrotation']['min'] = motions[initialPosition[name]['start']]

                    if (motions[initialPosition[name]['start'] + 1] > initialPosition[name]['ROM']['Yrotation']['max'])
                        initialPosition[name]['ROM']['Yrotation']['max'] = motions[initialPosition[name]['start'] + 1]
                    else if (motions[initialPosition[name]['start'] + 1] < initialPosition[name]['ROM']['Yrotation']['min'])
                        initialPosition[name]['ROM']['Yrotation']['min'] = motions[initialPosition[name]['start'] + 1]

                    if (motions[initialPosition[name]['start'] + 2] > initialPosition[name]['ROM']['Yrotation']['max'])
                        initialPosition[name]['ROM']['Yrotation']['max'] = motions[initialPosition[name]['start'] + 2]
                    else if (motions[initialPosition[name]['start'] + 2] < initialPosition[name]['ROM']['Yrotation']['min'])
                        initialPosition[name]['ROM']['Yrotation']['min'] = motions[initialPosition[name]['start'] + 2]


                } else
                {

                }
            }
            // initialPosition[current]['ROM'] = []

        }
    }

    console.log('Done')

    return initialPosition;

}


// Example usage:

