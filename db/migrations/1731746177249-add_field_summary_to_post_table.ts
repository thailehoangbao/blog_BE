import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldSummaryToPostTable1731746177249 implements MigrationInterface {
    name = 'AddFieldSummaryToPostTable1731746177249'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` ADD \`summary\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`summary\``);
    }

}
