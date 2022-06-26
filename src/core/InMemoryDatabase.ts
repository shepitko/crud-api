import { v4 as newUuid } from 'uuid';

export class HttpError extends Error {
	errorCode: number;

	constructor(code: number, message?: string) {
		super(message);

		this.errorCode = code;
	}
}

export class InMemoryDatabase {
	protected db: any;
	type: string;
	requiredParams: string[];

	constructor() {
		this.db = {};
	}

	clearEntitiesData(entityType: any): void {
		this.db[entityType] = [];
	}

	clearAllData(): void {
		this.db = {};
	}

	workWith(entityType: string): this {
		this.type = entityType;
		this.db[this.type] = [];

		return this;
	}

	all(): any[] {
		return this.db[this.type];
	}

	findById(id: string | number): any {
		return this.db[this.type].find((ent: any) => ent.id === id);
	}

	create(params: any): any {
		const newEntity = { id: newUuid(), ...params };

		this.requiredParams.forEach((key) => {
			if (!Object.keys(params).includes(key)) throw new HttpError(400, 'Wrong params');
		});

		this.db[this.type].push(newEntity);

		return this.db[this.type][this.db[this.type].length - 1];
	}

	update(params: any): any {
		this.requiredParams.forEach((key) => {
			if (!Object.keys(params).includes(key)) throw new HttpError(400, 'Wrong params');
		});

		this.db[this.type] = this.db[this.type].map((item: any) => {
			if (item.id === params.id) return params;

			return item;
		});

		return this.db[this.type].find((ent: any) => ent.id === params.id);
	}

	delete(id: string | number): null {
		this.db[this.type] = this.db[this.type].filter((ent: { id: string }) => ent.id !== id);

		return null;
	}
}
