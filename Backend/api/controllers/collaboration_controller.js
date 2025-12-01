const express = require('express');
const router = express.Router();
const {
    getAllCollaborations,
    getCollaborationByID,
    getCollaborationsByUserID,
    createCollaboration,
    updateCollaboration,
    deleteCollaboration,
    addUserToCollaboration,
    removeUserFromCollaboration,
    getCollaborationMembers,
    addMemoryToCollaboration,
    removeMemoryFromCollaboration,
    getCollaborationMemories
} = require('../connections/collaboration');
const authMiddleware = require('../middleware/auth');

router.use(express.json());
router.use(authMiddleware);

router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

router.get('/user', async (req, res) => {
    try {
        const collaborations = await getCollaborationsByUserID(req.user.id);
        res.status(200).json(collaborations);
    } catch (error) {
        console.error('Failed to fetch user collaborations:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const collaborations = await getAllCollaborations();
        res.status(200).json(collaborations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const collaboration = await getCollaborationByID(req.params.id);
        if (!collaboration) {
            return res.status(404).json({ error: 'Collaboration not found' });
        }
        res.status(200).json(collaboration);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Collaboration name is required' });
        }

        const collaboration = await createCollaboration(name, description, req.user.id);
        res.status(201).json(collaboration);
    } catch (error) {
        console.error('Error creating collaboration:', error);
        res.status(500).json({ error: 'Failed to create collaboration' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { name, description } = req.body;
        const collaboration = await updateCollaboration(req.params.id, name, description);
        res.status(200).json(collaboration);
    } catch (error) {
        console.error('Error updating collaboration:', error);
        res.status(500).json({ error: 'Failed to update collaboration' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await deleteCollaboration(req.params.id);
        res.status(200).json({ message: 'Collaboration deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id/members', async (req, res) => {
    try {
        const members = await getCollaborationMembers(req.params.id);
        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/:id/members', async (req, res) => {
    try {
        const { user_id, role } = req.body;

        if (!user_id) {
            return res.status(400).json({ error: 'user_id is required' });
        }

        const result = await addUserToCollaboration(user_id, req.params.id, role);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error adding user to collaboration:', error);
        res.status(500).json({ error: 'Failed to add user to collaboration' });
    }
});

router.delete('/:id/members/:user_id', async (req, res) => {
    try {
        const result = await removeUserFromCollaboration(req.params.user_id, req.params.id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id/memories', async (req, res) => {
    try {
        const memories = await getCollaborationMemories(req.params.id);
        res.status(200).json(memories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/:id/memories', async (req, res) => {
    try {
        const { memory_id } = req.body;

        if (!memory_id) {
            return res.status(400).json({ error: 'memory_id is required' });
        }

        const result = await addMemoryToCollaboration(req.params.id, memory_id, req.user.id);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error adding memory to collaboration:', error);
        res.status(500).json({ error: 'Failed to add memory to collaboration' });
    }
});

router.delete('/:id/memories/:memory_id', async (req, res) => {
    try {
        const result = await removeMemoryFromCollaboration(req.params.id, req.params.memory_id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
