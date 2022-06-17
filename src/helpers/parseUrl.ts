import { ServerResponse } from 'http';
import { IncomingMessage } from '../types/OverrideHttp.t';

export const parseUrl = (baseUrl: string) => (request: IncomingMessage, response: ServerResponse) =>  {
	const parsedUrl = new URL(request.url, baseUrl);
	const params:  {[key: string]: number | string} = {};

	const id = parsedUrl.pathname.split('/')[2];

	parsedUrl.searchParams.forEach((val, key) => params[key] = val);

	request.pathname = parsedUrl.pathname;
	request.params = params;
	if(id) request.params.id = id;;
}