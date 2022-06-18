import { boot } from '../src/main';
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
});

const newUser1: IUser = { username: 'Yurii', age: 31, hobbies: ['run', 'boardgames'] };
const newUser2: IUser = { username: 'Vanya', age: 25, hobbies: ['zabluditsya', 'trainings'] };
const wrongUser: any = { fullName: 'Vanya', age: 25, hobbies: 'none' };

describe('GET api/users', () => {
	it('should return code 200 and empty array', async () => {
		const res = await request(application.server).get('/api/users');

		expect(res.statusCode).toBe(200);
		expect(res.body.length).toBe(0);
	});

	it('should return code 200 and all users records', async () => {
		await request(application.server).post('/api/users').send(newUser1);
		await request(application.server).post('/api/users').send(newUser2);

		const res = await request(application.server).get('/api/users');

		expect(res.statusCode).toBe(200);
		expect(res.body.length).toBe(2);
	});
});

describe('GET api/users/:id', () => {
	it('should return code 200 and and record with id === userId', async () => {
		const userResp = await request(application.server).post('/api/users').send(newUser1);

		const res = await request(application.server).get(`/api/users/${userResp.body.id}`);

		expect(res.statusCode).toBe(200);
		expect(res.body.id).toBe(userResp.body.id);
	});

	it('should return code 400 and corresponding message if userId is invalid (not uuid)', async () => {
		const wrongId = '#$%21';
		const res = await request(application.server).get(`/api/users/${wrongId}`);

		expect(res.statusCode).toBe(400);
		expect(res.body.message).toBe('User Id is invalid');
	});

	it('should return code 404 and corresponding message if record with id === userId doesn`t exist', async () => {
		const randomUuid = 'bd86552c-ba7a-481e-909c-0cedcd515bf9';
		const res = await request(application.server).get(`/api/users/${randomUuid}`);

		expect(res.statusCode).toBe(404);
		expect(res.body.message).toBe('User doesn`t exist');
	});
});

describe('POST api/users', () => {
	it('should return code 201 and newly created record', async () => {
		const res = await request(application.server).post('/api/users').send(newUser1);

		expect(res.statusCode).toBe(201);
		expect(res.body.username).toBe(newUser1.username);
	});

	it('should return code 400 and corresponding message if request body does not contain required fields', async () => {
		const res = await request(application.server).post('/api/users').send(wrongUser);

		expect(res.statusCode).toBe(400);
		expect(res.body.message).toBe('Wrong params');
	});
});

describe('PUT api/users/:id', () => {
	it('should return code 200 and updated record', async () => {
		const user = await request(application.server).post('/api/users').send(newUser1);

		const updatedUser = await request(application.server).put(`/api/users/${user.body.id}`).send(newUser2);

		expect(updatedUser.statusCode).toBe(200);
		expect(updatedUser.body.id).toBe(user.body.id); // id didn't changed
		expect(updatedUser.body.username).toBe(newUser2.username); // data was updated
	});

	it('should return code 400 and corresponding message if userId is invalid (not uuid)', async () => {
		const wrongId = '#$%21';
		const updatedUser = await request(application.server).put(`/api/users/${wrongId}`).send(newUser2);

		expect(updatedUser.statusCode).toBe(400);
		expect(updatedUser.body.message).toBe('User Id is invalid'); // data was updated
	});

	it('should return code 400 and corresponding message if wrong params', async () => {
		const user = await request(application.server).post('/api/users').send(newUser1);

		const updatedUser = await request(application.server).put(`/api/users/${user.body.id}`).send(wrongUser);

		expect(updatedUser.statusCode).toBe(400);
		expect(updatedUser.body.message).toBe('Wrong params');
	});

	it('should return code 404 and corresponding message if record with id === userId doesn`t exist', async () => {
		const randomUuid = 'bd86552c-ba7a-481e-909c-0cedcd515bf9';
		const updatedUser = await request(application.server).put(`/api/users/${randomUuid}`).send(newUser1);

		expect(updatedUser.statusCode).toBe(404);
		expect(updatedUser.body.message).toBe('User doesn`t exist');
	});
});

describe('DELETE api/users/:id', () => {
	it('should return code 204 if the record is found and deleted', async () => {
		const user = await request(application.server).post('/api/users').send(newUser1);

		const deletedUser = await request(application.server).delete(`/api/users/${user.body.id}`);

		expect(deletedUser.statusCode).toBe(204);
		expect(deletedUser.body).toBe('');
	});

	it('should return code 400 and corresponding message if userId is invalid (not uuid)', async () => {
		const wrongId = '#$%21';

		const deletedUser = await request(application.server).delete(`/api/users/${wrongId}`);

		expect(deletedUser.statusCode).toBe(400);
		expect(deletedUser.body.message).toBe('User Id is invalid');
	});

	it('should answer with status code 404 and corresponding message if record with id === userId doesn`t exist', async () => {
		const randomUuid = 'bd86552c-ba7a-481e-909c-0cedcd515bf9';

		const deletedUser = await request(application.server).delete(`/api/users/${randomUuid}`);

		expect(deletedUser.statusCode).toBe(404);
		expect(deletedUser.body.message).toBe('User doesn`t exist');
	});
});

describe('Failed reponse', () => {
	it('should return code 404 with msg resource not found', async () => {
		// try to get wrong endpoint
		const res = await request(application.server).get('/api/ssgg');

		expect(res.statusCode).toBe(404);
		expect(res.body.message).toBe('This enpoint doesn`t exist.');
	});

	it('should return code 500 if something happened in code', async () => {
		// try to create new obj without any data
		const res = await request(application.server).post('/api/users');

		expect(res.statusCode).toBe(500);
		expect(res.body.message).toBe('Server Error: something went wrong');
	});
});

afterAll(() => {
	application.close();
});
