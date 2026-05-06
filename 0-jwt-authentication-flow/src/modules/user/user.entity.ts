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
 * Báº£ng ngÆ°á»i dÃ¹ng credential-based â€” password luÃ´n lÃ  bcrypt hash trong DB.
 * (EN: Credential user entity storing bcrypt hash only.)
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

    /** Hash bcrypt cá»§a password â€” khÃ´ng lÆ°u plaintext (EN: bcrypt digest column). */
    @Column()
        password: string
}
