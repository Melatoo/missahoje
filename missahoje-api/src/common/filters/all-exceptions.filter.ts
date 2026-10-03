import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status: HttpStatus =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const message =
            exception instanceof HttpException
                ? exception.getResponse()
                : 'Internal Server Error';

        // Log the actual error for debugging internally
        if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
            this.logger.error(
                `Status: ${status} Error: ${exception instanceof Error ? exception.message : JSON.stringify(exception)}`,
                exception instanceof Error ? exception.stack : undefined,
            );
        }

        const finalMessage =
            status === HttpStatus.INTERNAL_SERVER_ERROR
                ? 'Erro Interno no Servidor. Tente novamente mais tarde.'
                : (typeof message === 'object' &&
                      'message' in message &&
                      message.message) ||
                  message;

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: finalMessage,
        });
    }
}
