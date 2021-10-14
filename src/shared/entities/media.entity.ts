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
import * as shortid from "shortid"
import * as argon2 from "argon2"

@Entity("media")
export class MediaEntity {
    constructor(partial: Partial<MediaEntity>) {
        Object.assign(this, partial)
    }

    @PrimaryColumn({
        type: "varchar",
        length: 20,
        primary: true,
        nullable: false,
    })
    mediaId: string

    @Column({
        type: "text",
        nullable: false,
    })
    url: string

    @Column({
        type: "varchar",
        length: 20,
        nullable: false,
    })
    userId: string

    @Column({
        type: "varchar",
        length: 2000,
        nullable: false,
    })
    description: string

    @Column({
        type: "varchar",
        length: 80,
        nullable: false,
    })
    title: string

    @BeforeInsert()
    setId() {
        this.mediaId = shortid.generate()
    }
}
