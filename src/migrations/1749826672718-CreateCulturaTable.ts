import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCulturaTable1749826672718 implements MigrationInterface {
  name = 'CreateCulturaTable1749826672718';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "cultura" (
        "id"            UUID NOT NULL DEFAULT uuid_generate_v4(),
        "tipo_cultura"  CHARACTER VARYING NOT NULL,
        "area_hectares" NUMERIC(10, 2) NOT NULL,
        "safra_ano"     INTEGER NOT NULL,
        "data_plantio"  DATE NOT NULL,
        "data_colheita" DATE,
        "fazenda_id"    UUID NOT NULL,
        CONSTRAINT "PK_b222a9fa80157cef677c6962646" PRIMARY KEY ("id")
      ) `);
    await queryRunner.query(`
      ALTER TABLE "cultura"
        ADD CONSTRAINT "FK_40c300d083223b3d4d1bc8c8cb0" FOREIGN KEY ("fazenda_id")
        REFERENCES "fazenda"("id") ON DELETE no action ON UPDATE no action `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cultura" DROP CONSTRAINT "FK_40c300d083223b3d4d1bc8c8cb0"`,
    );
    await queryRunner.query(`DROP TABLE "cultura"`);
  }
}
