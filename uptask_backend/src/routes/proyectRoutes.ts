import { Router } from 'express';
import { body, param } from 'express-validator';
import { ProjectController } from '../controlers/ProjectControler';
import { handleInputErrors } from '../middleware/validation';
import { TaskController } from '../controlers/TaskControler';
import { ProjectExists } from '../middleware/project';
import { taskExists, taskBelongsToProject } from '../middleware/task';

const router = Router();

router.post('/', 
    body('projectName').notEmpty().withMessage('El Nombre del Proyecto es obligatorio'),
    body('clientName').notEmpty().withMessage('El Nombre del Cliente es obligatorio'),
    body('description').notEmpty().withMessage('La descripción del Proyecto es obligatoria'),
    handleInputErrors,


    
    ProjectController.createProject)

router.get('/', ProjectController.getAllProjects)

router.get('/:id', 
    param('id').isMongoId().withMessage('El ID del Proyecto no es válido'),
    handleInputErrors,
    ProjectController.getProjectByid)

router.put('/:id', 
    param('id').isMongoId().withMessage('El ID del Proyecto no es válido'),
    body('projectName').notEmpty().withMessage('El Nombre del Proyecto es obligatorio'),
    body('clientName').notEmpty().withMessage('El Nombre del Cliente es obligatorio'),
    body('description').notEmpty().withMessage('La descripción del Proyecto es obligatoria'),
    handleInputErrors,
    ProjectController.updateProject)

router.delete('/:id', 
    param('id').isMongoId().withMessage('El ID del Proyecto no es válido'),
    handleInputErrors,
    ProjectController.deleteProject
)

/** Routes for tasks */
router.param('projectId', ProjectExists)
router.param('taskId', taskExists)

router.post('/:projectId/tasks',
    body('name').notEmpty().withMessage('El Nombre de la Tarea es obligatorio'),
    body('description').notEmpty().withMessage('La descripción de la Tarea es obligatoria'),
    handleInputErrors,
    TaskController.createTask
)

router.get('/:projectId/tasks',
    TaskController.getProjectTasks
)

router.param('taskId', taskExists)
router.param('taskId', taskBelongsToProject)

router.get('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('El ID de la Tarea no es válido'),
    handleInputErrors,
    TaskController.getTaskById
)

router.put('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('El ID de la Tarea no es válido'),
    body('name').notEmpty().withMessage('El Nombre de la Tarea es obligatorio'),
    body('description').notEmpty().withMessage('La descripción de la Tarea es obligatoria'),
    handleInputErrors,
    TaskController.updateTask
)

router.delete('/:projectId/tasks/:taskId',
    param('taskId').isMongoId().withMessage('El ID de la Tarea no es válido'),
    handleInputErrors,
    TaskController.deleteTask
)

router.post('/:projectId/tasks/:taskId/status',
    param('taskId').isMongoId().withMessage('El ID de la Tarea no es válido'),
    body('status')
        .notEmpty().withMessage('El estado de la Tarea es obligatorio'),
    handleInputErrors,
    TaskController.updateStatus
)
export default router;