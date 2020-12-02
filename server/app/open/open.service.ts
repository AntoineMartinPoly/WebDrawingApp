import { Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { DB_ID_TAG } from '../mongo/constants';
import { MongoService } from '../mongo/mongo.service';
import Types from '../types';

@injectable()
export class OpenService {

    constructor(@inject(Types.MongoService) private mongo: MongoService) {}

    get routes(): Router {
        const router: Router = Router();

        router.get('/tag/get/drawing/:id', (req: Request, res: Response) => {
            this.mongo.getDrawing(DB_ID_TAG, req.params.id, res);
        });

        router.post('/tag/get/idByTag/:index', (req: Request, res: Response) => {
            this.mongo.getIdByTag(DB_ID_TAG, parseInt(req.params.index, 10), req.body, res);
        });

        router.post('/tag/get/next/:index', (req: Request, res: Response) => {
            this.mongo.isNext(DB_ID_TAG, parseInt(req.params.index, 10), req.body, res);
        });

        return router;
    }
}
