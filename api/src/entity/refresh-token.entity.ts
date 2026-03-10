import {
	Column,
	Entity,
	Index,
	ManyToOne,
	JoinColumn,
	CreateDateColumn,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";

import { User } from "@/entity/user.entity";

@Entity("refresh_tokens")
@Index(["userId"])
export class RefreshToken {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ unique: true })
	tokenHash: string;

	@Column({ type: "uuid" })
	userId: string;

	@ManyToOne(() => User, { onDelete: "CASCADE" })
	@JoinColumn({ name: "userId" })
	user: User;

	@Column({ type: "timestamptz" })
	expiresAt: Date;

	@Column({ default: false })
	revoked: boolean;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
