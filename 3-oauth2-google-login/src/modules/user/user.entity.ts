/**
 * Entity TypeORM — thuc the User.
 * (EN: TypeORM entity — User entity.)
 */
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from "typeorm"

/**
 * User cÃ³ thá»ƒ chá»‰ tá»“n táº¡i qua OAuth â€” password cÃ³ thá»ƒ null.
 * (EN: Hybrid user row supporting OAuth-first accounts.)
 */
@Entity({
    name: "users",
})
export class User {
    @PrimaryGeneratedColumn()
        id: number

    @Column({
        unique: true,
    })
        email: string

    /** Null khi Ä‘Äƒng nháº­p chá»‰ qua Google â€” khÃ´ng cÃ³ credential password local. (EN: nullable password for OAuth-only.) */
    @Column({
        type: "varchar",
        nullable: true,
    })
        password: string | null

    /** Provider stable id Ä‘á»ƒ khá»›p account Google tÃ¡i Ä‘Äƒng nháº­p. (EN: Google subject identifier.) */
    @Column({
        type: "varchar",
        nullable: true,
        unique: true,
    })
        googleId: string | null

    @Column({
        type: "varchar",
        nullable: true,
    })
        firstName: string | null

    @Column({
        type: "varchar",
        nullable: true,
    })
        lastName: string | null

    @Column({
        type: "varchar",
        nullable: true,
    })
        picture: string | null
}
