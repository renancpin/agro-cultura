export interface DecimalColumnDefinitions {
  name?: string;
  type?: 'decimal';
  precision?: number;
  scale?: number;
  transformer?: { to: (_: any) => number; from: (_: any) => any };
}
export function DecimalType(
  options?: Partial<DecimalColumnDefinitions>,
): DecimalColumnDefinitions {
  const {
    name,
    type = 'decimal',
    precision = 10,
    scale = 2,
    transformer = { to: parseFloat, from: parseFloat },
  } = options ?? {};

  return {
    name,
    type,
    precision,
    scale,
    transformer,
  };
}
