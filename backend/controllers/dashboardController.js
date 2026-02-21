const db = require('../config/db');

exports.getAnalytics = async (req, res) => {
    try {
        const [[{ total_projects }]] = await db.query('SELECT COUNT(*) as total_projects FROM projects');
        const [[{ total_tasks }]] = await db.query('SELECT COUNT(*) as total_tasks FROM tasks');
        const [[{ completed_tasks }]] = await db.query("SELECT COUNT(*) as completed_tasks FROM tasks WHERE status = 'Completed'");
        const [[{ pending_tasks }]] = await db.query("SELECT COUNT(*) as pending_tasks FROM tasks WHERE status = 'Pending'");
        const [[{ overdue_tasks }]] = await db.query("SELECT COUNT(*) as overdue_tasks FROM tasks WHERE status = 'Pending' AND due_date < CURDATE()");

        res.json({
            total_projects,
            total_tasks,
            completed_tasks,
            pending_tasks,
            overdue_tasks
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
