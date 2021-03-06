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
import {Routes} from '../routes';
import {SaveService} from '../save/save.service';
import {OpenService} from './open.service';

chai.use(chaiHttp);
chai.use(chaiSpies);

///////////////////////////
// TEST ARE NOT COMPLETE //
// REMOVE EXCLUDE DEC IN //
//     PACKAGE.JSON      //
///////////////////////////

describe('tag', () => {
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
        chai.spy.on(mongo, ['getDrawing', 'getIdByTag', 'isNext'], (parameters: any) => {
            parameters.response.status(200).send(JSON.stringify('hello'));
        });
    });

    afterEach(() => {
        chai.spy.restore(mongo, 'getDrawing');
        chai.spy.restore(mongo, 'getIdByTag');
        chai.spy.restore(mongo, 'isNext');
    });

    it('open should create', () => {
        expect(open);
    });

    [
        {endpoint: '/tag/get/drawing/:id', functionCalled: 'getDrawing', requestType: 'get'},
        {endpoint: '/tag/get/idByTag/:index', functionCalled: 'getIdByTag', requestType: 'post'},
        {endpoint: '/tag/get/next/:index', functionCalled: 'isNext', requestType: 'post'},
    ].forEach((testCase: {endpoint: string, functionCalled: string, requestType: string}) => {
        it(
            `${testCase.requestType} request at "${testCase.endpoint}" should call mongo.${testCase.functionCalled} function`,
            () =>
            chai.request(server)[testCase.requestType](testCase.endpoint)
                .then(() => {
                    expect(mongo[testCase.functionCalled]).to.have.been.called();
                }));
    });
});
