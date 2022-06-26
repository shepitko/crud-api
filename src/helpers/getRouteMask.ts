export const getRouteMask = (method: string | undefined, path: string | undefined): string => {
	const slashes = path?.split('/') || [];

	// For single entities
	if (slashes.length > 3) {
		return `[${method}]:[/${slashes[1]}/${slashes[2]}/:id]`;
	}

	return `[${method}]:[${path}]`;
};
