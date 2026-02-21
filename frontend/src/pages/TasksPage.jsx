import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useParams } from 'react-router-dom';
import { Plus, Trash2, Edit2, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const TasksPage = () => {
    const { id: projectId } = useParams();
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [filter, setFilter] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [editTask, setEditTask] = useState(null);
    const [formData, setFormData] = useState({ title: '', description: '', due_date: '', status: 'Pending' });

    const fetchTasks = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/tasks/project/${projectId}`);
            setTasks(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [projectId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editTask) {
                await axios.put(`http://localhost:5000/api/tasks/${editTask.id}`, formData);
            } else {
                await axios.post('http://localhost:5000/api/tasks', { ...formData, project_id: projectId });
            }
            setShowModal(false);
            setEditTask(null);
            setFormData({ title: '', description: '', due_date: '', status: 'Pending' });
            fetchTasks();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this task?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/tasks/${id}`);
            fetchTasks();
        } catch (err) {
            console.error(err);
        }
    };

    const handleStatusToggle = async (task) => {
        const newStatus = task.status === 'Pending' ? 'Completed' : 'Pending';
        try {
            await axios.put(`http://localhost:5000/api/tasks/${task.id}`, { status: newStatus });
            fetchTasks();
        } catch (err) {
            console.error(err);
        }
    };

    const isOverdue = (date, status) => {
        return status === 'Pending' && new Date(date) < new Date();
    };

    const filteredTasks = tasks.filter(task => {
        if (filter === 'All') return true;
        if (filter === 'Overdue') return isOverdue(task.due_date, task.status);
        return task.status === filter;
    });

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1>Tasks</h1>
                    <p>Manage project tasks and status</p>
                </div>
                {user.role === 'admin' && (
                    <button onClick={() => { setEditTask(null); setFormData({ title: '', description: '', due_date: '', status: 'Pending' }); setShowModal(true); }} className="btn-primary btn-icon">
                        <Plus size={20} />
                        Add Task
                    </button>
                )}
            </div>

            <div className="filters">
                {['All', 'Pending', 'Completed', 'Overdue'].map(f => (
                    <button key={f} onClick={() => setFilter(f)} className={`filter-btn ${filter === f ? 'active' : ''}`}>
                        {f}
                    </button>
                ))}
            </div>

            <div className="tasks-list">
                {filteredTasks.map(task => (
                    <div key={task.id} className={`task-item ${isOverdue(task.due_date, task.status) ? 'overdue' : ''}`}>
                        <div className="task-main">
                            <button onClick={() => handleStatusToggle(task)} className={`status-toggle ${task.status === 'Completed' ? 'completed' : ''}`}>
                                <CheckCircle size={24} />
                            </button>
                            <div className="task-content">
                                <h3>{task.title}</h3>
                                <p>{task.description}</p>
                                <div className="task-meta">
                                    <span className="due-date">
                                        <Clock size={14} /> {new Date(task.due_date).toLocaleDateString()}
                                    </span>
                                    {isOverdue(task.due_date, task.status) && (
                                        <span className="overdue-badge"><AlertCircle size={14} /> Overdue</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="task-actions">
                            {user.role === 'admin' ? (
                                <>
                                    <button onClick={() => { setEditTask(task); setFormData(task); setShowModal(true); }} className="btn-icon-only"><Edit2 size={18} /></button>
                                    <button onClick={() => handleDelete(task.id)} className="btn-icon-only danger"><Trash2 size={18} /></button>
                                </>
                            ) : null}
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>{editTask ? 'Edit Task' : 'Add New Task'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label>Title</label>
                                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                            </div>
                            <div className="input-group">
                                <label>Description</label>
                                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
                            </div>
                            <div className="input-group">
                                <label>Due Date</label>
                                <input type="date" value={formData.due_date.split('T')[0]} onChange={(e) => setFormData({ ...formData, due_date: e.target.value })} required />
                            </div>
                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowModal(false)} className="btn-cancel">Cancel</button>
                                <button type="submit" className="btn-primary">{editTask ? 'Update' : 'Create'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TasksPage;
