import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity("magic_link_tokens")
@Index(["email"])
export class MagicLinkToken {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ unique: true })
	tokenHash: string;

	@Column({ nullable: false })
	email: string;

	@Column({ default: false })
	used: boolean;

	@CreateDateColumn({ type: "timestamptz" })
	createdAt: Date;

	@Column({ type: "timestamptz", nullable: false })
	expiresAt: Date;
}
