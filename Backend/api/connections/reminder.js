const pool = require('./pool');

async function getAllReminders() {
    const [result] = await pool.query('SELECT * FROM REMINDER');
    return result;
}

async function getReminderByID(reminder_id) {
    const [result] = await pool.query(
        'SELECT * FROM REMINDER WHERE reminder_id = ?',
        [reminder_id]
    );
    return result[0] || null;
}

async function getRemindersByUserID(user_id) {
    const [result] = await pool.query(
        `SELECT r.*, m.title as memory_title
         FROM REMINDER r
         JOIN MEMORY m ON r.memory_id = m.memory_id
         WHERE m.user_id = ?
         ORDER BY r.reminder_date ASC`,
        [user_id]
    );
    return result;
}

async function getRemindersByMemoryID(memory_id) {
    const [result] = await pool.query(
        'SELECT * FROM REMINDER WHERE memory_id = ? ORDER BY reminder_date ASC',
        [memory_id]
    );
    return result;
}

async function createReminder(title, description, reminder_date, memory_id, created_by_user_id) {
    const [result] = await pool.query(
        'INSERT INTO REMINDER (title, description, reminder_date, memory_id, created_by_user_id) VALUES (?, ?, ?, ?, ?)',
        [title, description, reminder_date, memory_id, created_by_user_id]
    );
    return getReminderByID(result.insertId);
}

async function updateReminder(reminder_id, title, description, reminder_date, is_completed) {
    await pool.query(
        `UPDATE REMINDER
         SET title = ?, description = ?, reminder_date = ?, is_completed = ?
         WHERE reminder_id = ?`,
        [title, description, reminder_date, is_completed, reminder_id]
    );
    return getReminderByID(reminder_id);
}

async function deleteReminder(reminder_id) {
    await pool.query('DELETE FROM REMINDER WHERE reminder_id = ?', [reminder_id]);
    return { message: 'Reminder deleted successfully' };
}

async function markReminderComplete(reminder_id) {
    await pool.query(
        'UPDATE REMINDER SET is_completed = 1 WHERE reminder_id = ?',
        [reminder_id]
    );
    return getReminderByID(reminder_id);
}

async function getUpcomingReminders(user_id, days = 7) {
    const [result] = await pool.query(
        `SELECT r.*, m.title as memory_title
         FROM REMINDER r
         JOIN MEMORY m ON r.memory_id = m.memory_id
         WHERE m.user_id = ?
         AND r.is_completed = 0
         AND r.reminder_date >= CURDATE()
         AND r.reminder_date <= DATE_ADD(CURDATE(), INTERVAL ? DAY)
         ORDER BY r.reminder_date ASC`,
        [user_id, days]
    );
    return result;
}

module.exports = {
    getAllReminders,
    getReminderByID,
    getRemindersByUserID,
    getRemindersByMemoryID,
    createReminder,
    updateReminder,
    deleteReminder,
    markReminderComplete,
    getUpcomingReminders
};
