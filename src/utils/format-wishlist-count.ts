const MILESTONES = [500, 250, 100, 50, 40, 30, 10, 5, 1] as const;

export function formatWaitlistCount(count: number): string | null {
	if (count <= 0) return null;
	for (const milestone of MILESTONES) {
		if (count >= milestone) {
			return `+${milestone}`;
		}
	}
	return null;
}
