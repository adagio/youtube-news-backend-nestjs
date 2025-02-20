import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateYoutubeTables1740017421177 implements MigrationInterface {
    name = 'CreateYoutubeTables1740017421177'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "channels" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "channelId" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_d01dd8a8e614e01b6ee24664661" UNIQUE ("name"), CONSTRAINT "UQ_f41d20ad5f355605bde63265d66" UNIQUE ("channelId"), CONSTRAINT "PK_bc603823f3f741359c2339389f9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "videos" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" text NOT NULL, "videoId" character varying NOT NULL, "url" character varying NOT NULL, "uploadDate" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "channelId" integer, CONSTRAINT "UQ_e1153ef39ecefbe9228358863eb" UNIQUE ("videoId"), CONSTRAINT "PK_e4c86c0cf95aff16e9fb8220f6b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "videos" ADD CONSTRAINT "FK_16909a0ae1ace805503fe874dde" FOREIGN KEY ("channelId") REFERENCES "channels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "videos" DROP CONSTRAINT "FK_16909a0ae1ace805503fe874dde"`);
        await queryRunner.query(`DROP TABLE "videos"`);
        await queryRunner.query(`DROP TABLE "channels"`);
    }

}
