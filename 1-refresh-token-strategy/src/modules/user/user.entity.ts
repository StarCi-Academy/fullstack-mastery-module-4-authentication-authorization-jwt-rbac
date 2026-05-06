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
 * User cÃ³ thÃªm `hashedRefreshToken` Ä‘á»ƒ bind phiÃªn refresh hiá»‡n táº¡i (rotation).
 * (EN: User stores bcrypt hash of active refresh JWT string.)
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

    @Column()
        password: string

    /**
     * Hash bcrypt cá»§a refresh JWT Ä‘ang hiá»‡u lá»±c â€” Ä‘á»•i sau má»—i láº§n rotate.
     * (EN: bcrypt hash of current refresh JWT; overwritten on rotation.)
     */
    @Column({
        type: "varchar",
        nullable: true,
    })
        refreshTokenHash: string | null
}
