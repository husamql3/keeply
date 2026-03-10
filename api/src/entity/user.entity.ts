import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("user")
export class User {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ nullable: true })
	name: string;

	@Column({ unique: true, nullable: false })
	email: string;

	@Column({ nullable: false })
	password: string;

	@Column()
	createdAt: Date;

	@Column()
	updatedAt: Date;
}
