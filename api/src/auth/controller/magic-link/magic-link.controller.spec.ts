import { Test, TestingModule } from "@nestjs/testing";

import { MagicLinkController } from "./magic-link.controller";

describe("MagicLinkController", () => {
	let controller: MagicLinkController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [MagicLinkController],
		}).compile();

		controller = module.get<MagicLinkController>(MagicLinkController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
