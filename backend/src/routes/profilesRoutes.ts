// backend/src/routes/postRoutes.ts
import express from 'express';
import { getOrganizationProfile } from '../controllers/profilesController';

const router = express.Router();

router.get('/:id', getOrganizationProfile);
// router.delete('/:id', deletePost);

export default router;