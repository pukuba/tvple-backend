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
} from "typeorm"
import { MediaEntity } from "./media.entity"

@Entity("like")
@Unique(["userId", "mediaId"])
export class LikeEntity {
    constructor(partial: Partial<LikeEntity>) {
        Object.assign(this, partial)
    }

    @OneToOne(() => MediaEntity, { onDelete: "CASCADE" })
    @JoinColumn({ referencedColumnName: "mediaId", name: "mediaId" })
    media: MediaEntity

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

    @PrimaryGeneratedColumn("uuid")
    id: string
}
