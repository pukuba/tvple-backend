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

@Entity("like")
export class LikeEntity {
    constructor(partial: Partial<LikeEntity>) {
        Object.assign(this, partial)
    }

    @PrimaryColumn({
        type: "varchar",
        length: 20,
        nullable: false,
        primary: true,
    })
    mediaId: string

    @PrimaryColumn({
        type: "varchar",
        length: 20,
        nullable: false,
        primary: true,
    })
    userId: string
}
