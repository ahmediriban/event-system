import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ZodSchema, ZodError } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      if (error instanceof ZodError) {
        // Format Zod validation errors into a readable message
        const errorMessages = error.errors.map(err => {
          const field = err.path.join('.');
          return `${field}: ${err.message}`;
        });
        
        throw new BadRequestException({
          message: errorMessages,
          error: 'Validation failed',
          statusCode: 400
        });
      }
      throw new BadRequestException('Validation failed');
    }
  }
} 