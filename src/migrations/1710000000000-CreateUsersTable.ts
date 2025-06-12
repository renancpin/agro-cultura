import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1710000000000 implements MigrationInterface {
  name = 'CreateUsersTable1710000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id"        UUID NOT NULL DEFAULT uuid_generate_v4(),
        "name"      CHARACTER VARYING(100) NOT NULL,
        "username"  CHARACTER VARYING NOT NULL,
        "password"  CHARACTER VARYING NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"),
        CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
      )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
