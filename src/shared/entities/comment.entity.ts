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
    Unique,
    JoinColumn,
    OneToOne,
    ManyToOne,
} from "typeorm"
import { UserEntity } from "./user.entity"
import { MediaEntity } from "./media.entity"

@Entity("comment")
export class CommentEntity {
    constructor(partial: Partial<CommentEntity>) {
        Object.assign(this, partial)
    }

    @ManyToOne(() => MediaEntity, { onDelete: "CASCADE" })
    @JoinColumn({ referencedColumnName: "mediaId", name: "mediaId" })
    media: MediaEntity

    @ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
    @JoinColumn({ referencedColumnName: "id", name: "userId" })
    user: UserEntity

    @PrimaryGeneratedColumn("uuid")
    commentId: string

    @Column({
        type: "varchar",
        length: 36,
        nullable: false,
    })
    mediaId: string

    @Column({
        type: "varchar",
        length: 20,
        nullable: false,
    })
    userId: string

    @Column({
        type: "varchar",
        length: 30,
        nullable: false,
        default: "",
    })
    content: string

    @Column({
        type: "float",
        nullable: false,
    })
    timeStamp: number

    @Column({
        type: "float",
        nullable: false,
    })
    posX: number

    @Column({
        type: "float",
        nullable: false,
    })
    posY: number

    @Column({
        type: "varchar",
        length: 7,
        nullable: false,
    })
    color: string
}
