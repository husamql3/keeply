import { ConflictException, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { RegisterDto } from "@/auth/dto/register.dto";
import { BcryptService } from "@/auth/service/bcrypt/bcrypt.service";
import { User } from "@/entity/user.entity";

@Injectable()
export class UserService {
	private readonly logger = new Logger(UserService.name);

	constructor(
		@InjectRepository(User)
		private readonly userRepo: Repository<User>,
		private readonly bcryptService: BcryptService,
	) {}

	async findUserByEmail(email: string): Promise<User | null> {
		this.logger.debug(`Finding user by email: ${email}`);
		const user = await this.userRepo.findOne({ where: { email } });
		if (user) {
			this.logger.debug(`User found: ${user.id}`);
		} else {
			this.logger.debug(`User not found for email: ${email}`);
		}
		return user;
	}

	async findUserById(id: string): Promise<User | null> {
		return this.userRepo.findOne({ where: { id } });
	}

	async create(userDto: RegisterDto): Promise<Omit<User, "password">> {
		const existing = await this.findUserByEmail(userDto.email);
		if (existing) {
			throw new ConflictException("Email already in use");
		}

		const hashed = await this.bcryptService.hash(userDto.password);
		const user = this.userRepo.create({
			name: userDto.name,
			email: userDto.email,
			password: hashed,
		});

		const saved = await this.userRepo.save(user);
		const { password: _password, ...userWithoutPassword } = saved;
		void _password;

		return userWithoutPassword;
	}
}
