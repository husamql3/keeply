import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { RegisterDto } from "@/auth/dto/register.dto";
import { BcryptService } from "@/auth/service/bcrypt/bcrypt.service";
import { User } from "@/entity/user.entity";

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private readonly userRepo: Repository<User>,
		private readonly bcryptService: BcryptService,
	) {}

	async findUserByEmail(email: string): Promise<User | null> {
		return this.userRepo.findOne({ where: { email } });
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
