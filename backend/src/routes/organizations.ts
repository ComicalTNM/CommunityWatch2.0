import express, { Request, Response } from "express";
import Organization from "../models/Organization"; // Import your Mongoose model
import Post from "../models/Post";

const router = express.Router();

// Define the expected query parameters
interface SearchQuery {
    query?: string;
    filters?: string;
}

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


router.stack.forEach((layer: any) => {
    if(layer.route)
    {
        console.log(`Organization Route: ${Object.keys(layer.route.methods).join(',').toUpperCase()} - ${layer.route.path}`);
    }
})

export default router;
console.log("Organization Routes File Loaded");