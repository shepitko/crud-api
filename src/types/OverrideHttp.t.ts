import http from 'http'

export interface ServerResponse extends http.ServerResponse {
	send: (data: any) => void;
	setStatusCode: (code: number) => void;
}


export interface IncomingMessage extends http.IncomingMessage {
	url: string;
	pathname: string;
	params:  {[key: string]: number | string};
}