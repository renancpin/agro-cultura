import { IsNotEmpty, IsPositive, ValidationOptions } from 'class-validator';

type PropertyValidationDecorator = (_?: ValidationOptions) => PropertyDecorator;

function sobrepoeOpcoesPadrao(
  decorator: PropertyValidationDecorator,
  propsToOverride?: ValidationOptions,
): PropertyValidationDecorator {
  return function (props?: ValidationOptions) {
    return decorator({ ...propsToOverride, ...props });
  };
}

export const SejaPositivo = sobrepoeOpcoesPadrao(IsPositive, {
  message: '$property deve ser positivo(a)',
});
export const SejaNaoVazio = sobrepoeOpcoesPadrao(IsNotEmpty, {
  message: '$property não pode ser vazio(a)',
});
