const express = require('express');
const router = express.Router();
const { createTask, getTasksByProject, updateTask, deleteTask } = require('../controllers/taskController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/project/:projectId', getTasksByProject);
router.post('/', roleMiddleware(['admin']), createTask);
router.put('/:id', updateTask); // Auth logic inside controller for role-based field updates
router.delete('/:id', roleMiddleware(['admin']), deleteTask);

module.exports = router;
