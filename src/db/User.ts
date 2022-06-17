import { InMemoryDatabase } from '../core/InMemoryDatabase';

export class UserDB extends InMemoryDatabase {
	methods: InMemoryDatabase;

	constructor() {
		super();

		this.methods = this.workWith('users');
	}

	clearData(): void {
		this.clearEntitiesData('users');
	}

}