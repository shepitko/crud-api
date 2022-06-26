import { validate as validateUuid } from 'uuid';
import { Router } from '../../core/Routes';
import UserModel from '../../models/User/User';
import { ServerResponse, IncomingMessage } from '../../types/OverrideHttp.t';

export class UserController {
	user: UserModel;
	router: Router;

	constructor(router: Router, model: UserModel) {
		this.user = model;
		this.router = router;
	}

	routes(): void {
		this.router.get('/api/users', this.getUsers);
		this.router.post('/api/users', this.createUser);
		this.router.get('/api/users/:id', this.getUserById);
		this.router.put('/api/users/:id', this.updateUser);
		this.router.delete('/api/users/:id', this.deleteUser);
	}

	getUsers = (request: IncomingMessage, response: ServerResponse): void => {
		const users = this.user.methods.all();

		response.setStatusCode(200);
		response.send(users);
	};

	getUserById = (request: IncomingMessage, response: ServerResponse): void => {
		if (!validateUuid(request.params.id?.toString())) {
			response.setStatusCode(400);
			response.send({ message: 'User Id is invalid' });
			return;
		}

		const user = this.user.methods.findById(request.params.id);

		if (!user) {
			response.setStatusCode(404);
			response.send({ message: 'User doesn`t exist' });
			return;
		} else {
			response.setStatusCode(200);
			response.send(user);
			return;
		}
	};

	createUser = (request: IncomingMessage, response: ServerResponse): any => {
		const user = this.user.methods.create(request.body);

		response.setStatusCode(201);
		response.send(user);
	};

	updateUser = (request: IncomingMessage, response: ServerResponse): void => {
		if (!validateUuid(request.params.id?.toString())) {
			response.setStatusCode(400);
			response.send({ message: 'User Id is invalid' });
			return;
		}

		if (!this.user.methods.findById(request.params.id)) {
			response.setStatusCode(404);
			response.send({ message: 'User doesn`t exist' });
			return;
		}

		const user = this.user.methods.update({ ...request.body, id: request.params.id });

		response.setStatusCode(200);
		response.send(user);
	};

	deleteUser = (request: IncomingMessage, response: ServerResponse): void => {
		if (!validateUuid(request.params.id?.toString())) {
			response.setStatusCode(400);
			response.send({ message: 'User Id is invalid' });
			return;
		}

		if (!this.user.methods.findById(request.params.id)) {
			response.setStatusCode(404);
			response.send({ message: 'User doesn`t exist' });
			return;
		}

		const user = this.user.methods.delete(request.params.id);

		response.setStatusCode(204);
		response.send(user);
	};
}
