const { hasPermission } = require('../connections/permission');

async function checkPermission(permission_type) {
    return async (req, res, next) => {
        try {
            if (req.user.user_type === 'main') {
                return next();
            }

            if (req.user.user_type === 'assistant') {
                const allowed = await hasPermission(req.user.id, permission_type);

                if (!allowed) {
                    return res.status(403).json({
                        error: 'Permission denied',
                        message: `You do not have permission to ${permission_type.replace('can_', '').replace('_', ' ')}`
                    });
                }

                return next();
            }

            return res.status(403).json({ error: 'Invalid user type' });
        } catch (error) {
            console.error('Permission check error:', error);
            return res.status(500).json({ error: 'Failed to check permissions' });
        }
    };
}

const canCreateMemory = checkPermission('can_create_memory');
const canEditMemory = checkPermission('can_edit_memory');
const canDeleteMemory = checkPermission('can_delete_memory');
const canCreateReminder = checkPermission('can_create_reminder');
const canUploadMedia = checkPermission('can_upload_media');

module.exports = {
    checkPermission,
    canCreateMemory,
    canEditMemory,
    canDeleteMemory,
    canCreateReminder,
    canUploadMedia
};
