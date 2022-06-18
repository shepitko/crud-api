import EventEmitter from 'events';
import { getRouteMask } from '../helpers/getRouteMask';

export class Router {
	endpoints: any;
	emitter: EventEmitter;

	constructor({ emitter }: { emitter: EventEmitter }) {
		this.endpoints = {};
		this.emitter = emitter;
	}

	request(method = 'GET', path: string, handler: any): void {
		if (!this.endpoints[path]) {
			this.endpoints[path] = {};
		}

		const endpoint = this.endpoints[path];

		if (endpoint[method]) {
			throw new Error(`[${method}] with route ${path} has already exist`);
		}

		endpoint[method] = handler;

		this.emitter.on(getRouteMask(method, path), (req, res) => {
			const handler = endpoint[method];

			handler(req, res);
		});
	}

	get(path: string, handler: any): void {
		this.request('GET', path, handler);
	}

	post(path: string, handler: any): void {
		this.request('POST', path, handler);
	}

	put(path: string, handler: any): void {
		this.request('PUT', path, handler);
	}

	delete(path: string, handler: any): void {
		this.request('DELETE', path, handler);
	}
}
