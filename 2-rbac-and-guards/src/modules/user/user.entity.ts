/**
 * Entity TypeORM — thuc the User.
 * (EN: TypeORM entity — User entity.)
 */
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from "typeorm"
import {
    Role,
} from "../../common/role.enum"

/** User cÃ³ `role` Ä‘á»ƒ RolesGuard Ä‘á»‘i chiáº¿u sau JwtAuthGuard. (EN: User row carrying RBAC role.) */
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

    /** Role string lÆ°u DB â€” khá»›p enum Role Ä‘á»ƒ nháº¥t quÃ¡n JWT payload (EN: persisted RBAC role). */
    @Column({
        type: "varchar",
        default: Role.USER,
    })
        role: Role
}
