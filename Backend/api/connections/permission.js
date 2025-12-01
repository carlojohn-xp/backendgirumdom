const pool = require('./pool');

async function getPermissions(main_user_id, assistant_user_id) {
    const [result] = await pool.query(
        'SELECT * FROM ASSISTANT_PERMISSION WHERE main_user_id = ? AND assistant_user_id = ?',
        [main_user_id, assistant_user_id]
    );
    return result[0] || null;
}

async function createPermissions(main_user_id, assistant_user_id, permissions = {}) {
    const {
        can_create_memory = 1,
        can_edit_memory = 0,
        can_delete_memory = 0,
        can_create_reminder = 1,
        can_upload_media = 0
    } = permissions;

    const [result] = await pool.query(
        `INSERT INTO ASSISTANT_PERMISSION
         (main_user_id, assistant_user_id, can_create_memory, can_edit_memory,
          can_delete_memory, can_create_reminder, can_upload_media)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [main_user_id, assistant_user_id, can_create_memory, can_edit_memory,
         can_delete_memory, can_create_reminder, can_upload_media]
    );

    return getPermissions(main_user_id, assistant_user_id);
}

async function updatePermissions(main_user_id, assistant_user_id, permissions) {
    const {
        can_create_memory,
        can_edit_memory,
        can_delete_memory,
        can_create_reminder,
        can_upload_media
    } = permissions;

    await pool.query(
        `UPDATE ASSISTANT_PERMISSION
         SET can_create_memory = ?,
             can_edit_memory = ?,
             can_delete_memory = ?,
             can_create_reminder = ?,
             can_upload_media = ?
         WHERE main_user_id = ? AND assistant_user_id = ?`,
        [can_create_memory, can_edit_memory, can_delete_memory,
         can_create_reminder, can_upload_media, main_user_id, assistant_user_id]
    );

    return getPermissions(main_user_id, assistant_user_id);
}

async function deletePermissions(main_user_id, assistant_user_id) {
    await pool.query(
        'DELETE FROM ASSISTANT_PERMISSION WHERE main_user_id = ? AND assistant_user_id = ?',
        [main_user_id, assistant_user_id]
    );
    return { message: 'Permissions deleted successfully' };
}

async function getAssistantPermissionsForUser(assistant_user_id) {
    const [result] = await pool.query(
        'SELECT * FROM ASSISTANT_PERMISSION WHERE assistant_user_id = ?',
        [assistant_user_id]
    );
    return result[0] || null;
}

async function hasPermission(assistant_user_id, permission_type) {
    const permissions = await getAssistantPermissionsForUser(assistant_user_id);

    if (!permissions) {
        return false;
    }

    return Boolean(permissions[permission_type]);
}

module.exports = {
    getPermissions,
    createPermissions,
    updatePermissions,
    deletePermissions,
    getAssistantPermissionsForUser,
    hasPermission
};
