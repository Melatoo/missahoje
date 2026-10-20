import { MigrationInterface, QueryRunner } from 'typeorm';

export class Inicial1792533867084 implements MigrationInterface {
    name = 'Inicial1792533867084';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "paroquias" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nome" character varying NOT NULL, "telefone" character varying, "site_ou_rede_social" character varying, "deleted_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_56e8b2c21546de1e473ff5b7635" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "horarios_missa" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "comunidade_id" uuid NOT NULL, "dia_semana" smallint NOT NULL, "horario" TIME NOT NULL, "observacao" character varying, "deleted_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7f61101f3a89afdaae2682d4e5b" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "comunidades" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "paroquia_id" uuid NOT NULL, "cidade_id" uuid, "nome" character varying NOT NULL, "endereco" character varying NOT NULL, "bairro" character varying NOT NULL, "link_google_maps" text, "deleted_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_49ab0b4b2acfc10d20c55d8c99d" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "cidades" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nome" character varying NOT NULL, "estado" character varying(2) NOT NULL, "slug" character varying NOT NULL, "latitude" double precision, "longitude" double precision, "deleted_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97f95ab80ddd941f0c53a1c4107" UNIQUE ("slug"), CONSTRAINT "PK_cc606d4fea4335e32bd19f3a9fa" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TYPE "public"."usuarios_role_enum" AS ENUM('admin', 'user')`,
        );
        await queryRunner.query(
            `CREATE TABLE "usuarios" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nome" character varying NOT NULL, "email" character varying NOT NULL, "senha" character varying NOT NULL, "role" "public"."usuarios_role_enum" NOT NULL DEFAULT 'user', "deleted_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "cidade_id" uuid, CONSTRAINT "UQ_446adfc18b35418aac32ae0b7b5" UNIQUE ("email"), CONSTRAINT "PK_d7281c63c176e152e4c531594a8" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `ALTER TABLE "horarios_missa" ADD CONSTRAINT "FK_bd58d86a372c2ebaee5c26bed6c" FOREIGN KEY ("comunidade_id") REFERENCES "comunidades"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "comunidades" ADD CONSTRAINT "FK_df366eda8fad36f458ab58cdcdd" FOREIGN KEY ("paroquia_id") REFERENCES "paroquias"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "comunidades" ADD CONSTRAINT "FK_4ec145386fa52aa4f3cd129c734" FOREIGN KEY ("cidade_id") REFERENCES "cidades"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "usuarios" ADD CONSTRAINT "FK_de5bb5b9866bdfb7345edbcffe9" FOREIGN KEY ("cidade_id") REFERENCES "cidades"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "usuarios" DROP CONSTRAINT "FK_de5bb5b9866bdfb7345edbcffe9"`,
        );
        await queryRunner.query(
            `ALTER TABLE "comunidades" DROP CONSTRAINT "FK_4ec145386fa52aa4f3cd129c734"`,
        );
        await queryRunner.query(
            `ALTER TABLE "comunidades" DROP CONSTRAINT "FK_df366eda8fad36f458ab58cdcdd"`,
        );
        await queryRunner.query(
            `ALTER TABLE "horarios_missa" DROP CONSTRAINT "FK_bd58d86a372c2ebaee5c26bed6c"`,
        );
        await queryRunner.query(`DROP TABLE "usuarios"`);
        await queryRunner.query(`DROP TYPE "public"."usuarios_role_enum"`);
        await queryRunner.query(`DROP TABLE "cidades"`);
        await queryRunner.query(`DROP TABLE "comunidades"`);
        await queryRunner.query(`DROP TABLE "horarios_missa"`);
        await queryRunner.query(`DROP TABLE "paroquias"`);
    }
}
