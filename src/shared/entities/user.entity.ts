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
    Index,
} from "typeorm"
import * as crypto from "bcryptjs"
import { MediaEntity } from "./media.entity"

@Entity("user")
export class UserEntity {
    constructor(partial: Partial<UserEntity>) {
        Object.assign(this, partial)
    }

    @Index({ unique: true })
    @PrimaryColumn({
        type: "varchar",
        length: 20,
        nullable: false,
    })
    id: string

    @Index({ unique: true })
    @PrimaryColumn({
        type: "varchar",
        length: 20,
        nullable: false,
    })
    username: string

    @Index({ unique: true })
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
        this.password = crypto.hashSync(this.password, crypto.genSaltSync(10))
        this.profileImage = ""
        this.biography = ""
        this.link = ""
        this.point = 0
    }
}
