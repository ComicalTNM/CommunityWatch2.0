import express, { Request, Response, NextFunction, RequestHandler } from "express";
import Organization from "../models/Organization"; // Import your Mongoose model
import Post from "../models/Post";
import { isValidObjectId } from 'mongoose';
import multer, {StorageEngine} from 'multer';
import path from 'path';

const router = express.Router();

// Define the expected query parameters
interface SearchQuery {
    query?: string;
    filters?: string;
}

//Multer storage configuration
const storage: StorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
    cb(null, 'uploads/');  //  Where to store the files
    },
    filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);  //  Get the file extension
    cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);  //  Name the file with extension
    },
});

//Multer setup (if handling file uploads)
const upload = multer({ storage: storage});

// Define a type for the request object that includes Multer's 'file'
type MulterRequest = Request & {
    file?: Express.Multer.File; // Definitely has 'file'
};

// Function to generate the file path (relative to the backend's uploads directory)
function generateFilePath(filename: string): string {
    const backendUrl = 'http://localhost:5000'; 
    return `${backendUrl}/uploads/${filename}`;
}

// POST route to create a new organization
router.post('/', upload.single('logo'), (async(req: Request, res: Response, next: NextFunction) => {
    const {name, description, causes, adminId} = req.body;
    const profileImage = req.file ? generateFilePath(req.file.filename) : undefined;
    const parsedCauses = causes ? JSON.parse(causes) : [];

    if(!name || !description || !adminId)
    {
        return res.status(400).json({message: 'Please provide name, description, and adminId'});
    }

    const newOrganization = await Organization.create({
        name,
        description,
        profileImage,
        causes: parsedCauses,
        adminIds: [adminId], // Add the admin's ID to the adminIds array
        memberIds: [] // Intialize memberIds as empty
    });

    res.status(201).json(newOrganization);

}) as RequestHandler);

// PUT route to update an existing organization by ID
router.put('/:id', upload.single('logo'), (async(req: Request, res: Response, next: NextFunction) => {
    const organizationId = req.params.id;

    if(!isValidObjectId(organizationId)) {
        return res.status(400).json({ message: 'Invalid organization ID format' })
    }

    const { name, description, website, donationWebsite, causes} = req.body;
    const profileImage = req.file ? generateFilePath(req.file.filename) : undefined;
    const parsedCauses = causes ? JSON.parse(causes) : [];

    const updatedOrganization = await Organization.findByIdAndUpdate(
        organizationId,
        {name, description, website, donationWebsite, profileImage, causes: parsedCauses},
        {new: true, runValidators: true} // Options to return the updated doc and run validators
    );

    if(!updatedOrganization)
    {
        return res.status(404).json({ message: 'Organization not found' });
    }

    res.status(200).json(updatedOrganization);
}) as RequestHandler);

// Search organizations with filters
router.get("/search", async (req: Request<{}, {}, {}, SearchQuery>, res: Response) => {
    try {
        const { query, filters } = req.query;
        let searchConditions: any = {};

        // Search by name or description if query is provided
        if (query) {
            searchConditions.$or = [
                { name: { $regex: query, $options: "i" } }, // Case-insensitive search
                { description: { $regex: query, $options: "i" } }
            ];
        }

        // Filter by selected causes if filters are provided
        if (filters) {
            searchConditions.causes = { $in: filters.split(",") }; // Convert filters into an array
        }

        const organizations = await Organization.find(searchConditions);
        res.json(organizations);
    } catch (error) {
        console.error("Error fetching organizations:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

router.post("/by-event-ids", (async (req, res) =>{
    try{
        const eventIds: string[] = req.body;

        if(!Array.isArray(eventIds) || eventIds.length === 0)
        {
            return res.status(400).json({ message: "An array of event IDS is required!" });
        }

        //Find events based on the provided event IDs
        const events = await Post.find({ _id: { $in: eventIds } }).populate('organization');

        //Extract organization IDs from the events
        const organizationIds: string[] = events.map(event => event.organization ? event.organization._id.toString() : null).filter((id): id is string => id !== null); // Filter out any null organization Ids

        if(organizationIds.length === 0)
        {
            return res.json([]);
        }

        // Find the organizations based on the extracted organization IDs
        const organizations = await Organization.find({ _id: { $in: organizationIds } });

        //Send back the organization 
        res.json(organizations);
    }
    catch(error)
    {
        console.error("Error fetching organizations:", error);
        res.status(500).json({ message: "Failed to fetch organizations" });
    }
}) as RequestHandler);

//GET route to fetch an organization by its ID
router.get('/:id', (async(req: Request, res: Response, next: NextFunction) => {
    const organizationId = req.params.id;

    if(!isValidObjectId(organizationId))
    {
        return res.status(400).json({ message: 'Invalid organization ID format' });
    }

    const organization = await Organization.findById(organizationId);

    if(!organization)
    {
        return res.status(404).json({message: 'Organization not found'});
    }

    res.status(200).json(organization);
}) as RequestHandler)

router.stack.forEach((layer: any) => {
    if(layer.route)
    {
        console.log(`Organization Route: ${Object.keys(layer.route.methods).join(',').toUpperCase()} - ${layer.route.path}`);
    }
})

// GET route to get all the members associated with an organization.
router.get('/:organizationId/members', (async (req, res) => {
    try {
        const organizationId = req.params.organizationId;


        // Find the organization and populate the memberIds field
        const organization = await Organization.findById(organizationId).populate({
            path: 'memberIds',
            select: '_id username email role' // Select the fields you want to return
        });


        if (!organization) {
            return res.status(404).json({ message: 'Organization not found' });
        }


        // Filter the members array to only include those with the role of "member"
        // Type assertion to tell TypeScript that memberIds is an array of Users
        const members = (organization.memberIds as any[]).filter(
            (member: any) => member.role === 'member'
        );


        res.json(members);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}) as RequestHandler);

export default router;
console.log("Organization Routes File Loaded");