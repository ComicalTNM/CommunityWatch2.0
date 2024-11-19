// backend/src/controllers/organizationController.ts
import { Request, Response } from 'express';
import Organization from '../models/Organization';

export const getOrganizations = async (req: Request, res: Response): Promise<void> => {
  try {
    const { limit, search } = req.query;
    let query = Organization.find();

    if (search) {
      query = query.or([
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { causes: { $in: [new RegExp(String(search), 'i')] } },
      ]);
    }

    if (limit) {
      const parsedLimit = parseInt(limit as string);
      if (isNaN(parsedLimit)) {
        res.status(400).json({ message: 'Invalid limit parameter. Must be a number.' });
        return;
      }
      query = query.limit(parsedLimit);
    }

    const organizations = await query.sort({ name: 1 });
    res.json(organizations);
  } catch (error) {
    console.error('Error fetching organizations:', error);
    res.status(500).json({ message: 'Error fetching organizations', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

export const getOrganizationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const organization = await Organization.findById(req.params.id);
    if (!organization) {
      res.status(404).json({ message: 'Organization not found' });
      return;
    }
    res.json(organization);
  } catch (error) {
    console.error('Error fetching organization:', error);
    res.status(500).json({ message: 'Error fetching organization', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

export const createOrganization = async (req: Request, res: Response): Promise<void> => {
  try {
    const newOrganization = new Organization(req.body);
    await newOrganization.save();
    res.status(201).json(newOrganization);
  } catch (error) {
    console.error('Error creating organization:', error);
    res.status(500).json({ message: 'Error creating organization', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

export const updateOrganization = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedOrganization = await Organization.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedOrganization) {
      res.status(404).json({ message: 'Organization not found' });
      return;
    }
    res.json(updatedOrganization);
  } catch (error) {
    console.error('Error updating organization:', error);
    res.status(500).json({ message: 'Error updating organization', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};

export const deleteOrganization = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedOrganization = await Organization.findByIdAndDelete(req.params.id);
    if (!deletedOrganization) {
      res.status(404).json({ message: 'Organization not found' });
      return;
    }
    res.json({ message: 'Organization deleted successfully' });
  } catch (error) {
    console.error('Error deleting organization:', error);
    res.status(500).json({ message: 'Error deleting organization', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};