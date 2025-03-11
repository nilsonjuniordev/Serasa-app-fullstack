import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveCropsColumn1710165266123 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "producer" DROP COLUMN "crops"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "producer" ADD COLUMN "crops" text[] NOT NULL DEFAULT '{}'`);
    }
} 