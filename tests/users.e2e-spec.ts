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

afterAll(() => {
	application.close();
});