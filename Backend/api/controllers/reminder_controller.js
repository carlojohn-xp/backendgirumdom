const express = require('express');
const router = express.Router();
const {
    getAllReminders,
    getReminderByID,
    getRemindersByUserID,
    getRemindersByMemoryID,
    createReminder,
    updateReminder,
    deleteReminder,
    markReminderComplete,
    getUpcomingReminders
} = require('../connections/reminder');
const authMiddleware = require('../middleware/auth');

router.use(express.json());
router.use(authMiddleware);

router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

router.get('/user', async (req, res) => {
    try {
        const reminders = await getRemindersByUserID(req.user.id);
        res.status(200).json(reminders);
    } catch (error) {
        console.error('Failed to fetch user reminders:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/upcoming', async (req, res) => {
    try {
        const days = req.query.days || 7;
        const reminders = await getUpcomingReminders(req.user.id, days);
        res.status(200).json(reminders);
    } catch (error) {
        console.error('Failed to fetch upcoming reminders:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/memory/:memory_id', async (req, res) => {
    try {
        const reminders = await getRemindersByMemoryID(req.params.memory_id);
        res.status(200).json(reminders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const reminders = await getAllReminders();
        res.status(200).json(reminders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const reminder = await getReminderByID(req.params.id);
        if (!reminder) {
            return res.status(404).json({ error: 'Reminder not found' });
        }
        res.status(200).json(reminder);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { title, description, reminder_date, memory_id } = req.body;

        if (!title || !reminder_date || !memory_id) {
            return res.status(400).json({ error: 'Title, reminder_date, and memory_id are required' });
        }

        const reminder = await createReminder(title, description, reminder_date, memory_id, req.user.id);
        res.status(201).json(reminder);
    } catch (error) {
        console.error('Error creating reminder:', error);
        res.status(500).json({ error: 'Failed to create reminder' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { title, description, reminder_date, is_completed } = req.body;
        const reminder = await updateReminder(
            req.params.id,
            title,
            description,
            reminder_date,
            is_completed
        );
        res.status(200).json(reminder);
    } catch (error) {
        console.error('Error updating reminder:', error);
        res.status(500).json({ error: 'Failed to update reminder' });
    }
});

router.patch('/:id/complete', async (req, res) => {
    try {
        const reminder = await markReminderComplete(req.params.id);
        res.status(200).json(reminder);
    } catch (error) {
        console.error('Error marking reminder complete:', error);
        res.status(500).json({ error: 'Failed to mark reminder complete' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await deleteReminder(req.params.id);
        res.status(200).json({ message: 'Reminder deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
