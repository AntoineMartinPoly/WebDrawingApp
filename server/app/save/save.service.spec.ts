import { expect } from 'chai';
// tslint:disable-next-line:no-duplicate-imports
import * as chai from 'chai';
// tslint:disable:no-require-imports
import chaiHttp = require('chai-http');
import chaiSpies = require('chai-spies');
// tslint:enable

import * as http from 'http';
import {Application} from '../app';
import { MongoService } from '../mongo/mongo.service';
import {OpenService} from '../open/open.service';
import {Routes} from '../routes';
import { SaveService } from './save.service';

chai.use(chaiHttp);
chai.use(chaiSpies);

///////////////////////////
// TEST ARE NOT COMPLETE //
// REMOVE EXCLUDE DEC IN //
//     PACKAGE.JSON      //
///////////////////////////

describe('save', () => {
    let mongo: MongoService;
    let save: SaveService;
    let open: OpenService;
    let app: Application;
    let server: http.Server;

    before(() => {
        mongo = new MongoService();
        save = new SaveService(mongo);
        open = new OpenService(mongo);
        app = new Application(new Routes(save, open));
        server = http.createServer(app.app);
    });

    beforeEach(() => {
        chai.spy.on(mongo, 'insert', (parameters: any) => {
            parameters.response.status(200).send(JSON.stringify('hello'));
        });
    });

    afterEach(() => {
        chai.spy.restore(mongo, 'insert');
    });

    it('save should create', () => {
        expect(save);
    });

    [
        '/save/drawing',
        '/save/id-tag',
    ].forEach((endpoint: string) => {
        it(`post request at "${endpoint}" should call mongo.insert function`, () =>
            chai.request(server).post(endpoint)
                .then(() => {
                    expect(mongo.insert).to.have.been.called();
                }));
    });
});
