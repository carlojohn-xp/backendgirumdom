import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { memoryAPI, reminderAPI, collaborationAPI } from '../services/api';
import MemoryList from '../components/MemoryList';
import ReminderList from '../components/ReminderList';
import CollaborationList from '../components/CollaborationList';
import MemoryForm from '../components/MemoryForm';
import ReminderForm from '../components/ReminderForm';
import '../styles/Dashboard.css';

function Dashboard() {
    const { user, logout, isMainUser, isAssistant } = useAuth();
    const [memories, setMemories] = useState([]);
    const [reminders, setReminders] = useState([]);
    const [collaborations, setCollaborations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showMemoryForm, setShowMemoryForm] = useState(false);
    const [showReminderForm, setShowReminderForm] = useState(false);
    const [selectedMemory, setSelectedMemory] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        setError('');
        try {
            const [memoriesRes, remindersRes, collaborationsRes] = await Promise.all([
                memoryAPI.getUserMemories(),
                reminderAPI.getUserReminders(),
                collaborationAPI.getUserCollaborations()
            ]);

            setMemories(memoriesRes.data);
            setReminders(remindersRes.data);
            setCollaborations(collaborationsRes.data);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
            setError('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const handleMemoryCreated = () => {
        setShowMemoryForm(false);
        setSelectedMemory(null);
        fetchDashboardData();
    };

    const handleReminderCreated = () => {
        setShowReminderForm(false);
        fetchDashboardData();
    };

    const handleMemoryEdit = (memory) => {
        setSelectedMemory(memory);
        setShowMemoryForm(true);
    };

    const handleMemoryDelete = async (memoryId) => {
        if (window.confirm('Are you sure you want to delete this memory?')) {
            try {
                await memoryAPI.delete(memoryId);
                fetchDashboardData();
            } catch (error) {
                alert('Failed to delete memory: ' + error.response?.data?.error);
            }
        }
    };

    const handleReminderComplete = async (reminderId) => {
        try {
            await reminderAPI.markComplete(reminderId);
            fetchDashboardData();
        } catch (error) {
            alert('Failed to mark reminder complete');
        }
    };

    const handleReminderDelete = async (reminderId) => {
        if (window.confirm('Are you sure you want to delete this reminder?')) {
            try {
                await reminderAPI.delete(reminderId);
                fetchDashboardData();
            } catch (error) {
                alert('Failed to delete reminder');
            }
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <div className="header-content">
                    <h1>Girumdom Dashboard</h1>
                    <div className="user-info">
                        <span className="username">{user.username}</span>
                        <span className={`user-badge ${user.user_type}`}>
                            {user.user_type === 'main' ? 'Main User' : 'Assistant'}
                        </span>
                        <button onClick={logout} className="btn-logout">Logout</button>
                    </div>
                </div>
            </header>

            {error && <div className="error-banner">{error}</div>}

            <div className="dashboard-content">
                <section className="dashboard-section">
                    <div className="section-header">
                        <h2>Memories</h2>
                        <button
                            onClick={() => setShowMemoryForm(true)}
                            className="btn-primary"
                        >
                            Add Memory
                        </button>
                    </div>

                    {showMemoryForm && (
                        <MemoryForm
                            memory={selectedMemory}
                            onClose={() => {
                                setShowMemoryForm(false);
                                setSelectedMemory(null);
                            }}
                            onSuccess={handleMemoryCreated}
                        />
                    )}

                    <MemoryList
                        memories={memories}
                        onEdit={handleMemoryEdit}
                        onDelete={handleMemoryDelete}
                        canEdit={isMainUser() || isAssistant()}
                        canDelete={isMainUser()}
                    />
                </section>

                <aside className="dashboard-sidebar">
                    <section className="dashboard-section">
                        <div className="section-header">
                            <h2>Upcoming Reminders</h2>
                            <button
                                onClick={() => setShowReminderForm(true)}
                                className="btn-secondary"
                            >
                                Add Reminder
                            </button>
                        </div>

                        {showReminderForm && (
                            <ReminderForm
                                memories={memories}
                                onClose={() => setShowReminderForm(false)}
                                onSuccess={handleReminderCreated}
                            />
                        )}

                        <ReminderList
                            reminders={reminders}
                            onComplete={handleReminderComplete}
                            onDelete={handleReminderDelete}
                        />
                    </section>

                    <section className="dashboard-section">
                        <div className="section-header">
                            <h2>Collaborations</h2>
                        </div>
                        <CollaborationList collaborations={collaborations} />
                    </section>
                </aside>
            </div>
        </div>
    );
}

export default Dashboard;
