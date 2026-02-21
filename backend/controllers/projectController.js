const db = require('../config/db');

exports.createProject = async (req, res) => {
    const { project_name, description, due_date } = req.body;
    try {
        await db.query('INSERT INTO projects (project_name, description, due_date, created_by) VALUES (?, ?, ?, ?)',
            [project_name, description, due_date, req.user.id]);
        res.status(201).json({ message: 'Project created successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAllProjects = async (req, res) => {
    try {
        const [projects] = await db.query(`
            SELECT p.*, 
            (SELECT COUNT(*) FROM tasks WHERE project_id = p.id) as total_tasks,
            (SELECT COUNT(*) FROM tasks WHERE project_id = p.id AND status = 'Completed') as completed_tasks
            FROM projects p
        `);
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteProject = async (req, res) => {
    try {
        await db.query('DELETE FROM projects WHERE id = ?', [req.params.id]);
        res.json({ message: 'Project deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
