import { IncomingMessage } from 'http';
import { ServerResponse } from '../types/main-types';

export const parseJson = (request: IncomingMessage, response: ServerResponse) => {
    response.writeHead(200, {
        'Content-type': 'application/json'
    })

    response.send = (data: any): any => {
        response.end(JSON.stringify(data));
    }
}