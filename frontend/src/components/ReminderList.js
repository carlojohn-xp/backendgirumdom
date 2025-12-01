import React from 'react';

function ReminderList({ reminders, onComplete, onDelete }) {
    if (reminders.length === 0) {
        return <p className="empty-state">No reminders set.</p>;
    }

    const sortedReminders = [...reminders].sort(
        (a, b) => new Date(a.reminder_date) - new Date(b.reminder_date)
    );

    return (
        <div className="reminder-list">
            {sortedReminders.map((reminder) => (
                <div
                    key={reminder.reminder_id}
                    className={`reminder-card ${reminder.is_completed ? 'completed' : ''}`}
                >
                    <div className="reminder-content">
                        <h4>{reminder.title}</h4>
                        {reminder.description && <p>{reminder.description}</p>}
                        <div className="reminder-meta">
                            <span className="reminder-date">
                                {new Date(reminder.reminder_date).toLocaleString()}
                            </span>
                            {reminder.memory_title && (
                                <span className="reminder-memory">
                                    Memory: {reminder.memory_title}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="reminder-actions">
                        {!reminder.is_completed && (
                            <button
                                onClick={() => onComplete(reminder.reminder_id)}
                                className="btn-icon btn-success"
                                title="Mark as complete"
                            >
                                ✓
                            </button>
                        )}
                        <button
                            onClick={() => onDelete(reminder.reminder_id)}
                            className="btn-icon btn-danger"
                            title="Delete"
                        >
                            ×
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ReminderList;
