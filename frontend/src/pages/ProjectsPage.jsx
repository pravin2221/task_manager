import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Calendar, Layout } from 'lucide-react';

const ProjectsPage = () => {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newProject, setNewProject] = useState({ project_name: '', description: '', due_date: '' });

    const fetchProjects = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/projects');
            setProjects(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/projects', newProject);
            setShowModal(false);
            setNewProject({ project_name: '', description: '', due_date: '' });
            fetchProjects();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/projects/${id}`);
            fetchProjects();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1>Projects</h1>
                    <p>Manage and track project progress</p>
                </div>
                {user.role === 'admin' && (
                    <button onClick={() => setShowModal(true)} className="btn-primary btn-icon">
                        <Plus size={20} />
                        New Project
                    </button>
                )}
            </div>

            <div className="projects-grid">
                {projects.map((project) => (
                    <div key={project.id} className="project-card">
                        <div className="project-card-header">
                            <Layout className="project-icon" />
                            {user.role === 'admin' && (
                                <button onClick={() => handleDelete(project.id)} className="btn-danger-link">
                                    <Trash2 size={18} />
                                </button>
                            )}
                        </div>
                        <h3>{project.project_name}</h3>
                        <p className="project-desc">{project.description}</p>

                        <div className="project-meta">
                            <div className="meta-item">
                                <Calendar size={14} />
                                <span>{new Date(project.due_date).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="progress-section">
                            <div className="progress-info">
                                <span>Progress</span>
                                <span>{project.total_tasks > 0 ? Math.round((project.completed_tasks / project.total_tasks) * 100) : 0}%</span>
                            </div>
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${project.total_tasks > 0 ? (project.completed_tasks / project.total_tasks) * 100 : 0}%` }}
                                ></div>
                            </div>
                        </div>

                        <Link to={`/projects/${project.id}/tasks`} className="btn-secondary">
                            View Tasks
                        </Link>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Create New Project</h2>
                        <form onSubmit={handleCreate}>
                            <div className="input-group">
                                <label>Project Name</label>
                                <input
                                    type="text"
                                    value={newProject.project_name}
                                    onChange={(e) => setNewProject({ ...newProject, project_name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label>Description</label>
                                <textarea
                                    value={newProject.description}
                                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label>Due Date</label>
                                <input
                                    type="date"
                                    value={newProject.due_date}
                                    onChange={(e) => setNewProject({ ...newProject, due_date: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowModal(false)} className="btn-cancel">Cancel</button>
                                <button type="submit" className="btn-primary">Create Project</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectsPage;
