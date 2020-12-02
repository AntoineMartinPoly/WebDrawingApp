import { expect } from 'chai';
import { MongoService } from './mongo.service';

const mongo: MongoService = new MongoService();

///////////////////////////
// TEST ARE NOT COMPLETE //
// REMOVE EXCLUDE DEC IN //
//     PACKAGE.JSON      //
///////////////////////////

describe('mongo', () => {
    it('mongo should create', () => {
        expect(mongo);
    });
});
