import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRoleToTableUser1732087794647 implements MigrationInterface {
    name = 'AddRoleToTableUser1732087794647'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`roles\` varchar(255) NOT NULL DEFAULT 'User'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`roles\``);
    }

}
