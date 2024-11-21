import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAvatarTableUser1731134330745 implements MigrationInterface {
    name = 'AddAvatarTableUser1731134330745'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`avatar\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`avatar\``);
    }

}
