import {Container} from 'inversify';
import {Application} from './app';
import {MongoService} from './mongo/mongo.service';
import {OpenService} from './open/open.service';
import {Routes} from './routes';
import {SaveService} from './save/save.service';
import {Server} from './server';
import Types from './types';

const container: Container = new Container();

container.bind(Types.Server).to(Server);
container.bind(Types.Application).to(Application);
container.bind(Types.MongoService).to(MongoService);
container.bind(Types.SaveService).to(SaveService);
container.bind(Types.TagService).to(OpenService);
container.bind(Types.Routes).to(Routes);

export {container};
