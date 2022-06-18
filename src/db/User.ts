import { InMemoryDatabase } from '../core/InMemoryDatabase';

export class UserDB extends InMemoryDatabase {
	methods: InMemoryDatabase;
	requiredParams: string[];

	constructor() {
		super();
		this.requiredParams = ['username', 'age', 'hobbies'];
		this.methods = this.workWith('users');
	}

	clearData(): void {
		this.clearEntitiesData('users');
	}
}
