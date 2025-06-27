# Agro Cultura

Sistema de cadastro e gerenciamento de produtores, fazendas e culturas agrícolas.

## Descrição

Esta aplicação é um sistema backend desenvolvido com NestJS que permite o gerenciamento de produtores rurais, suas fazendas e culturas agrícolas. O sistema oferece uma API RESTful completa com autenticação e documentação OpenAPI.

## Pré-requisitos

- Node.js (versão 18 ou superior)
- Yarn (gerenciador de pacotes)
- PostgreSQL (banco de dados)

## Instalação

1. Clone o repositório:

```bash
git clone https://github.com/renancpin/agro-cultura
cd agro-cultura
```

2. Instale as dependências:

```bash
yarn install
```

3. Configure as variáveis de ambiente:
   Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Banco de Dados
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=postgres

# Ambiente
NODE_ENV=development
PORT=3000

# Autenticação
JWT_SECRET=mysecret
JWT_EXPIRATION=3600s
```

## Executando a aplicação

Lembre-se de executar as migrações quando necessário:

```bash
yarn typeorm:migrate
```

```bash
# Modo desenvolvimento
yarn start:dev

# Modo produção
yarn build
yarn start:prod
```

A aplicação estará disponível em `http://localhost:3000` (ou na porta especificada no arquivo .env).

## **Docker**

Para rodar a aplicação em Docker, execute:

```bash
yarn compose:up

# Se desejar repetir o processo forçando o build:
yarn compose:up --build
```

Se desejar remover os containers e imagens:

```bash
yarn compose:down
```

### Desenvolvendo em container

É possível executar a aplicação em modo _watch_ (_dev_) e desenvolver diretamente no container, atualizando-se com cada alteração no código-fonte

```bash
# Iniciar containers em modo "watch"
yarn compose:up:dev
```

## Documentação da API

Ao executar a aplicação, uma documentação em formato OpenAPI é gerada automaticamente.

A documentação da API está disponível através do Swagger UI:

- Interface Swagger: `http://localhost:3000/openapi`
- Especificação OpenAPI em JSON: `http://localhost:3000/openapi-json`
- Especificação OpenAPI em YAML: `http://localhost:3000/openapi-yaml`

## Testes

```bash
# Testes unitários
yarn test

# Testes unitários com watch mode
yarn test:watch

# Testes com cobertura
yarn test:cov

# Testes end-to-end
yarn test:e2e
```

## Estrutura Básicas do Projeto

Cada módulo da aplicação contém os dtos, serviços e controllers. Esta estrutura ajuda a separar as responsabilidades e modularizar as partes da aplicação para melhor manutenção

```
src/
├── config/         # Configurações da aplicação
├── modules/        # Módulos da aplicação
│   ├── auth/       # Autenticação
│   ├── users/      # Usuários
│   ├── produtores/ # Produtores
│   ├── fazendas/   # Fazendas
│   └── culturas/   # Culturas
├── shared/         # Recursos compartilhados
└── main.ts         # Ponto de entrada da aplicação
```

## **Exemplo Prático**

Uma versão desta aplicação está hospedada no link **https://agro-cultura.onrender.com**

Uma documentação interativa em formato OpenAPI/Swagger pode ser encontrada em [/openapi](https://agro-cultura.onrender.com/openapi).

- Documentação OpenAPI em formato [**.json**](https://agro-cultura.onrender.com/openapi-json)
- Documentação OpenAPI em formato [**.yaml**](https://agro-cultura.onrender.com/openapi-yaml)

## Tecnologias Utilizadas

- TypeScript - Linguagem de programação
- NestJS - Framework Node.js
- TypeORM - ORM para PostgreSQL
- Passport - Autenticação
- JWT - Tokens de autenticação
- Swagger/OpenAPI - Documentação da API
- Jest - Testes

## Licença

Este projeto está licenciado sob a licença [GPL-3.0](https://www.gnu.org/licenses/gpl-3.0.html).
