import { InMemoryDatabase } from '../core/InMemoryDatabase';
import { User } from '../types/User.t';


export class UserDB extends InMemoryDatabase {
	methods: InMemoryDatabase;

	constructor() {
		super();

		this.methods = this.workWith('users');
	}
}