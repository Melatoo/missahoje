import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { SwaggerModule } from '@nestjs/swagger';
import { createOpenApiDocument } from './openapi/document';
import { corsOptions } from './common/config/cors.config';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.set('trust proxy', 1);

    app.use(helmet());
    const config = app.get(ConfigService);
    app.enableCors(corsOptions((nome) => config.get<string>(nome)));

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    app.useGlobalInterceptors(
        new ClassSerializerInterceptor(app.get(Reflector)),
    );
    app.useGlobalFilters(new AllExceptionsFilter());

    SwaggerModule.setup('api-docs', app, createOpenApiDocument(app));

    await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
