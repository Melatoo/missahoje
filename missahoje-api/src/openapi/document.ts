import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

export function createOpenApiDocument(app: INestApplication): OpenAPIObject {
    const config = new DocumentBuilder()
        .setTitle('API Missa Hoje')
        .setDescription('Documentação da API do projeto Missa Hoje')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    return SwaggerModule.createDocument(app, config);
}
