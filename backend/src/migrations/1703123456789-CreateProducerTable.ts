import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateProducerTable1703123456789 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "producer",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "name",
                        type: "varchar",
                    },
                    {
                        name: "document",
                        type: "varchar",
                        isUnique: true,
                    },
                    {
                        name: "farmName",
                        type: "varchar",
                    },
                    {
                        name: "city",
                        type: "varchar",
                    },
                    {
                        name: "state",
                        type: "varchar",
                    },
                    {
                        name: "totalArea",
                        type: "float",
                    },
                    {
                        name: "arableArea",
                        type: "float",
                    },
                    {
                        name: "vegetationArea",
                        type: "float",
                    },
                    {
                        name: "crops",
                        type: "varchar",
                        isArray: true,
                    },
                ],
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("producer");
    }
} 