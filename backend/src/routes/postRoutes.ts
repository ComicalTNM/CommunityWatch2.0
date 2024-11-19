// backend/src/routes/postRoutes.ts
import express from 'express';
import { getPosts, createPost, getPostById, getPostsByOrganizationId } from '../controllers/postController';

const router = express.Router();

router.get('/query', getPosts);
router.post('/', createPost);
router.get('/:id', getPostById);
router.get('/', getPosts);
router.get('/organization/:organizationID', getPostsByOrganizationId);
// router.delete('/:id', deletePost);

export default router;