import { Response } from 'express';
import {injectable} from 'inversify';
import { Collection, MongoClient, MongoError } from 'mongodb';
import 'reflect-metadata';
import { DB_NAME, DB_URL } from './constants';

@injectable()
export class MongoService {

    // security to implement
    insert(collection: string, value: any, response: Response) {
        MongoClient.connect(DB_URL, {useUnifiedTopology: true, useNewUrlParser : true}, (err: MongoError, client: MongoClient): void => {
            const polydessin: Collection = client.db(DB_NAME).collection(collection);
            polydessin.insertOne(value, () => {
                response.send(JSON.stringify(value._id));
            });
            client.close();
        });
    }

    getIdByTag(collection: string, index: number, tagTable: string[], response: Response) {
        MongoClient.connect(DB_URL, {useUnifiedTopology: true, useNewUrlParser : true}, (err: MongoError, client: MongoClient): void => {
            const polydessin: Collection = client.db(DB_NAME).collection(collection);
            polydessin.find(tagTable.length !== 0 ? {tags: {$all: tagTable}} : {})
            .skip(index * 8).limit(8).toArray((error: MongoError, res: any) => {
                response.send(res);
            });
            client.close();
        });
    }

    isNext(collection: string, index: number, tagTable: string[], response: Response) {
        MongoClient.connect(DB_URL, {useUnifiedTopology: true, useNewUrlParser : true}, (err: MongoError, client: MongoClient): void => {
            const polydessin: Collection = client.db(DB_NAME).collection(collection);
            polydessin.find(tagTable.length !== 0 ? {tags: {$all: tagTable}} : {})
            .skip(index * 8).limit(9).count(true, (error: MongoError, result: number) => {
                response.send(result === 9);
            });
            client.close();
        });
    }

    getDrawing(collection: string, id: string, response: Response) {
        MongoClient.connect(DB_URL, {useUnifiedTopology: true, useNewUrlParser : true}, (err: MongoError, client: MongoClient): void => {
            const polydessin: Collection = client.db(DB_NAME).collection(collection);
            polydessin.findOne({ _id: id }, (error: MongoError, res: any) => {
                response.send(res);
            });
            client.close();
        });
    }

}
