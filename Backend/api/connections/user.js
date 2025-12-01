const pool = require('./pool');
const bcrypt = require('bcrypt');

async function getUserByID(user_id) {
    const [result] = await pool.query(
        'SELECT user_id, username, email, user_type, main_user_id, created_at, last_login FROM USER WHERE user_id = ?',
        [user_id]
    );
    return result[0] || null;
}

async function getUserByEmail(email) {
    const [result] = await pool.query(
        'SELECT * FROM USER WHERE email = ?',
        [email]
    );
    return result[0] || null;
}

async function getUserByUsername(username) {
    const [result] = await pool.query(
        'SELECT * FROM USER WHERE username = ?',
        [username]
    );
    return result[0] || null;
}

async function createUser(username, email, password, user_type = 'main', main_user_id = null) {
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const [result] = await pool.query(
        'INSERT INTO USER (username, email, password_hash, user_type, main_user_id) VALUES (?, ?, ?, ?, ?)',
        [username, email, password_hash, user_type, main_user_id]
    );

    return getUserByID(result.insertId);
}

async function updateLastLogin(user_id) {
    await pool.query(
        'UPDATE USER SET last_login = CURRENT_TIMESTAMP WHERE user_id = ?',
        [user_id]
    );
}

async function verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}

async function getAssistantsByMainUserID(main_user_id) {
    const [result] = await pool.query(
        'SELECT user_id, username, email, user_type, created_at FROM USER WHERE main_user_id = ?',
        [main_user_id]
    );
    return result;
}

async function getAllUsers() {
    const [result] = await pool.query(
        'SELECT user_id, username, email, user_type, main_user_id, created_at FROM USER'
    );
    return result;
}

async function updateUser(user_id, username, email) {
    await pool.query(
        'UPDATE USER SET username = ?, email = ? WHERE user_id = ?',
        [username, email, user_id]
    );
    return getUserByID(user_id);
}

async function deleteUser(user_id) {
    await pool.query('DELETE FROM USER WHERE user_id = ?', [user_id]);
    return { message: 'User deleted successfully' };
}

module.exports = {
    getUserByID,
    getUserByEmail,
    getUserByUsername,
    createUser,
    updateLastLogin,
    verifyPassword,
    getAssistantsByMainUserID,
    getAllUsers,
    updateUser,
    deleteUser
};
