import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  ValidationOptions,
  IsPositive,
  IsNotEmpty,
  IsInt,
} from 'class-validator';

export function SejaPositivo(props?: ValidationOptions) {
  return IsPositive({
    message: '$property deve ser positivo(a)',
    ...(props ?? {}),
  });
}

export function SejaNaoVazio(props?: ValidationOptions) {
  return IsNotEmpty({
    message: '$property não pode ser vazio(a)',
    ...(props ?? {}),
  });
}

export function SejaInteiroPositivo(props?: ValidationOptions) {
  return applyDecorators(
    ApiProperty({ type: 'number', minimum: 1, required: false }),
    IsInt({ message: '$property deve ser um inteiro' }),
    SejaPositivo(props),
  );
}
