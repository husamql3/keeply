import { Elysia } from "elysia";

const colors = {
	reset: "\x1b[0m",
	dim: "\x1b[2m",
	cyan: "\x1b[36m",
	green: "\x1b[32m",
	yellow: "\x1b[33m",
	red: "\x1b[31m",
	blue: "\x1b[34m",
	magenta: "\x1b[35m",
};

const getMethodColor = (method: string) => {
	switch (method) {
		case "GET":
			return colors.cyan;
		case "POST":
			return colors.green;
		case "PUT":
		case "PATCH":
			return colors.yellow;
		case "DELETE":
			return colors.red;
		default:
			return colors.blue;
	}
};

const getStatusColor = (status: number) => {
	if (status >= 500) return colors.red;
	if (status >= 400) return colors.yellow;
	if (status >= 300) return colors.cyan;
	if (status >= 200) return colors.green;
	return colors.reset;
};

export const logger = new Elysia({ name: "logger" })
	.derive({ as: "global" }, () => ({ startTime: Date.now() }))
	.onRequest(({ request }) => {
		const url = new URL(request.url);
		const methodColor = getMethodColor(request.method);
		console.log(
			`${colors.dim}[${new Date().toISOString()}]${colors.reset} ${colors.blue}→${colors.reset} ${methodColor}${request.method}${colors.reset} ${colors.dim}${url.pathname}${colors.reset}`,
		);
	})
	.onAfterResponse(({ request, set, startTime }) => {
		const url = new URL(request.url);
		const elapsed = Date.now() - startTime;
		const status = Number(set.status);
		const methodColor = getMethodColor(request.method);
		const statusColor = getStatusColor(status);
		const timeColor = elapsed > 1000 ? colors.red : elapsed > 500 ? colors.yellow : colors.green;

		console.log(
			`${colors.dim}[${new Date().toISOString()}]${colors.reset} ${colors.magenta}←${colors.reset} ${methodColor}${request.method}${colors.reset} ${colors.dim}${url.pathname}${colors.reset} ${statusColor}${status}${colors.reset} ${timeColor}${elapsed}ms${colors.reset}`,
		);
	});
