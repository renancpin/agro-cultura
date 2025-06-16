import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwaggerPlugin(app: INestApplication) {
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('AgroCultura')
    .setDescription(
      `### API para cadastro de Produtores, Fazendas e Culturas em todo o Brasil

<details open>
<summary>**Começando**</summary>

1. Crie seu usuário em \`POST /auth/register\`

2. Faça login em \`POST /auth/login\` com os dados usados no passo 1

3. Copie o conteúdo do \`access_token\` da resposta e adicione-o no menu Authorize (campo \`value\`)

Pronto, agora é possível acessar as outras rotas disponíveis.

Bom proveito!
</details>
---

<details>
<summary>**Links Úteis**</summary>
- Esta documentação: <https://agro-cultura.onrender.com/openapi>
  * Formato [yaml](/openapi-yaml)
  * Formato [json](/openapi-json)
- [Código Fonte](https://github.com/renancpin/agro-cultura) da API
</details>

<details open>
<summary>**Minhas redes**</summary>
- Github: <https://github.com/renancpin>
- Linkedin: <https://linkedin.com/in/renan-c-pinheiro>
- Email: [renan.coelho.p@gmail.com](mailto://renan.coelho.p@gmail.com)
</details>`,
    )
    .setVersion('1.0')
    .setLicense(
      'GLP v3.0',
      'https://github.com/renancpin/agro-cultura?tab=GPL-3.0-1-ov-file#readme',
    )
    .setContact(
      'Renan Pinheiro',
      'github.com/renancpin',
      'renan.coelho.p@gmail.com',
    )
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('openapi', app, documentFactory);
}
