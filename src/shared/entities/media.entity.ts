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
    ManyToOne,
} from "typeorm"
import * as shortid from "shortid"
import { UserEntity } from "./user.entity"

@Entity("media")
export class MediaEntity {
    constructor(partial: Partial<MediaEntity>) {
        Object.assign(this, partial)
    }

    @PrimaryGeneratedColumn("uuid")
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

    @ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
    @JoinColumn({ referencedColumnName: "id", name: "userId" })
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
