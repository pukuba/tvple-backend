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

@Entity("comment")
export class CommentEntity {
    constructor(partial: Partial<CommentEntity>) {
        Object.assign(this, partial)
    }

    @PrimaryGeneratedColumn("uuid")
    commentId: string

    @Column({
        type: "varchar",
        length: 20,
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
        type: "int",
        nullable: false,
    })
    posX: number

    @Column({
        type: "int",
        nullable: false,
    })
    posY: number
}
