import { IncomingMessage } from 'http';
import { ServerResponse } from '../types/OverrideHttp.t';

export const parseJson = (request: IncomingMessage, response: ServerResponse) => {
    response.writeHead(200, {
        'Content-type': 'application/json'
    })

    response.setStatusCode = (code: number) =>  {
            response.writeHead(code, {
            'Content-type': 'application/json'
        })
    }

    response.send = (data: any): any => {
        response.end(JSON.stringify(data));
    }
}