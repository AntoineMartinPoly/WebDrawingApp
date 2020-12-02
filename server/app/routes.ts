import { Router } from 'express';
import { inject, injectable } from 'inversify';
import { OpenService } from './open/open.service';
import { SaveService } from './save/save.service';
import Types from './types';

@injectable()
export class Routes {

    constructor(@inject(Types.SaveService) private save: SaveService,
                @inject(Types.TagService) private open: OpenService) {}

    get routes(): Router {

        const router: Router = Router();
        router.use(this.save.routes);
        router.use(this.open.routes);

        return router;
    }
}
