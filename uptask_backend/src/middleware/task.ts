import type { Request, Response, NextFunction} from 'express'
import { ITask } from '../models/Task';
import Task from '../models/Task';

declare global {
    namespace Express {
        interface Request {
            task: ITask
        }
    }
}


export async function taskExists( req: Request, res: Response, next: NextFunction) {
    try {
        const { taskId } = req.params;
        const task = await Task.findById(taskId)
        if (!task) {
                const error = new Error('Tarea no encontrada');
                return res.status(404).json({error: error.message});
        }
        req.task = task
        next();
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Hubo error' })
    }
}

export function taskBelongsToProject( req: Request, res: Response, next: NextFunction ) {
    if(req.task.project.toString() !== req.project._id.toString()) {
                const error = new Error('Acción no permitida');
                return res.status(400).json({error: error.message});
            }
            next()
}
