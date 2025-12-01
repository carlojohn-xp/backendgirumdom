import React, { useState } from 'react';
import { reminderAPI } from '../services/api';

function ReminderForm({ memories, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        reminder_date: '',
        memory_id: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await reminderAPI.create(formData);
            onSuccess();
        } catch (error) {
            setError(error.response?.data?.error || 'Failed to create reminder');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Create Reminder</h3>
                    <button onClick={onClose} className="btn-close">×</button>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="Reminder title"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Additional details..."
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="reminder_date">Reminder Date & Time</label>
                        <input
                            type="datetime-local"
                            id="reminder_date"
                            name="reminder_date"
                            value={formData.reminder_date}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="memory_id">Associated Memory</label>
                        <select
                            id="memory_id"
                            name="memory_id"
                            value={formData.memory_id}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select a memory</option>
                            {memories.map((memory) => (
                                <option key={memory.memory_id} value={memory.memory_id}>
                                    {memory.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={onClose} className="btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Reminder'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ReminderForm;
