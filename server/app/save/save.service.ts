import { Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { DB_DRAWING, DB_ID_TAG } from '../mongo/constants';
import { MongoService } from '../mongo/mongo.service';
import Types from '../types';

@injectable()
export class SaveService {

constructor(@inject(Types.MongoService) private mongo: MongoService) {}

get routes(): Router {
    const router: Router = Router();

    router.post('/save/drawing', (req: Request, res: Response) => {
        this.mongo.insert(DB_DRAWING, req.body, res);
    });

    router.post('/save/id-tag', (req: Request, res: Response) => {
        this.mongo.insert(DB_ID_TAG, req.body, res);
    });

    return router;
}

}
