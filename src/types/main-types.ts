import http from 'http'

export interface ServerResponse extends http.ServerResponse {
	send: (data:any) => void;
}
