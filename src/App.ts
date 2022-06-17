import { Server, createServer, IncomingMessage, ServerResponse } from 'http'
import { EventEmitter } from 'events';

import { InMemoryDatabase } from './core/InMemoryDatabase';
import { Router } from './core/Routes';
import { UserController } from './api/users/users-controller';
import { getRouteMask } from './helpers/getRouteMask';
import { parseJson } from './helpers/parseJson';

// enpoint = {
//   '/users': {
//      'GET': handler
//    }
// }

export class App {
	db: InMemoryDatabase;
	router: Router;
	server: Server;
	emitter: EventEmitter;
	port: number | string;
	middlewares: any[];

	constructor() {
		this.emitter = new EventEmitter();
		this.port = process.env.PORT || 6677;
		this.server = this._createServer();
		this.router = new Router({ emitter: this.emitter });
		this.middlewares = [];
	}

    useRoutes() {;
		new UserController(this.router).routes();
    }

	init() {
		this.useRoutes();
		
		this.use(parseJson);
		// this.use(parseUrl('http://localhost:6677'));

		this.server.listen(this.port, () => {
			console.info(`Server was started on PORT: ${process.env.PORT}`);
		});
	}
	
 	use(middleware: any) {
        this.middlewares.push(middleware);
    }

	private _createServer() {
		return createServer((request: IncomingMessage, response: ServerResponse) => {
			let body: any = [];

            request.on('data', (chunk) => {
               body.push(chunk);
            })

            request.on('end', () => {
				try{
                if(body.length) {
                    body = Buffer.concat(body).toString();
					console.log('1', body)
                }
					this.middlewares.forEach(middleware => middleware(request, response))

					const emitted = this.emitter.emit(getRouteMask(request.method, request.url), request, response)
					if (!emitted) {
						response.end()
                	}
				
				} catch (e: any) {
					console.error(e.message);
				}
            })
		})
	}  
}
