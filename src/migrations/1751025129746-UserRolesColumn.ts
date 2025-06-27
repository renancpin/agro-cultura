import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserRolesColumn1751025129746 implements MigrationInterface {
  name = 'UserRolesColumn1751025129746';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
			ALTER TABLE "users"
			ADD "role" character varying NOT NULL DEFAULT 'user'
		`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
  }
}
