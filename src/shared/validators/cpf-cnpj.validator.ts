export const TAMANHO_CPF = 11;
export const PESO_MAX_CPF = 11;

export const TAMANHO_CNPJ = 14;
export const PESO_MAX_CNPJ = 9;

export const PESO_MIN = 2;

export const VALOR_OFFSET_ASCII = 48;
export const NUMERO_DIGITOS_VERIFICADORES = 2;

export type CpfCnpjVerificado =
  | {
      isValid: true;
      originalValue: string;
      strippedCpfCnpj: string;
      maskedCpfCnpj: string;
    }
  | { isValid: false; originalValue: string };

export function validaCpfCnpj(document: string): CpfCnpjVerificado {
  const documentoLimpo = limpaCaracteres(document);
  const pesoMaximo =
    documentoLimpo.length <= TAMANHO_CPF ? PESO_MAX_CPF : PESO_MAX_CNPJ;

  const caracteres = documentoLimpo
    .split('')
    .slice(0, -NUMERO_DIGITOS_VERIFICADORES);
  const valoresNumericos = converteParaNumericos(caracteres);

  for (let i = 0; i < NUMERO_DIGITOS_VERIFICADORES; i++) {
    const soma = somaComPesos(valoresNumericos, { pesoMaximo });
    const digitoVerificador = modulo11(soma);
    valoresNumericos.push(digitoVerificador);
  }

  const resultadoProcessado = String.fromCharCode(
    ...valoresNumericos.map((value) => value + VALOR_OFFSET_ASCII),
  );

  const isValid = resultadoProcessado === documentoLimpo;
  if (!isValid) {
    return {
      isValid: false,
      originalValue: documentoLimpo,
    };
  }

  const result = {
    isValid: true,
    originalValue: documentoLimpo,
    strippedCpfCnpj: resultadoProcessado,
    maskedCpfCnpj: mascaraCpfCnpj(resultadoProcessado),
  };

  return result;
}

export function mascaraCpfCnpj(text: string): string {
  if (text.length <= 11) {
    return text.replace(/(.{3})(.{3})(.{3})(.+)/, '$1.$2.$3-$4');
  }

  return text.replace(/(.{2})(.{3})(.{3})(.{4})(.+)/, '$1.$2.$3/$4-$5');
}

function limpaCaracteres(text: string): string {
  const strippedText = text.replace(/[^0-9a-z]/gi, '').toUpperCase();
  const length =
    strippedText.length <= TAMANHO_CPF ? PESO_MAX_CPF : PESO_MAX_CNPJ;

  const result = strippedText.padStart(length, '0');
  return result;
}

function modulo11(sum: number) {
  const mod = sum % 11;
  const result = 11 - mod;

  if (result >= 10) return 0;

  return result;
}

function converteParaNumericos(characters: string[]): number[] {
  const numericValues: number[] = characters.map(
    (char) => char.charCodeAt(0) - VALOR_OFFSET_ASCII,
  );

  return numericValues;
}

function somaComPesos(
  values: number[],
  opts?: { pesoMinimo?: number; pesoMaximo?: number },
): number {
  const { pesoMinimo = PESO_MIN, pesoMaximo = PESO_MAX_CNPJ } = opts ?? {};
  let peso = pesoMinimo;
  let soma = 0;

  for (const value of values.toReversed()) {
    soma += value * peso;
    peso++;

    if (peso > pesoMaximo) peso = pesoMinimo;
  }

  return soma;
}
