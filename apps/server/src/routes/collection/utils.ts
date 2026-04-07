export function toSlug(name: string): string {
	return name
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");
}

export function generateSlug(name: string): string {
	const base = toSlug(name);
	const suffix = Math.random().toString(36).slice(2, 7);
	return `${base}-${suffix}`;
}
