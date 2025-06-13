import { CpfCnpjVerificado, validaCpfCnpj } from './cpf-cnpj.validator';

describe('Validadores', () => {
  describe('validaCpfCnpj', () => {
    it('deve validar cpf: 123.456.789-09', () => {
      const input = '123.456.789-09';
      const stripped = '12345678909';

      const expectedResult: CpfCnpjVerificado = {
        isValid: true,
        originalValue: stripped,
        strippedCpfCnpj: stripped,
        maskedCpfCnpj: input,
      };

      const result = validaCpfCnpj(input);
      expect(result).toEqual(expectedResult);
    });

    it('deve validar cnpj: 12.345.678/0001-95', () => {
      const input = '12.345.678/0001-95';
      const stripped = '12345678000195';

      const expectedResult: CpfCnpjVerificado = {
        isValid: true,
        maskedCpfCnpj: input,
        originalValue: stripped,
        strippedCpfCnpj: stripped,
      };

      const result = validaCpfCnpj(input);
      expect(result).toEqual(expectedResult);
    });
    it('deve validar cnpj novo (alfanumerico): 12.ABC.345/01DE-35', () => {
      const input = '12.ABC.345/01DE-35';
      const stripped = '12ABC34501DE35';

      const expectedResult: CpfCnpjVerificado = {
        isValid: true,
        maskedCpfCnpj: input,
        originalValue: stripped,
        strippedCpfCnpj: stripped,
      };

      const result = validaCpfCnpj(input);
      expect(result).toEqual(expectedResult);
    });
  });
});
