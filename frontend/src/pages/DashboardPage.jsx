import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { BarChart3, CheckCircle2, Clock, AlertCircle, Layers } from 'lucide-react';

const DashboardPage = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user.role === 'admin') {
            const fetchStats = async () => {
                try {
                    const res = await axios.get('http://localhost:5000/api/dashboard/analytics');
                    setStats(res.data);
                } catch (err) {
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            fetchStats();
        } else {
            setLoading(false);
        }
    }, [user]);

    if (loading) return <div className="loading">Loading dashboard...</div>;

    if (user.role === 'admin' && stats) {
        return (
            <div className="dashboard">
                <header className="dashboard-header">
                    <h1>System Overview</h1>
                    <p>Track project performance and task status across the organization.</p>
                </header>

                <div className="stats-grid">
                    <StatCard title="Total Projects" value={stats.total_projects} icon={<Layers />} color="blue" />
                    <StatCard title="Total Tasks" value={stats.total_tasks} icon={<BarChart3 />} color="indigo" />
                    <StatCard title="Completed" value={stats.completed_tasks} icon={<CheckCircle2 />} color="green" />
                    <StatCard title="Pending" value={stats.pending_tasks} icon={<Clock />} color="yellow" />
                    <StatCard title="Overdue" value={stats.overdue_tasks} icon={<AlertCircle />} color="red" />
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>Welcome, {user.name}</h1>
                <p>View your assigned projects and update task progress.</p>
            </header>
            <div className="user-welcome-card">
                <h2>Manage Your Tasks</h2>
                <p>Head over to the <a href="/projects">Projects</a> section to view tasks and update their status.</p>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, color }) => (
    <div className={`stat-card ${color}`}>
        <div className="stat-icon">{icon}</div>
        <div className="stat-info">
            <h3>{title}</h3>
            <p className="stat-value">{value}</p>
        </div>
    </div>
);

export default DashboardPage;
