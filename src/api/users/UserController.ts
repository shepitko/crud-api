import { Router } from '../../core/Routes';
import UserModel from '../../models/User';
import { ServerResponse, IncomingMessage } from '../../types/OverrideHttp.t';

export class UserController {
	user: UserModel;
	router: any;

	constructor(router: Router, model: UserModel) {
		this.user = model;
		this.router = router;
	}

	routes() {
		this.router.get('/users', this.getUsers);
		this.router.post('/users', this.createUser);
		this.router.get('/users/:id', this.getUserById);
		this.router.put('/users/:id', this.updateUser);
		this.router.delete('/users/:id', this.deleteUser);
	}
	
	getUsers =  async (request: IncomingMessage, response: ServerResponse) => {
		const users = this.user.methods.all();

		response.setStatusCode(200);
		response.send(users);
	}

	
	getUserById = async (request: IncomingMessage, response: ServerResponse) => {
		const user = this.user.methods.findById(request.params.id);

		response.setStatusCode(200);
		response.send(user);
	}

	
	createUser = (request: IncomingMessage, response: ServerResponse) => {
    	const user = this.user.methods.create(request.body);

		response.setStatusCode(201);
		response.send(user);
	}

	
	updateUser = (request: IncomingMessage, response: ServerResponse) => {
		const user = this.user.methods.update(request.params)

		response.setStatusCode(201);
		response.send(user);
	}
	
	deleteUser = (request: IncomingMessage, response: ServerResponse) => {
		const user = this.user.methods.delete(request.params.id)
    	response.end(user, 'utf-8');

		response.send(user);
	}
}
