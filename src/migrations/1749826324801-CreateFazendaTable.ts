import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFazendaTable1749825893872 implements MigrationInterface {
  name = 'CreateFazendaTable1749825893872';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "fazenda" (
        "id"                         UUID NOT NULL DEFAULT uuid_generate_v4(),
        "nome"                       CHARACTER VARYING(100) NOT NULL,
        "cidade"                     CHARACTER VARYING(100) NOT NULL,
        "estado"                     CHARACTER VARYING(100) NOT NULL,
        "area_total_hectares"        NUMERIC(10, 2) NOT NULL,
        "area_agricultavel_hectares" NUMERIC(10, 2) NOT NULL,
        "area_vegetacao_hectares"    NUMERIC(10, 2) NOT NULL,
        "produtor_id"                UUID NOT NULL,
        CONSTRAINT "PK_0528993051033f09ce373a4b809" PRIMARY KEY ("id")
      ) `);

    await queryRunner.query(`
      ALTER TABLE "fazenda"
        ADD CONSTRAINT "FK_7b70274d1e15b4c3d87f679cfdf" FOREIGN KEY ("produtor_id")
        REFERENCES "produtor"("id") ON DELETE no action ON UPDATE no action `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "fazenda" DROP CONSTRAINT "FK_7b70274d1e15b4c3d87f679cfdf"`,
    );
    await queryRunner.query(`DROP TABLE "fazenda"`);
  }
}
