import React, { useState } from 'react';
import AudioPlayer from './AudioPlayer';

function MemoryList({ memories, onEdit, onDelete, canEdit, canDelete }) {
    const [expandedMemory, setExpandedMemory] = useState(null);

    if (memories.length === 0) {
        return <p className="empty-state">No memories yet. Create your first memory!</p>;
    }

    return (
        <div className="memory-list">
            {memories.map((memory) => (
                <div key={memory.memory_id} className="memory-card">
                    <div className="memory-header">
                        <h3>{memory.title}</h3>
                        <div className="memory-actions">
                            {canEdit && (
                                <button
                                    onClick={() => onEdit(memory)}
                                    className="btn-icon"
                                    title="Edit"
                                >
                                    Edit
                                </button>
                            )}
                            {canDelete && (
                                <button
                                    onClick={() => onDelete(memory.memory_id)}
                                    className="btn-icon btn-danger"
                                    title="Delete"
                                >
                                    Delete
                                </button>
                            )}
                            <button
                                onClick={() =>
                                    setExpandedMemory(
                                        expandedMemory === memory.memory_id
                                            ? null
                                            : memory.memory_id
                                    )
                                }
                                className="btn-icon"
                            >
                                {expandedMemory === memory.memory_id ? 'Collapse' : 'Expand'}
                            </button>
                        </div>
                    </div>

                    <div className="memory-meta">
                        <span>Created: {new Date(memory.created_at).toLocaleDateString()}</span>
                        {memory.date_of_event && (
                            <span>Event Date: {new Date(memory.date_of_event).toLocaleDateString()}</span>
                        )}
                    </div>

                    {expandedMemory === memory.memory_id && (
                        <div className="memory-details">
                            <p className="memory-content">{memory.content}</p>

                            {memory.images && memory.images.length > 0 && (
                                <div className="memory-images">
                                    <h4>Images</h4>
                                    <div className="image-grid">
                                        {memory.images.map((image) => (
                                            <img
                                                key={image.photo_id}
                                                src={image.file_path}
                                                alt={image.filename}
                                                className="memory-image"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            <AudioPlayer memoryId={memory.memory_id} content={memory.content} />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default MemoryList;
