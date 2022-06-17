
import { IncomingMessage } from 'http';
import { InMemoryDatabase } from '../../core/InMemoryDatabase';
import UserModel from '../../models/User';
import { ServerResponse } from '../../types/main-types';

export class UserController {
	user: UserModel;
	router: any;

	constructor(router: any) {
		this.user = new UserModel();
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

		response.send(users);
	}

	
	getUserById = async (request: IncomingMessage, response: ServerResponse) => {
		const id = 'test'
		const users = this.user.methods.findById(id);;

		response.send(users);
	}

	
	createUser = (request: IncomingMessage, response: ServerResponse) => {
    	const user = this.user.methods.create({ name: 'yurii' })
    	response.end(user, 'utf-8');

		response.send(user);
	}

	
	updateUser = (request: IncomingMessage, response: ServerResponse) => {
		const user = this.user.methods.update({ name: 'yurii' })
    	response.end(user, 'utf-8');

		response.send(user);
	}
	
	deleteUser = (request: IncomingMessage, response: ServerResponse) => {
		const user = this.user.methods.update({ name: 'yurii' })
    	response.end(user, 'utf-8');

		response.send(user);
	}


}
