import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum Role {
	USER = "user",
	ADMIN = "admin",
	SUPER_ADMIN = "super_admin",
}

export const ROLES = Object.values(Role);

@Entity("user")
export class User {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ nullable: true })
	name: string | null;

	@Column({ unique: true, nullable: false })
	email: string;

	@Column({ nullable: true })
	password: string;

	@Column({ type: "enum", enum: Role, default: Role.USER })
	role: Role;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
