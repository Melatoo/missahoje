import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        const status =
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
                : (message as any)?.message || message;

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: finalMessage,
        });
    }
}
