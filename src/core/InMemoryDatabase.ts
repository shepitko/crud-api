import { v4 as newUuid } from 'uuid';

export class InMemoryDatabase {
	protected db: any;
	protected entities: any;
	type: string;

	constructor() {
		this.db = {};
	}

	workWith(entityType: string) {
		this.type = entityType;
		this.db[entityType] = [];
		this.entities = this.db[entityType];

		return this;
	} 

	all() {
		return this.entities;
	}

	findById(id: string | number) {
		return this.entities.find((ent: {id: string}) => ent.id === id);
	}

	create(params: any)  {
		const newEntity = { id: newUuid(), ...params };

		this.entities.push(newEntity);

		return this.entities[this.entities.length - 1];
	}
	
	update(params: any)  {
		return this.entities = this.entities.map((item: any) => {
			if(item.id === params.id) return params;

			return item;
		});
	}

	delete(id: string | number): null  {
		this.entities = this.entities.filter((ent: { id: string }) => ent.id !== id);

		return null;
	}
}