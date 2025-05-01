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

// POST route to create a new organization
router.post('/', upload.single('logo'), (async(req: Request, res: Response, next: NextFunction) => {
    const {name, description, causes, adminId} = req.body;
    const profileImage = req.file ? `/uploads/${req.file.filename}` : undefined;
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

router.post("/by-event-ids", async (req, res) =>{
    try{
        const {eventIds} = req.body;

        //Find events based on the provided event IDs
        const events = await Post.find({ _id: { $in: eventIds } }).populate('organization');

        //Extract organization IDs from the events
        const organizationIds = events.map(event => event.organization).filter(Boolean); // Filter out any null organization Ids

        // Find the organizations based on the extracted organization IDs
        const organizations = await Organization.find({ _id: { $in: organizationIds } });

        //Extract organization names from the organizations
        const organizationNames = organizations.map(org => org.name);

        //Send back unique organization names
        res.json([...new Set(organizationNames)]);
    }
    catch(error)
    {
        console.error("Error fetching organizations:", error);
        res.status(500).json({ message: "Failed to fetch organizations" });
    }
});

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

export default router;
console.log("Organization Routes File Loaded");