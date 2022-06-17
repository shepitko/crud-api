import { boot } from '..';
import { App } from '../src/App';
import request from 'supertest';
import { IUser } from '../src/types/User.t';

let application: App;

beforeAll(async () => {
	const { app } = boot;
	application = app;
});

afterEach(async () => {
	application.clearAllData();
})

const newUser1:IUser = {name: 'Yurii', age: 31, hobbies: ['run', 'boardgames']};
const newUser2:IUser = {name: 'Vanya', age: 25, hobbies: ['zabluditsya', 'on trainings']};

describe('GET api/users', () => {
	it('db is empty', async () => {

		const res = await request(application.server)
			.get('/users');

		expect(res.statusCode).toBe(200);
		expect(res.body.length).toBe(0);
	});

	
	it('get all users', async () => {
		await request(application.server).post('/users').send(newUser1);
		await request(application.server).post('/users').send(newUser2);

		const res = await request(application.server)
			.get('/users');

		expect(res.statusCode).toBe(200);
		expect(res.body.length).toBe(2);
	});
});

describe('GET api/users/:id', () => {
	it.todo('get user by id');

	it.todo('user doesn`t found');
});


describe('POST api/users', () => {
	it.todo('create new user');

	it.todo('create new user with wrong params');
});

describe('PUT api/users/:id', () => {
	it.todo('update existed user');
	
	it.todo('update non-existed user');
	
	it.todo('update existed user with wrong params');
});


describe('DELETE api/users/:id', () => {
	it.todo('delete existed user');
	
	it.todo('delete non-existed user');
});

afterAll(() => {
	application.close();
});