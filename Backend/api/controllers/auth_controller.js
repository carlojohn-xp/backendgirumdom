const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {
    getUserByEmail,
    getUserByUsername,
    createUser,
    updateLastLogin,
    verifyPassword,
    getUserByID
} = require('../connections/user');
const authMiddleware = require('../middleware/auth');

router.use(express.json());

router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

function generateToken(user) {
    return jwt.sign(
        {
            id: user.user_id,
            username: user.username,
            email: user.email,
            user_type: user.user_type,
            main_user_id: user.main_user_id
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
}

router.post('/register', async (req, res) => {
    try {
        const { username, email, password, user_type, main_user_id } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Username, email, and password are required' });
        }

        const existingEmail = await getUserByEmail(email);
        if (existingEmail) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const existingUsername = await getUserByUsername(username);
        if (existingUsername) {
            return res.status(400).json({ error: 'Username already taken' });
        }

        if (user_type === 'assistant' && !main_user_id) {
            return res.status(400).json({ error: 'Assistant users must have a main_user_id' });
        }

        const user = await createUser(username, email, password, user_type || 'main', main_user_id);

        const token = generateToken(user);

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
                user_type: user.user_type,
                main_user_id: user.main_user_id
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isValidPassword = await verifyPassword(password, user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        await updateLastLogin(user.user_id);

        const token = generateToken(user);

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
                user_type: user.user_type,
                main_user_id: user.main_user_id
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await getUserByID(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({
            user: {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
                user_type: user.user_type,
                main_user_id: user.main_user_id,
                created_at: user.created_at,
                last_login: user.last_login
            }
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Failed to get user information' });
    }
});

router.post('/logout', authMiddleware, (req, res) => {
    res.status(200).json({ message: 'Logout successful' });
});

module.exports = router;
