import { pickProperties } from './pick-properties.transformer';

describe('Transformadores', () => {
  describe('pickProperties', () => {
    it('deve pegar as propriedades id e nome do objeto', () => {
      const input = {
        id: 'uuid',
        nome: 'Fulano de tal',
        idade: 35,
      };

      const expectedResult = {
        id: input.id,
        nome: input.nome,
      };

      const result = pickProperties(input, 'id', 'nome');
      expect(result).toEqual(expectedResult);
    });
  });
});
