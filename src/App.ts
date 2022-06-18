import { Server, createServer, IncomingMessage, ServerResponse } from 'http';
import { EventEmitter } from 'events';

import { Router } from './core/Routes';
import { UserController } from './api/users/UserController';
import { getRouteMask } from './helpers/getRouteMask';
import { parseJson } from './core/middlewares/parseJson';
import { parseUrl } from './core/middlewares/parseUrl';
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
	interface ServerResponse {
		setStatusCode: (code: number) => void;
		send: (data: any) => void;
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
		const userController = new UserController(router, userModel);

		this.middlewares = [];
		this.controllers = [userController];
		this.models = [userModel];
	}

	public clearAllData(): void {
		this.models.forEach((model: any) => model.clearData());
	}

	public init(): void {
		this.useRoutes();

		this.use(parseJson);
		this.use(parseUrl(process.env.BASE_URL || ''));

		this.server.listen(this.port, () => {
			console.info(`Server was started on PORT: ${process.env.PORT}`);
		});
	}

	public close(): void {
		this.server.close();
	}

	private useRoutes(): void {
		this.controllers.forEach((controller: any) => controller.routes());
	}

	private use(middleware: any): void {
		this.middlewares.push(middleware);
	}

	private _createServer(): Server {
		return createServer((request: IncomingMessage, response: ServerResponse) => {
			const body: any = [];

			request.on('data', (chunk) => {
				body.push(chunk);
			});

			request.on('end', () => {
				try {
					if (body.length) {
						request.body = JSON.parse(Buffer.concat(body).toString());
					}

					this.middlewares.forEach((middleware) => middleware(request, response));

					const emitted = this.emitter.emit(getRouteMask(request.method, request.url), request, response);

					if (!emitted) {
						response.setStatusCode(404);
						response.send({ message: 'This enpoint doesn`t exist.' });
					}
				} catch (e: any) {
					if ([400, 401, 404].includes(e.errorCode)) {
						response.setStatusCode(e.errorCode);
						response.send({ message: e.message });
					} else {
						response.setStatusCode(500);
						response.send({ message: 'Server Error: something went wrong' });
					}
				}
			});
		});
	}
}
