export const getRouteMask = (method: string | undefined, path: string | undefined) => {
	const slashes = path?.split('/') || [];

	// For single entities
	if(slashes.length > 1)  return `[${method}]:[/${slashes[1]}/:id]`;
	
	return `[${method}]:[${path}]`;
}