import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProdutorTable1749825486096 implements MigrationInterface {
  name = 'CreateProdutorTable1749825486096';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "produtor" (
        "id"          UUID NOT NULL DEFAULT uuid_generate_v4(),
        "nome"        CHARACTER VARYING(100) NOT NULL,
        "cpf_ou_cnpj" CHARACTER VARYING NOT NULL,
        "created_at"  TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at"  TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_5283a5b710d82ad3d6fa6c2589e" UNIQUE ("cpf_ou_cnpj"),
        CONSTRAINT "PK_da0beeee09664030b67354e41e2" PRIMARY KEY ("id")
      )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "produtor"`);
  }
}
