

export class InMemoryDatabase {
	entities: any;
	type: string;

	constructor() {
		this.entities = {};
	}

	workWith(entityType: string) {
		this.type = entityType;
		this.entities[entityType] = [];

		return this;
	} 

	all() {
		return this._entities();
	}

	findById(id: string) {
		return this._entities().find(id);
	}

	create(params: any)  {
		const entities = this._entities();
		entities.push(params);

		this._entities = entities;

		return params;
	}
	
	update(params: any)  {
		return this._entities().push(params);
	}

	delete(id: string): null  {
		return this._entities().filter((ent: any) => ent.id !== id);
	}

	private _entities() {
		return this.entities[this.type];
	}
}