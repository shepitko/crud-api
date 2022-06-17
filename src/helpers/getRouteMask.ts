export const getRouteMask = (method: string | undefined, path: string | undefined) => {
	console.log( `[${method}]:[${path}]`);
	return `[${method}]:[${path}]`;
}