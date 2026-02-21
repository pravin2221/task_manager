const db = require('../config/db');

exports.createTask = async (req, res) => {
    const { project_id, title, description, due_date } = req.body;
    try {
        await db.query('INSERT INTO tasks (project_id, title, description, due_date, created_by) VALUES (?, ?, ?, ?, ?)',
            [project_id, title, description, due_date, req.user.id]);
        res.status(201).json({ message: 'Task created successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getTasksByProject = async (req, res) => {
    try {
        const [tasks] = await db.query('SELECT * FROM tasks WHERE project_id = ?', [req.params.projectId]);
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateTask = async (req, res) => {
    const { title, description, due_date, status } = req.body;
    try {
        if (req.user.role === 'admin') {
            await db.query('UPDATE tasks SET title=?, description=?, due_date=?, status=? WHERE id=?',
                [title, description, due_date, status, req.params.id]);
        } else {
            // User can only update status
            await db.query('UPDATE tasks SET status=? WHERE id=?', [status, req.params.id]);
        }
        res.json({ message: 'Task updated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        await db.query('DELETE FROM tasks WHERE id = ?', [req.params.id]);
        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
