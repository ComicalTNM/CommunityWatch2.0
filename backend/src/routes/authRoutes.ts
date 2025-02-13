import express from 'express';
import { register, login } from '../controllers/authController';
import { doubleCsrf } from 'csrf-csrf';
import crypto from 'crypto';

const router = express.Router();

const { generateToken, doubleCsrfProtection } = doubleCsrf({
    getSecret: () => process.env.CSRF_SECRET || crypto.randomBytes(64).toString('hex'),
    getTokenFromRequest: (req) => {
        console.log('Received CSRF Token:', req.headers['x-csrf-token']);
        console.log('Received CSRF Token from Cookies:', req.cookies['x-csrf-token']);
        console.log('Cookies:', req.cookies); //Checks to see if the cookie is set
        return req.cookies['x-csrf-token'] || req.headers['x-csrf-token'];
    },
    cookieName: 'x-csrf-token',
    cookieOptions: {
        sameSite: "lax", //Allows for cross-site cookies (Only for development purposes, switch back to strict when publishing)
        secure: false //Change to 'true' if using HTTPS in production (when we build the actual website and host it on a web server)
    }
});

// Route to get CSRF token
router.get('/csrf-token', (req, res) => {
    const csrfToken = generateToken(req, res);
    console.log('Generated CSRF Token:', csrfToken);
    res.cookie('x-csrf-token', csrfToken, {
        httpOnly: false, //Allows frontend Javascript to access it
        secure: false, //Change to true when we build the website and host it on a webserver
        sameSite: 'lax'
    });
    console.log('Cookie Set:', res.getHeaders()['set-cookie']); //Logs what is being sent 
    res.json({ csrfToken }); 
});

router.post('/register', register);
router.post('/login', login);

export default router;