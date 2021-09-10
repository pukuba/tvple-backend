import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BeforeInsert,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryColumn,
    Table
} from "typeorm"
import * as argon2 from "argon2"

@Entity("user")
export class UserEntity {
    constructor(partial: Partial<UserEntity>) {
        Object.assign(this, partial)
    }

    @PrimaryColumn({
        type: "varchar",
        length: 20,
        nullable: false,
    })
    id: string

    @PrimaryColumn({
        type: "varchar",
        length: 20,
        nullable: false,
    })
    username: string

    @PrimaryColumn({
        type: "varchar",
        nullable: false,
        length: 14,
    })
    phoneNumber: string

    @Column({
        type: "binary",
        length: 128,
        nullable: false
    })
    password: string

    @BeforeInsert()
    async hashPassword() {
        this.password = await argon2.hash(this.password)
    }
}
