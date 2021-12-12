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
    JoinColumn,
    Index,
    OneToOne,
} from "typeorm"
import * as shortid from "shortid"
import { UserEntity } from "./user.entity"

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
        type: "varchar",
        length: 512,
        nullable: false,
    })
    url: string

    @Column({
        type: "varchar",
        length: 20,
        nullable: false,
    })
    userId: string

    @OneToOne(() => UserEntity)
    @JoinColumn({ referencedColumnName: "id" })
    user: UserEntity

    @Column({
        type: "varchar",
        length: 2000,
        nullable: false,
        default: "",
    })
    description: string

    @Index({ fulltext: true })
    @Column({
        type: "varchar",
        length: 80,
        nullable: false,
        default: "default title",
    })
    title: string

    @Column({
        type: "date",
        nullable: false,
    })
    date: Date

    @Column({
        type: "integer",
        nullable: false,
        default: 0,
    })
    likes: number

    @Column({
        type: "integer",
        nullable: false,
        default: 0,
    })
    views: number

    @BeforeInsert()
    beforeInsert() {
        this.mediaId = shortid.generate()
        this.date = new Date()
        this.views = 0
        this.likes = 0
    }
}
