import { expect } from 'chai';
import { Application } from './app';
import { container } from './inversify.config';
import { MongoService } from './mongo/mongo.service';
import { OpenService } from './open/open.service';
import { Routes } from './routes';
import { SaveService } from './save/save.service';

const mongo: MongoService = new MongoService();
const save: SaveService = new SaveService(mongo);
const open: OpenService = new OpenService(mongo);
const route: Routes = new Routes(save, open);
const app: Application = new Application(route);

describe('app', () => {
    it('app should create', () => {
        expect(app);
    });
});

describe('route', () => {
    it('route should create', () => {
        expect(route);
    });
});

describe('inversify.config', () => {
    it('inversify.config should create', () => {
        expect(container);
    });
});
