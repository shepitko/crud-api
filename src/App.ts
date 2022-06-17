import { Server, createServer, IncomingMessage, ServerResponse } from 'http'
import { EventEmitter } from 'events';

import { Router } from './core/Routes';
import { UserController } from './api/users/UserController';
import { getRouteMask } from './helpers/getRouteMask';
import { parseJson } from './helpers/parseJson';
import { parseUrl } from './helpers/parseUrl';
import UserModel from './models/User';

// enpoint = {
//   '/users': {
//      'GET': handler
//    }
// }

declare module 'http' {
    interface IncomingMessage {
        body: any;
    }
}

export class App {
	port: number | string;
	server: Server;
	emitter: EventEmitter;

	middlewares: any[];
	controllers: any[];
	models: any[];

	constructor() {
		this.port = process.env.PORT || 6677;
		this.server = this._createServer();
		this.emitter = new EventEmitter();

		const router = new Router({ emitter: this.emitter });
		const userModel = new UserModel();
		const userController = new UserController(router, userModel)

		this.middlewares = [];
		this.controllers = [userController];
		this.models = [userModel];
	}

    public clearAllData() {;
		this.models.forEach((model:any) => model.clearData());
    }

	public init() {
		this.useRoutes();
		
		this.use(parseJson);
		this.use(parseUrl(process.env.BASE_URL || ''));

		this.server.listen(this.port, () => {
			console.info(`Server was started on PORT: ${process.env.PORT}`);
		});
	}

	public resetData(): void {
		
	}

	public close(): void {
		this.server.close();
	}


    private useRoutes() {;
		this.controllers.forEach((controller:any) => controller.routes());
    }

 	private use(middleware: any) {
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
						request.body = JSON.parse(Buffer.concat(body).toString());
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
