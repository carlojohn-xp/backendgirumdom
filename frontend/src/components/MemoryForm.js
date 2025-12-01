import React, { useState, useEffect } from 'react';
import { memoryAPI, imageAPI } from '../services/api';

function MemoryForm({ memory, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        date_of_event: ''
    });
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (memory) {
            setFormData({
                title: memory.title || '',
                content: memory.content || '',
                date_of_event: memory.date_of_event ? memory.date_of_event.split('T')[0] : ''
            });
        }
    }, [memory]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (e) => {
        setImages(Array.from(e.target.files));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let result;
            if (memory) {
                result = await memoryAPI.update(memory.memory_id, formData);
            } else {
                result = await memoryAPI.create(formData);
            }

            if (images.length > 0 && result.data) {
                const memoryId = result.data.memory_id;
                for (const image of images) {
                    const reader = new FileReader();
                    reader.onload = async (e) => {
                        try {
                            await imageAPI.uploadBase64(
                                e.target.result,
                                memoryId,
                                image.name
                            );
                        } catch (err) {
                            console.error('Image upload failed:', err);
                        }
                    };
                    reader.readAsDataURL(image);
                }
            }

            onSuccess();
        } catch (error) {
            setError(error.response?.data?.error || 'Failed to save memory');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>{memory ? 'Edit Memory' : 'Create New Memory'}</h3>
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
                            placeholder="Memory title"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="content">Content</label>
                        <textarea
                            id="content"
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            rows="6"
                            placeholder="Describe your memory..."
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="date_of_event">Event Date</label>
                        <input
                            type="date"
                            id="date_of_event"
                            name="date_of_event"
                            value={formData.date_of_event}
                            onChange={handleChange}
                        />
                    </div>

                    {!memory && (
                        <div className="form-group">
                            <label htmlFor="images">Images (optional)</label>
                            <input
                                type="file"
                                id="images"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                            />
                        </div>
                    )}

                    <div className="form-actions">
                        <button type="button" onClick={onClose} className="btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Saving...' : memory ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default MemoryForm;
