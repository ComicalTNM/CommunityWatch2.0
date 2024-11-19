// backend/src/routes/organizationRoutes.ts
import express from 'express';
import { 
  getOrganizations, 
  getOrganizationById, 
  createOrganization, 
  updateOrganization, 
  deleteOrganization,
} from '../controllers/organizationController';

const router = express.Router();

// Query organizations (with optional limit and search)
router.get('/query', getOrganizations);

// Create a new organization
router.post('/', createOrganization);

// Get a specific organization by ID
router.get('/:id', getOrganizationById);

// Update a specific organization
router.put('/:id', updateOrganization);

// Delete a specific organization
router.delete('/:id', deleteOrganization);

// Get all organizations (without query parameters)
router.get('/', getOrganizations);

export default router;