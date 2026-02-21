const express = require('express');
const router = express.Router();
const { createProject, getAllProjects, deleteProject } = require('../controllers/projectController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', getAllProjects);
router.post('/', roleMiddleware(['admin']), createProject);
router.delete('/:id', roleMiddleware(['admin']), deleteProject);

module.exports = router;
