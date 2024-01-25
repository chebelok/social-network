import { MigrationInterface, QueryRunner } from "typeorm";
import { config } from 'dotenv';
import { Role } from '../enums/role.enum';
import * as bcrypt from 'bcrypt';
config();


export class Admin1685614026446 implements MigrationInterface {
    name = 'Admin1685614026446'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const adminHashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 3);
        await queryRunner.query(`INSERT INTO "user" ("name", "email", "password", "role") VALUES ($1, $2, $3 , $4)`,
        [
        process.env.ADMIN_NAME,
        process.env.ADMIN_MAIL,
        adminHashedPassword,
        Role.admin,
        ]
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}

}
