import express from 'express';
import { register, login } from '../controllers/authController';
import { doubleCsrf } from 'csrf-csrf';
import crypto from 'crypto';

const router = express.Router();

const { generateToken, doubleCsrfProtection } = doubleCsrf({
    getSecret: () => process.env.CSRF_SECRET || crypto.randomBytes(64).toString('hex'),
    getTokenFromRequest: (req) => req.headers['x-csrf-token'],
    cookieName: 'x-csrf-token',
    cookieOptions: {
        sameSite: "none", //Allows for cross-site cookies (Only for development purposes, switch back to strict when publishing)
        secure: false //Change to 'true' if using HTTPS in production (when we build the actual website and host it on a web server)
    }
});

// For all routes, protect it with double csrf-protection.
router.use(doubleCsrfProtection);

// Route to get CSRF token
router.get('/csrf-token', (req, res) => {
    res.json({ csrfToken: generateToken(req, res) });
});

router.post('/register', register);
router.post('/login', login);

export default router;