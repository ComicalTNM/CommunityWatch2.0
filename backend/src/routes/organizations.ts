import express, { Request, Response } from "express";
import Organization from "../models/Organization"; // Import your Mongoose model

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

export default router;
