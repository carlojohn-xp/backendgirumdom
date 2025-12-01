import React from 'react';

function CollaborationList({ collaborations }) {
    if (collaborations.length === 0) {
        return <p className="empty-state">No collaborations yet.</p>;
    }

    return (
        <div className="collaboration-list">
            {collaborations.map((collab) => (
                <div key={collab.collaboration_id} className="collaboration-card">
                    <h4>{collab.name}</h4>
                    {collab.description && <p>{collab.description}</p>}
                    <div className="collaboration-meta">
                        <span className={`role-badge ${collab.role}`}>
                            {collab.role}
                        </span>
                        <span className="join-date">
                            Joined: {new Date(collab.joined_at).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default CollaborationList;
