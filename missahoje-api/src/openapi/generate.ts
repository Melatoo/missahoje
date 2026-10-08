import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { createOpenApiDocument } from './document';

async function generate() {
    const app = await NestFactory.create(AppModule, {
        preview: true,
        logger: false,
    });
    const document = createOpenApiDocument(app);
    const output = resolve(process.cwd(), 'openapi.json');
    writeFileSync(output, `${JSON.stringify(document, null, 2)}\n`);
    await app.close();
}

void generate();
