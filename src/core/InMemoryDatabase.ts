import { v4 as newUuid } from 'uuid';

export class InMemoryDatabase {
	protected db:any;
	type: string;

	constructor() {
		this.db = {};
	}

	clearEntitiesData(entityType: any):void {
		this.db[entityType] = [];
	}

	clearAllData():void {
		this.db = {};
	}

	workWith(entityType: string) {
		this.type = entityType;
		this.db[this.type] = [];

		return this;
	} 

	all() {
		return this.db[this.type];
	}

	findById(id: string | number) {
		return this.db[this.type].find((ent: {id: string}) => ent.id === id);
	}

	create(params: any)  {
		const newEntity = { id: newUuid(), ...params };

		this.db[this.type].push(newEntity);

		return this.db[this.type][this.db[this.type].length - 1];
	}
	
	update(params: any)  {
		return this.db[this.type] = this.db[this.type].map((item: any) => {
			if(item.id === params.id) return params;

			return item;
		});
	}

	delete(id: string | number): null  {
		this.db[this.type] = this.db[this.type].filter((ent: { id: string }) => ent.id !== id);

		return null;
	}
}