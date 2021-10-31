import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BeforeInsert,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryColumn,
    Table,
} from "typeorm"
import * as crypto from "bcryptjs"

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
        type: "varchar",
        length: 512,
        nullable: false,
    })
    password: string

    @BeforeInsert()
    hashPassword() {
        this.password = crypto.hashSync(this.password, crypto.genSaltSync(10))
    }

    @Column({
        type: "text",
        nullable: false,
    })
    link: string

    @Column({
        type: "text",
        nullable: false,
    })
    profileImage: string

    @Column({
        type: "text",
        nullable: false,
    })
    biography: string

    @Column({
        type: "integer",
        nullable: false,
    })
    point: number

    @BeforeInsert()
    fillDeafults() {
        this.profileImage = ""
        this.biography = ""
        this.link = ""
        this.point = 0
    }
}
