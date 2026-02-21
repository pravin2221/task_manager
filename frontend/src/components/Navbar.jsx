import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FolderKanban, LogOut, User } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <nav className="navbar">
            <div className="nav-brand">
                <FolderKanban className="nav-logo" />
                <span>TaskManager</span>
            </div>
            <div className="nav-links">
                <Link to="/" className="nav-link">
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </Link>
                <Link to="/projects" className="nav-link">
                    <FolderKanban size={20} />
                    <span>Projects</span>
                </Link>
            </div>
            <div className="nav-user">
                <div className="user-info">
                    <User size={20} />
                    <span>{user.name}</span>
                    <span className="role-badge">{user.role}</span>
                </div>
                <button onClick={handleLogout} className="btn-logout">
                    <LogOut size={20} />
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
