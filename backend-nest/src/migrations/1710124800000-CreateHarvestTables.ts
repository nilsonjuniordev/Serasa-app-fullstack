import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateHarvestTables1710124800000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "harvest" (
                "id" SERIAL PRIMARY KEY,
                "year" integer NOT NULL,
                "producerId" integer,
                CONSTRAINT "FK_harvest_producer" FOREIGN KEY ("producerId") 
                REFERENCES "producer"("id") ON DELETE CASCADE
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "harvest_crop" (
                "id" SERIAL PRIMARY KEY,
                "cropName" varchar NOT NULL,
                "harvestId" integer,
                CONSTRAINT "FK_harvest_crop_harvest" FOREIGN KEY ("harvestId") 
                REFERENCES "harvest"("id") ON DELETE CASCADE
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "harvest_crop"`);
        await queryRunner.query(`DROP TABLE "harvest"`);
    }
} 