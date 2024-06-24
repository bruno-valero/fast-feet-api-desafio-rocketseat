# FastFeet API - Desafio Rocketseat

[![Typescript Badge](https://img.shields.io/badge/TypeScript-20232A?style=for-the-badge&logo=typescript&logoColor=007acd&link=https://gist.github.com/bruno-valero/302a8b36f8fb5749bd15866b523b315e)](https://gist.github.com/bruno-valero/302a8b36f8fb5749bd15866b523b315e)
[![NodeJS Badge](https://img.shields.io/badge/Node.js-20232A?style=for-the-badge&logo=node.js&logoColor=68a063&link=https://gist.github.com/bruno-valero/9c4167a53b05049712ee0333c5664904)](https://gist.github.com/bruno-valero/9c4167a53b05049712ee0333c5664904)
[![NestJS Badge](https://img.shields.io/badge/Nest.js-20232A?style=for-the-badge&logo=nestjs&logoColor=f00057&link=https://gist.github.com/bruno-valero/9c790eee84ac5cecbf41962c79098f9d)](https://gist.github.com/bruno-valero/9c790eee84ac5cecbf41962c79098f9d)

Nesse desafio desenvolveremos uma API para controle de encomendas de uma transportadora fictícia, a FastFeet.

Confira o enunciado do desafio no [Notion](https://efficient-sloth-d85.notion.site/Desafio-04-a3a2ef9297ad47b1a94f89b197274ffd)

### Requisitos Funcionais

- [x] A aplicação deve ter dois tipos de usuário, entregador e/ou admin
- [x] Deve ser possível realizar login com CPF e Senha
- [x] Deve ser possível realizar o CRUD dos entregadores
- [x] Deve ser possível realizar o CRUD das encomendas
- [x] Deve ser possível realizar o CRUD dos destinatários
- [x] Deve ser possível marcar uma encomenda como aguardando (Disponível para retirada)
- [x] Deve ser possível retirar uma encomenda
- [x] Deve ser possível marcar uma encomenda como entregue
- [x] Deve ser possível marcar uma encomenda como devolvida
- [x] Deve ser possível listar as encomendas com endereços de entrega próximo ao local do entregador
- [x] Deve ser possível alterar a senha de um usuário
- [x] Deve ser possível listar as entregas de um usuário
- [x] Deve ser possível notificar o destinatário a cada alteração no status da encomenda

### Regras de Negócio

- [x] Somente usuário do tipo admin pode realizar operações de CRUD nas encomendas
- [x] Somente usuário do tipo admin pode realizar operações de CRUD dos entregadores
- [x] Somente usuário do tipo admin pode realizar operações de CRUD dos destinatários
- [x] Para marcar uma encomenda como entregue é obrigatório o envio de uma foto
- [x] Somente o entregador que retirou a encomenda pode marcar ela como entregue
- [x] Somente o admin pode alterar a senha de um usuário
- [x] Não deve ser possível um entregador listar as encomendas de outro entregador

### Requisitos Não Funcionais

- [x] os dados devem ser persistidos num banco de dados postgreSql
- [x] as fotos comprovando a entrega devem ser armazenadas no cloudfare R2
- [x] Devem se realizados testes unitários para todas as funcionalidades
- [x] Devem se realizados testes end-to-end para todas as rotas http
- [x] Deve ser implementado o CI (Continuous Integration) através das Github Actions
