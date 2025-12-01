const pool = require('./pool');

async function getAllCollaborations() {
    const [result] = await pool.query('SELECT * FROM COLLABORATION');
    return result;
}

async function getCollaborationByID(collaboration_id) {
    const [result] = await pool.query(
        'SELECT * FROM COLLABORATION WHERE collaboration_id = ?',
        [collaboration_id]
    );
    return result[0] || null;
}

async function getCollaborationsByUserID(user_id) {
    const [result] = await pool.query(
        `SELECT c.*, uc.role, uc.joined_at
         FROM COLLABORATION c
         JOIN USER_COLLABORATION uc ON c.collaboration_id = uc.collaboration_id
         WHERE uc.user_id = ?`,
        [user_id]
    );
    return result;
}

async function createCollaboration(name, description, main_user_id) {
    const [result] = await pool.query(
        'INSERT INTO COLLABORATION (name, description, main_user_id) VALUES (?, ?, ?)',
        [name, description, main_user_id]
    );

    await pool.query(
        'INSERT INTO USER_COLLABORATION (user_id, collaboration_id, role) VALUES (?, ?, ?)',
        [main_user_id, result.insertId, 'owner']
    );

    return getCollaborationByID(result.insertId);
}

async function updateCollaboration(collaboration_id, name, description) {
    await pool.query(
        'UPDATE COLLABORATION SET name = ?, description = ? WHERE collaboration_id = ?',
        [name, description, collaboration_id]
    );
    return getCollaborationByID(collaboration_id);
}

async function deleteCollaboration(collaboration_id) {
    await pool.query('DELETE FROM COLLABORATION WHERE collaboration_id = ?', [collaboration_id]);
    return { message: 'Collaboration deleted successfully' };
}

async function addUserToCollaboration(user_id, collaboration_id, role = 'editor') {
    const [result] = await pool.query(
        'INSERT INTO USER_COLLABORATION (user_id, collaboration_id, role) VALUES (?, ?, ?)',
        [user_id, collaboration_id, role]
    );
    return { message: 'User added to collaboration successfully' };
}

async function removeUserFromCollaboration(user_id, collaboration_id) {
    await pool.query(
        'DELETE FROM USER_COLLABORATION WHERE user_id = ? AND collaboration_id = ?',
        [user_id, collaboration_id]
    );
    return { message: 'User removed from collaboration successfully' };
}

async function getCollaborationMembers(collaboration_id) {
    const [result] = await pool.query(
        `SELECT u.user_id, u.username, u.email, uc.role, uc.joined_at
         FROM USER u
         JOIN USER_COLLABORATION uc ON u.user_id = uc.user_id
         WHERE uc.collaboration_id = ?`,
        [collaboration_id]
    );
    return result;
}

async function addMemoryToCollaboration(collaboration_id, memory_id, added_by_user_id) {
    const [result] = await pool.query(
        'INSERT INTO COLLABORATION_MEMORY (collaboration_id, memory_id, added_by_user_id) VALUES (?, ?, ?)',
        [collaboration_id, memory_id, added_by_user_id]
    );
    return { message: 'Memory added to collaboration successfully' };
}

async function removeMemoryFromCollaboration(collaboration_id, memory_id) {
    await pool.query(
        'DELETE FROM COLLABORATION_MEMORY WHERE collaboration_id = ? AND memory_id = ?',
        [collaboration_id, memory_id]
    );
    return { message: 'Memory removed from collaboration successfully' };
}

async function getCollaborationMemories(collaboration_id) {
    const [result] = await pool.query(
        `SELECT m.*, cm.added_at, u.username as added_by_username
         FROM MEMORY m
         JOIN COLLABORATION_MEMORY cm ON m.memory_id = cm.memory_id
         JOIN USER u ON cm.added_by_user_id = u.user_id
         WHERE cm.collaboration_id = ?
         ORDER BY cm.added_at DESC`,
        [collaboration_id]
    );
    return result;
}

module.exports = {
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
};
