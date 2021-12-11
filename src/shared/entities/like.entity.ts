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
} from "typeorm"

@Entity("like")
@Unique(["userId", "mediaId"])
export class LikeEntity {
    constructor(partial: Partial<LikeEntity>) {
        Object.assign(this, partial)
    }

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
