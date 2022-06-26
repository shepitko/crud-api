import { IncomingMessage } from 'http';
import { ServerResponse } from '../../types/OverrideHttp.t';

export const parseJson = (request: IncomingMessage, response: ServerResponse): void => {
	response.setStatusCode = (code: number): void => {
		response.writeHead(code, {
			'Content-type': 'application/json',
		});
	};

	response.send = (data: any): any => {
		return response.end(JSON.stringify(data));
	};
};
