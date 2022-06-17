import EventEmitter from 'events';
import { Router } from '../../core/Routes';
import { UserController } from './users-controller';

const router = new Router({emitter: new EventEmitter()})

export default router;