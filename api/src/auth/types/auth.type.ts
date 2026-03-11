import { Role } from "@/entity/user.entity";

export interface JwtSign {
	access_token: string;
	refresh_token: string;
}

export interface Payload {
	sub: string;
	name: string;
	role: Role;
}
